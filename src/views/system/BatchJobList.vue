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

        <div slot="jobName" slot-scope="text, record">
          <a @click="handleEdit(record)">{{text}}</a>
        </div>

        <div slot="action" slot-scope="text, record">

          <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() => handleDelete(record)" placement="topRight">
            <a><a-icon type="delete"/>{{$t('app.common.delete')}}</a>
          </a-popconfirm>
        </div>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <batch-job-modal ref="modalForm" @ok="modalFormOk"></batch-job-modal>
  </a-card>
</template>
<style scoped>
.icons-list >>> .anticon {
  margin-right: 6px;
  font-size: 20px;
}
</style>
<script>
  import BatchJobModal from './modules/BatchJobModal'
  import { getAction ,postAction, deleteA} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import {simpleDelete} from '@/api/api'

  export default {
    name: "BatchJobList",
    mixins:[JeecgListMixin],
    components: {
      BatchJobModal,
      JEllipsis
    },
    data () {
      return {
        description: this.$t('app.message.msg0304'),
        // 查询条件
        queryParam: {dbDomain:"batch_job_info", sqlId:"searchBatchJobsNew"},

        isorter:{column:"jobName",order:"asc"},
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
            title: this.$t('app.label.batchJob.jobId'),
            align:"left",
            width:100,
            dataIndex: 'id',
            sorter: true,
          },
          {
            title: this.$t('app.label.batchJob.jobNameLabel'),
            align:"left",
            dataIndex: 'jobName',
            sorter: true,
            scopedSlots: { customRender: 'jobName' },
          },
          {
            title: this.$t('app.label.batchJob.jobHandlerLabel'),
            align:"left",
            dataIndex: 'jobHandler',
            sorter: true,
          },
          {
            title: this.$t('app.common.operation'),
            dataIndex: 'action',
            align:"center",
            width:90,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/commonProcess/page",
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
        this.simpleActionProcess4List(simpleDelete({dbDomain:"batch_job_info",params:[{id:record.id, exclcnt:record.exclcnt}]}));
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>