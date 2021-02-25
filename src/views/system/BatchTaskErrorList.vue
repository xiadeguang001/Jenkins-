<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="4" :sm="10">
            <a-form-item :label="$t('app.label.batchJob.task')">
              <j-custom-search-tag
                  url="/sys/task/allTasks"
                  valueName="id"
                  textName="taskName"
                  v-model="queryParam.taskId"
                  >
                </j-custom-search-tag>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="8">
            <a-form-item :label="$t('app.label.batchJob.errorHandleStatus')">
              <j-dict-select-tag style="width:100%" dictCode="task_error_handle_state" :triggerChange="false" v-model="queryParam.errorHandleStatus"/>
            </a-form-item>
          </a-col>

          <a-col :md="16" :sm="7">
            <a-form-item :label="$t('app.label.batchJob.runTime')">
              <a-range-picker
                format="YYYY-MM-DD HH:mm:ss"
                show-time
                v-model="dateRange"
                :placeholder="[$t('app.label.batchJob.startTime'), $t('app.label.batchJob.endTime')]"
                @change="onDateChange"
                @ok="onDateOk"
              />
              <a-button style="margin-left:15px" type="primary" @click="searchQuery" icon="search">{{$t('app.common.search')}}</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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

        <div slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-show="true"><a-icon type="copy"/>{{$t('app.common.detail')}}</a>
        </div>

        <span slot="filePath" slot-scope="text, record">
          <a @click="downloadFile(record)"><j-ellipsis :value="text" :length="30"/></a>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <batch-task-record-modal ref="modalForm" @ok="modalFormOk"></batch-task-record-modal>
  </a-card>
</template>
<style scoped>
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 20px;
}
</style>
<script>
  import BatchTaskRecordModal from './modules/BatchTaskRecordModal'
  import { getAction ,postAction, deleteA} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import {batchJobDelete} from '@/api/api'
  import JCustomSearchTag from '@/components/dict/JCustomSearchTag'
  import {download} from '@/utils/util'
  import moment from 'moment'

  export default {
    name: "BatchJobList",
    mixins:[JeecgListMixin],
    components: {
      BatchTaskRecordModal,
      JEllipsis,
      JCustomSearchTag
    },
    data () {
      return {
        description: this.$t('app.message.msg0304'),
        // 查询条件
        dateRange:[moment().add(-1, 'months'), moment()],
        queryParam: {
          // searchTimeStart:moment().add(-1, 'months').format('YYYY-MM-DD HH:mm:ss'),
          // searchTimeEnd: moment().format('YYYY-MM-DD HH:mm:ss'),
          errorHandleStatus:"0"
          },

        isorter:{column:"startTime",order:"desc"},
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
            title: this.$t('app.label.batchJob.taskRecordId'),
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
          },
          {
            title: this.$t('app.label.batchJob.startTime'),
            align:"center",
            width:180,
            dataIndex: 'startTime',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.endTime'),
            align:"center",
            width:180,
            dataIndex: 'endTime',
            sorter: true,
          },
          {
            title: this.$t('app.label.batchJob.processTime'),
            align:"left",
            width:180,
            dataIndex: 'processTime',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.processResult'),
            align:"center",
            width:140,
            dataIndex: 'result_dictText',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.logFilePath'),
            align:"left",
            dataIndex: 'logFileName',
            scopedSlots: { customRender: 'filePath' },
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.errorHandleStatus'),
            align:"center",
            width:140,
            dataIndex: 'errorHandleStatus_dictText',
            sorter: true,
          },

          {
            title: this.$t('app.label.batchJob.errorHandleTime'),
            align:"center",
            width:140,
            dataIndex: 'errorHandleTime',
            sorter: true,
          },
          {
            title: this.$t('app.common.operation'),
            align:"center",
            width:90,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/taskRecord/list",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },

    methods: {
      runNow(record) {

      },

      onDateChange(value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.searchTimeStart=dateString[0];
        this.queryParam.searchTimeEnd=dateString[1];
      },

      onDateOk(value) {
        console.log(value);
      },

      downloadFile(record) {
        if (record.logFilePath === null) return;
        download(record.logFilePath, record.logFileName);
      },
    }
    
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>