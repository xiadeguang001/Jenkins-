<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <a-col :md="6" :sm="10">
            <a-form-item :label="$t('app.label.quartzJob.jobTaskName')">
              <a-input :placeholder="$t('app.Login.10008')" v-model="queryParam.jobClassName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item :label="$t('app.label.quartzJob.taskStatus')">
              <a-select style="width: 220px" v-model="queryParam.status" :placeholder="$t('app.Login.10009')">
                <a-select-option value="">{{$t('app.common.all')}}</a-select-option>
                <a-select-option value="0">{{$t('app.label.normal')}}</a-select-option>
                <a-select-option value="-1">{{$t('app.common.tingzhi')}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="10" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{$t('app.common.search')}}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{$t('app.common.reload')}}</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls($t('app.label.quartzJob.jobTaskInfo'))" v-show="false">{{$t('app.common.export')}}</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import" v-show="false">{{$t('app.common.import')}}</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>{{$t('app.common.delete')}}</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> {{$t('app.common.batchOperation')}} <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>{{$t('app.common.selected')}}  <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">{{$t('app.common.clear')}}</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">

        <!-- 字符串超长截取省略号显示-->
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>
        <span slot="parameterRender" slot-scope="text">
          <j-ellipsis :value="text" :length="20" />
        </span>


        <span slot="action" slot-scope="text, record">
          <a-span @click="resumeJob(record)" class= "fa fa-repeat "></a-span>
          <a-divider type="vertical" />
          <a-span @click="pauseJob(record)" class= "fa fa-pause" ></a-span>
          <a-divider type="vertical" />
          <a-span  @click="handleEdit(record)" class= "fa fa-edit"></a-span >
          <a-divider type="vertical" />
          <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() => handleDelete(record.id)">
                  <a-span class= "fa fa-remove"></a-span>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-span  @click="trigger(record)" class= "fa fa-play"></a-span >
          <!-- <a-divider type="vertical" /> -->
          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item><a @click="handleEdit(record)">编辑</a></a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

        <!-- 状态渲染模板 -->
        <template slot="customRenderStatus" slot-scope="status">
          <a-tag v-if="status==0" color="green">{{$t('app.message.msg0302')}}</a-tag>
          <a-tag v-if="status==-1" color="orange">{{$t('app.message.msg0303')}}</a-tag>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <quartzJob-modal ref="modalForm" @ok="modalFormOk"></quartzJob-modal>
  </a-card>
</template>

<script>
  import QuartzJobModal from './modules/QuartzJobModal'
  import { getAction ,postAction} from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from "@/components/jeecg/JEllipsis";

  export default {
    name: "QuartzJobList",
    mixins:[JeecgListMixin],
    components: {
      QuartzJobModal,
      JEllipsis
    },
    data () {
      return {
        description: this.$t('app.message.msg0304'),
        // 查询条件
        queryParam: {},
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
            title: this.$t('app.label.quartzJob.jobTaskName'),
            align:"center",
            dataIndex: 'jobClassName',
            sorter: true,
/*            customRender:function (text) {
              return "*"+text.substring(9,text.length);
            }*/
          },
          {
            title: this.$t('app.label.quartzJob.cronExpression'),
            align:"center",
            dataIndex: 'cronExpression'
          },
          {
            title: this.$t('app.label.quartzJob.jobPrams'),
            align:"center",
            width: 150,
            dataIndex: 'parameter',
            scopedSlots: {customRender: 'parameterRender'},
          },
          {
            title: this.$t('app.label.description'),
            align:"center",
            width: 250,
            dataIndex: 'description',
            scopedSlots: {customRender: 'description'},
          },
          {
            title: this.$t('app.label.status'),
            align:"center",
            dataIndex: 'status',
            scopedSlots: { customRender: 'customRenderStatus' },
            filterMultiple: false,
            filters: [
              { text: this.$t('app.message.msg0302'), value: '0' },
              { text: this.$t('app.message.msg0303'), value: '-1' },
            ]
          },
          {
            title: this.$t('app.common.operation'),
            dataIndex: 'action',
            align:"center",
            width:280,
            scopedSlots: { customRender: 'action' },
          }
        ],
		url: {
          list: "/sys/quartzJob/list",
          delete: "/sys/quartzJob/delete",
          deleteBatch: "/sys/quartzJob/deleteBatch",
          pause: "/sys/quartzJob/pause",
          resume: "/sys/quartzJob/resume",
          exportXlsUrl: "sys/quartzJob/exportXls",
          importExcelUrl: "sys/quartzJob/importExcel",
          trigger:"/sys/quartzJob/trigger",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },

    methods: {

      //筛选需要重写handleTableChange
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        if (Object.keys(sorter).length > 0) {
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        }
        //这种筛选方式只支持单选
        this.filters.status = filters.status[0];
        this.ipagination = pagination;
        this.loadData();
      },
      pauseJob: function(record){
        var that = this;
        //暂停定时任务
        this.$confirm({
          title:this.$t('app.message.msg0057'),
          content:this.$t('app.message.msg0058'),
          onOk: function(){
            getAction(that.url.pause,{jobClassName:record.jobClassName}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });

      },
      resumeJob: function(record){
        var that = this;
        //恢复定时任务
        this.$confirm({
          title:this.$t('app.message.msg0055'),
          content: this.$t('app.message.msg0056'),
          onOk: function(){
            getAction(that.url.resume,{jobClassName:record.jobClassName}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });
      },
      trigger: function(record){
        var that = this;
        //恢复定时任务
        this.$confirm({
          title:this.$t('app.message.msg0055'),
          content:this.$t('app.message.msg0056'),
          onOk: function(){
            postAction(that.url.trigger,{jobClassName:record.jobClassName}).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              }else{
                that.$message.warning(res.message);
              }
            });
          }
        });
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>