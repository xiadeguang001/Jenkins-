<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1100"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline"  @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <!-- 供应商编号 -->
            <a-col :span="6">
              <a-form-item label="供应商编号" >
                <j-input v-model="queryParam.suppCode"></j-input>
              </a-form-item>
            </a-col>
            <!-- 供应商姓名 -->
            <a-col :span="6">
              <a-form-item label="供应商姓名" >
                <j-input v-model="queryParam.suppName"></j-input>
              </a-form-item>
            </a-col>
            <a-col :span="6" :style="{marginLeft:'42px'}">
               <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <!-- 查询按钮 -->
                  <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                  <!-- 重置按钮 -->
                  <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
                </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- table区域-begin -->
      <div>
        <a-table
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys, onSelectAll:onSelectAll,onSelect:onSelect, type: checkBoxFlg ? 'checkbox':'radio'}"
          :customRow="customRowFn"
          :scroll="{y: 300 }"
          :rowClassName="InterlaceDiscoloration"
          @change="handleTableChange">

          <!-- 供应商名称 字符串超长截取省略号显示-->
          <span slot="suppName" slot-scope="text">
            <j-ellipsis :value="text" :length="13" />
          </span>
          <!-- 地址 字符串超长截取省略号显示-->
          <span slot="suppLnkAdd" slot-scope="text">
            <j-ellipsis :value="text" :length="13" />
          </span>
          <!-- 联系人 字符串超长截取省略号显示-->
          <span slot="suppLnkName" slot-scope="text">
            <j-ellipsis :value="text" :length="6" />
          </span>
          <!-- 邮件地址 字符串超长截取省略号显示-->
          <span slot="suppLnkEmail" slot-scope="text">
            <j-ellipsis :value="text" :length="15" />
          </span>
          <!-- 电话 字符串超长截取省略号显示-->
          <span slot="suppLnkTel" slot-scope="text">
            <j-ellipsis :value="text" :length="11" />
          </span>

        </a-table>
      </div>
      <!-- table区域-end -->
    </a-modal>
    <lookup-user ref="selectUser" @ok="selectUserOk"></lookup-user>
  </div>
</template>

<script>
  import {filterObj} from '@/utils/util'
  import {getAction} from '@/api/manage'
  import JInput from '@/components/jeecg/JInput'
  import lookupUser from './LookupUser'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "LookupSupplier",
    components: {
      JInput,
      lookupUser,
      JEllipsis,
    },
    mixins:[JeecgListMixin],
    data() {
      return {
        title: "供应商选择",
        description: this.$t('app.label.supplierView'),
        visible: false,  
        checkBoxFlg:false,
        // 查询条件
        queryParam: {
            suppCode:'',
            suppName:'',
        },
         // 分页参数
        ipagination: {
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        //数据源
        dataSource:[],
        //选中数据
        selectedTable:[],
        loading: false,
        // table选中keys
        selectedRowKeys: [],
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key: 'rowIndex',
          //   width: 40,
          //   align: "center",
          //   fixed:"left",
          //   customRender: function (t, r, index) {
          //     return parseInt(index) + 1;
          //   }
          // },
          {
            title: '供应商编号',
            align:"left",
            width:120,
            dataIndex: 'suppCode',
            sorter: true
          },
          {
            title: '供应商名',
            align:"left",
            width:200,
            dataIndex: 'suppName',
            scopedSlots: {customRender: 'suppName'},
            sorter: true
          },
          {
            title: '联系人',
            align:"left",
            width:100,
            dataIndex: 'suppLnkName',
            scopedSlots: {customRender: 'suppLnkName'}
          },
          {
            title: '联系地址',
            align:"left",
            width:210,
            dataIndex: 'suppLnkAdd',
            scopedSlots: {customRender: 'suppLnkAdd'}
          },
          {
            title: '联系电话',
            align:"left",
            width:120,
            dataIndex: 'suppLnkTel',
            scopedSlots: {customRender: 'suppLnkTel'}
          },
          {
            title: '邮件地址',
            align:"left",
            dataIndex: 'suppLnkEmail',
            scopedSlots: {customRender: 'suppLnkEmail'}
          },
        ],
        //查询排序
        isorter: { 
          column: 'suppCode',
          order: 'asc',
        },
        url: {
          list: "/master/mstSupplier/list",
        }
      }
    },
    beforeUpdate: function() {
      const than=this;
      than.columns.forEach(tabColumns => {
        if (tabColumns.dataIndex == 'leadTimeAndLeadTimeUnit') {
          than.dataSource.forEach(listData => {
            listData.leadTimeAndLeadTimeUnit = listData.leadTime+listData.leadTimeUnit_dictText;
          })
        }
      })
    },
    methods: {

      add(flag){
          this.visible = true;
          this.checkBoxFlg=flag;
          this.loadData();
      },
      //画面加载
      loadData(){
          var params = this.getQueryParams();//查询条件
          this.loading = true;
          const than=this;
          than.dataSource=[];
          getAction(than.url.list, params).then((res) => {
              if (res.success) {
                  than.dataSource = Object.assign(res.result.records,than.dataSource);
                  than.ipagination.total = res.result.total;
              }
              this.loading = false;
          })
      },
      //查询条件
      getQueryParams() {
          var param = Object.assign({}, this.queryParam, this.isorter);
          param.field = this.getQueryField();
          param.pageNo = this.ipagination.current;
          param.pageSize = this.ipagination.pageSize;
          return filterObj(param);
      },
      // 全部选择
      onSelectAll(selected, selectedRows, changeRows) {
        const that = this;
        if (selected === true) {
          selectedRows.forEach(selectTable =>{
            let index = that.selectedRowKeys.indexOf(selectTable.id)
            if(index === -1){
              that.selectedTable.push(selectTable);
              that.selectedRowKeys.push(selectTable.id);
            }else{
              return false;
            }
          })
        } else {
          this.dataSource.forEach(selectTable =>{
            let index = that.selectedRowKeys.indexOf(selectTable.id);
            if(index === -1){
                  return false;
              }else{
                  that.handleDeleteSelected(index,selectTable.id);
            }
          })
        }
      },
      // 选择
      onSelect(record, selected) {
        const that = this;
        if(that.checkBoxFlg==true){
          if (selected === true) {
            that.selectedRowKeys.push(record.id);
            that.selectedTable.push(record);
          } else {
            var index = that.selectedRowKeys.indexOf(record.id);
            if (index >= 0) {
              that.handleDeleteSelected(index,record.id)
            }
          }
        }else{
          that.selectedRowKeys =[record.id] ;
          that.selectedTable = [record];
        }
      },
      //行选择事件
      customRowFn(record) {
        const that = this;
          return {
            on: {
                click: () => {
                  if (!that.checkBoxFlg) {
                    that.selectedRowKeys =[record.id] ;
                    that.selectedTable =[record] ;
                  } else {
                    let index = that.selectedRowKeys.indexOf(record.id)
                    if (index === -1) {
                      that.selectedRowKeys.push(record.id)
                      that.selectedTable.push(record)
                    } else {
                      that.handleDeleteSelected(index,record.id)
                    }
                  }
                }
            }
          }
      },
        onSearch(){
         this.$refs.selectUser.add(false);
        },
        selectUserOk(record){
          this.queryParam.purchaseUserName=Object.assign({}, record[0]).realname;
        },
        /** 删除已选择的 */
        handleDeleteSelected(index,key) {
          this.selectedRowKeys.splice(index,1)
          this.selectedTable.splice(index, 1)
        },
        getQueryField() {
        //TODO 字段权限控制
        },
        //分页、排序、筛选变化时触发
        handleTableChange(pagination, filters, sorter) {
            console.log(sorter);
            //TODO 筛选
            if (Object.keys(sorter).length > 0) {
            this.isorter.column = sorter.field;
            this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
            }
            this.ipagination = pagination;
            this.loadData();
        },
        // 点击确定
        handleOk() {
            this.$emit("ok", this.selectedTable);
            this.visible = false;
        },
        // 查询按钮按下
        searchQuery() {
            this.loadData(1);
        },
        // 重置处理
        searchReset() {
            this.queryParam = {};
            this.loadData(1);
        },
        //关闭
        close () {
            this.$emit('close');
            this.visible = false;
        },
         // 取消按钮
        handleCancel () {
            this.close()
        }
    }
  }
</script>
<style lang="less" scoped>
  .ant-card-body .table-operator {
    margin-bottom: 18px;
  }

  .ant-table-tbody .ant-table-row td {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .anty-row-operator button {
    margin: 0 5px
  }

  .ant-btn-danger {
    background-color: #ffffff
  }

  .ant-modal-cust-warp {
    height: 100%
  }

  .ant-modal-cust-warp .ant-modal-body {
    height: calc(100% - 110px) !important;
    overflow-y: auto
  }

  .ant-modal-cust-warp .ant-modal-content {
    height: 90% !important;
    overflow-y: hidden
  }
</style>