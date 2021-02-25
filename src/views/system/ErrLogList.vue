<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <!-- タスク名 -->
          <a-col :md="5" :sm="8">
            <a-form-item :label="$t('app.label.errlog.jobname')">
              <a-input  v-model="queryParam.jobname"></a-input>
            </a-form-item>
          </a-col>

          <!-- 発生時刻 -->
          <a-col :md="5" :sm="8">
            <a-form-item :label="$t('app.label.errlog.errtime')" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-range-picker
                v-model="queryParam.errtime"
                format="YYYY-MM-DD"
                :placeholder="[$t('app.label.errlog.startTime'), $t('app.label.errlog.endTime')]"
                @change="onDateChange"
                @ok="onDateOk"
              />
            </a-form-item>
          </a-col>

          <!-- 対応状況 -->
          <a-col :md="5" :sm="8">
            <a-form-item :label="$t('app.label.user.status')">
              <j-dict-select-tag dictCode="status_flg" :triggerChange="false" v-model="queryParam.status"/>
            </a-form-item>
          </a-col>

          <!-- 按钮部分 -->
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <!-- 查询 -->
              <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
              <!-- 重置 -->
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- table区域-begin -->
    <a-table
      ref="table"
        bordered
        size="middle"
        rowKey="no"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{x:1600}"
        :rowClassName="InterlaceDiscoloration"
        @change="handleTableChange">

        <span slot="errormsg" slot-scope="text">
          <j-ellipsis :value="text" :length="30" />
        </span>

      <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)">
            <a-icon type="edit"/>{{$t('app.common.edit')}}</a>
      </span>
    </a-table>
    <!-- table区域-end -->
    <err-log-modal ref="modalForm" @ok="modalFormOk"></err-log-modal>
  </a-card>
</template>

<script>
  import ErrLogModal from './modules/ErrLogModal'
  import { filterObj } from '@/utils/util';
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  export default {
    name: "LogList",
    mixins:[JeecgListMixin],
    components: {
      ErrLogModal,
      JEllipsis
    },
    data () {
      return {
        description: '这是日志管理页面',
        // 查询条件
        queryParam: {
          ipInfo:'',
          createTimeRange:[],
          logType:'1',
          keyWord:'',
        },
        tabKey: "1",
        // 表头
        columns: [
          {
            // エラーNo
            title: this.$t('app.label.errlog.errno'),
            align: "left",
            dataIndex: 'no',
            width: 200
          },
          {
            // 発生時刻
            title: this.$t('app.label.errlog.errtime'),
            align: "left",
            width: 320,
            dataIndex: 'errortime',
          },
          {
            // タスク名
            title: this.$t('app.label.errlog.jobname'),
            align: "left",
            width: 200,
            dataIndex: 'jobname',
            sorter: true
          },
          {
            // エラーメッセージ
            title: this.$t('app.label.errlog.errormsg'),
            align: "left",
            width: 500,
            dataIndex: 'errormsg',
            scopedSlots: { customRender: 'errormsg' },
          },
          {
            // 対応状況
            title: this.$t('app.label.user.status'),
            align: "left",
            width: 300,
            dataIndex: 'statusFlg_dictText'
          },
          {
            //  備考
            title: this.$t('app.label.Job.remark'),
            align: "left",
            width: 300,
            dataIndex: 'biko'
          },
          {
            // 操作
            title: this.$t('app.common.operation'),
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 140,
            fixed:"right",
          }
        ],
        labelCol: {
          xs: { span: 1 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 10 },
          sm: { span: 16 },
        },
        url: {
          list: "/sys/errLog/list",
        },
      }
    },
    methods: {
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTimeRange; // 时间参数不传递后台
        if (this.superQueryParams) {
          param['superQueryParams'] = encodeURI(this.superQueryParams)
          param['superQueryMatchType'] = this.superQueryMatchType
        }
        delete param.errtime
        return filterObj(param);
      },

      // 重置
      searchReset(){
        var that = this;
        var logType = that.queryParam.logType;
        that.queryParam = {}; //清空查询区域参数
        that.queryParam.logType = logType;
        that.loadData(this.ipagination.current);
      },
      // 日志类型
      callback(key){

        // 动态添加操作类型列
        if (key == 2) {
          this.tabKey = '2';
          this.columns.splice(7, 0, this.operateColumn);
        }else if(this.columns.length == 9)
        {
          this.tabKey = '1';
          this.columns.splice(7,1);
        }

        let that=this;
        that.queryParam.logType=key;
        that.loadData();
      },
      onDateChange: function (value, dateString) {
        console.log(dateString[0],dateString[1]);
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>
