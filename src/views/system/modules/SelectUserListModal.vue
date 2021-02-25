<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
   :cancelText="$t('app.common.close')">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :span="6">
            <a-form-item :label="$t('app.label.accountNumber')">
              <a-input  v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item label="性别">
              <a-select v-model="queryParam.sex" >
                <a-select-option value="1">{{this.$t('app.label.man')}}</a-select-option>
                <a-select-option value="2">{{this.$t('app.label.woman')}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          
          <a-col :span="6">
            <a-form-item label="用户状态">
              <a-select v-model="queryParam.status" >
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="2">冻结</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :span="6" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchByquery" icon="search">{{this.$t('app.common.search')}}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>
 <!--    update-begin author:kangxiaolin   date:20190921   for:系统发送通知 用户多选失败 #513  -->
    <a-table
      ref="table"
      bordered
      rowKey="id"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="ipagination"
      :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange,onSelect:onSelect}"
      :rowClassName="InterlaceDiscoloration"
      @change="handleTableChange"
    >
<!--     update-end   author:kangxiaolin  date:20190921     for:系统发送通知 用户多选失败 #513 -->
    </a-table>
  </a-modal>
</template>

<script>
  import { filterObj } from '@/utils/util';

  import { getUserList } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "SelectUserListModal",
    components: {
    },
    mixins:[JeecgListMixin],
    data () {
      return {
        title: this.$t('app.label.choseUser'),
        queryParam: {},
        columns: [
          {
          title: this.$t('app.label.userName'),
          align:"left",
          dataIndex: 'username',
          fixed:'left',
          width:200
          },
          {
            title: this.$t('app.label.realName'),
            align:"left",
            dataIndex: 'realname',
          },
          {
            title: this.$t('app.label.sex'),
            align:"left",
            dataIndex: 'sex_dictText',
          },
          {
            title: this.$t('app.label.phoneNumber'),
            align:"left",
            dataIndex: 'phone'
          },
          {
            title: '邮件',
            align:"left",
            dataIndex: 'email'
          },
          {
            title: '用户状态',
            align:"left",
            dataIndex: 'status_dictText',
          }],
        dataSource:[],
        ipagination:{
          current: 1,
          pageSize: 5,
          pageSizeOptions: ['5', '10', '20'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] +  this.$t('app.label.altogether') + total + this.$t('app.label.strip')
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        isorter:{
          column: 'createTime',
          order: 'desc',
        },
        selectedRowKeys: [],
        selectionRows: [],
        visible:false,
      }
    },
    created() {
      this.loadData();
    },
    methods: {
      add (selectUser,userIds) {
        this.visible = true;
        this.edit(selectUser,userIds);
      },
      edit(selectUser,userIds){
        if(userIds.length == 0){
          this.selectedRowKeys = []
        }else{
          this.selectedRowKeys = userIds.split(',')
          for(var i=0;i<this.selectedRowKeys.length;i++){
             this.selectedRowKeys[i]=parseInt(this.selectedRowKeys[i])
          }
        }
        if(!selectUser){
          this.selectionRows=[]
        }else{
          var that=this;
          that.selectionRows=[];
          selectUser.forEach(function(record,index){
            console.log(record)
            that.selectionRows.push({id: that.selectedRowKeys[index],realname:record})
          })
          // this.selectionRows = selectUser;
        }
      },
      loadData (arg){
        if(arg===1){
          this.ipagination.current = 1;
        }
        let params = this.getQueryParams();//查询条件
        getUserList(params).then((res)=>{
          if(res.success){
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
        })
      },
      getQueryParams(){
        let param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        //--update-begin----author:scott---date:20190818------for:新建公告时指定特定用户翻页错误SelectUserListModal #379----
        // param.current = this.ipagination.current;
        // param.pageSize = this.ipagination.pageSize;
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        //--update-end----author:scott---date:20190818------for:新建公告时指定特定用户翻页错误SelectUserListModal #379---
        return filterObj(param);
      },
      getQueryField(){
        let str = "id,";
        for(let a = 0;a<this.columns.length;a++){
          str+=","+this.columns[a].dataIndex;
        }
        return str;
      },
      //--update-begin----author:kangxiaolin---date:20190921------for:系统发送通知 用户多选失败 #513----
      onSelectChange (selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      onSelect(record, selected){
        if(selected == true ){
          this.selectionRows.push(record);
        }else {
          this.selectionRows.forEach(function(item,index,arr){
            if(item.id == record.id) {
              arr.splice(index, 1);
            }
          })
        }
        //--update-end----author:kangxiaolin---date:20190921------for:系统发送通知 用户多选失败 #513----
      },

      searchReset(){
        let that = this;
        Object.keys(that.queryParam).forEach(function(key){
          that.queryParam[key] = '';
        });
        that.loadData(1);
      },
      handleTableChange(pagination, filters, sorter){
        //TODO 筛选
        if (Object.keys(sorter).length>0){
          this.isorter.column = sorter.field;
          this.isorter.order = "ascend"==sorter.order?"asc":"desc"
        }
        this.ipagination = pagination;
        this.loadData();
      },
      handleCancel () {
        this.selectionRows = [];
        this.selectedRowKeys = [];
        this.visible = false;
      },
      handleOk () {
        this.$emit("choseUser",this.selectionRows);
        this.handleCancel();
      },
      searchByquery(){
        this.loadData(1);
      },
    }
  }
</script>
<style scoped>
  .ant-card-body .table-operator{
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:15px;
    padding-bottom:15px;
  }
  .anty-row-operator button{margin: 0 5px}
  .ant-btn-danger{background-color: #ffffff}

  .ant-modal-cust-warp{height: 100%}
  .ant-modal-cust-warp .ant-modal-body{height:calc(100% - 110px) !important;overflow-y: auto}
  .ant-modal-cust-warp .ant-modal-content{height:90% !important;overflow-y: hidden}

  .anty-img-wrap{height:25px;position: relative;}
  .anty-img-wrap > img{max-height:100%;}
</style>