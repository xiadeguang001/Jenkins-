<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="10">
            <a-form-item :label="$t('app.label.batchJob.searchStringLabel')">
              <a-input v-model="queryParam.searchString"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="10" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{$t('app.common.search')}}</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
    </div>

    <!-- table区域-begin -->
    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange">

        <div slot="taskName" slot-scope="text, record">
          <a @click="handleEdit(record)">{{text}}</a>
        </div>

        <div slot="action" slot-scope="text, record">
          <a @click="resume(record)" v-show="record.pause"><a-icon type="play-circle"/>{{$t('app.label.batchJob.resume')}}</a>
          <a-divider type="vertical" v-show="record.pause"/>
          <a @click="stop(record)" v-show="record.normal"><a-icon type="pause-circle"/>{{$t('app.label.batchJob.stop')}}</a>
          <a-divider type="vertical" v-show="record.normal" />
          <a @click="runNow(record)" v-show="!record.executing"><a-icon type="play-circle"/>{{$t('app.label.batchJob.runNow')}}</a>
          <a-divider type="vertical" v-show="!record.executing" />
          <a @click="runHistory(record)"><a-icon type="snippets"/>{{$t('app.label.batchJob.runHistory')}}</a>
          <a-divider type="vertical"/>

          <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() => handleDelete(record)" placement="topRight">
            <a><a-icon type="delete"/>{{$t('app.common.delete')}}</a>
          </a-popconfirm>
        </div>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <batch-task-modal ref="modalForm" @ok="modalFormOk"></batch-task-modal>
  </a-card>
</template>
<style scoped>
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 20px;
}
</style>
<script>
  import BatchTaskModal from './modules/BatchTaskModal'
  import { getAction ,postAction, deleteA} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import {batchTaskDelete, startTask, stopTask, runTaskNow, stopTaskNow, commonProcess} from '@/api/api'

  export default {
    name: "BatchJobList",
    mixins:[JeecgListMixin],
    components: {
      BatchTaskModal,
      JEllipsis
    },
    data () {
      return {
        description: this.$t('app.message.msg0304'),
        // 查询条件
        queryParam: {dbDomain:"batch_task_info", sqlId:"searchListNew"},

        isorter:{column:"taskName",order:"asc"},
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },

          {
            title: this.$t('app.label.batchJob.taskId'),
            align:"left",
            width:100,
            dataIndex: 'id',
            sorter: true,
          },
          {
            title: this.$t('app.label.batchJob.taskName'),
            align:"left",
            dataIndex: 'taskName',
            sorter: true,
            scopedSlots: { customRender: 'taskName' },
          },
          {
            title: this.$t('app.label.batchJob.cronExpression'),
            align:"center",
            width:160,
            dataIndex: 'cronExpression',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.taskDescription'),
            align:"left",
            dataIndex: 'description',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.preRunTime'),
            align:"center",
            width:140,
            dataIndex: 'preRunTime',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.nextRunTime'),
            align:"center",
            width:140,
            dataIndex: 'nextRunTime',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.taskStatus'),
            align:"center",
            dataIndex: 'taskExecuteStatus_dictText',
            width:140,
            sorter: true,
          },
          {
            title: this.$t('app.common.operation'),
            align:"center",
            width:280,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/commonProcess/page",
          delete: "/sys/task/delete",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },

    methods: {
      handleDelete(record){
        this.simpleActionProcess4List(batchTaskDelete({id:record.id, exclcnt:record.exclcnt}));
      },

      resume(record) {
        this.simpleActionProcess4List(startTask({id:record.id, exclcnt:record.exclcnt}));
      },

      stop(record) {
        this.simpleActionProcess4List(stopTask({id:record.id, exclcnt:record.exclcnt}));
      },

      runNow(record) {
        this.simpleActionProcess4List(runTaskNow({id:record.id, exclcnt:record.exclcnt}));
      },

      //中止操作有问题，目前不使用
      stopNow(record) {
        this.simpleActionProcess4List(stopTaskNow({id:record.id, exclcnt:record.exclcnt}));
      },

      runHistory(record) {
        this.$router.push({ name: 'batch-batchTaskRecordList',query: {taskId:record.id} })
      },

      handleTestCommonProcess() {
        this.simpleActionProcess4List(commonProcess({dbDomain:"batch_task_info", sqlId:"getAllTasks", operationMod:"SQL", params:[]}));
      }
    }
    
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>