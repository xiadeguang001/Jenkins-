<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1200"
      destroyOnClose
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :cancelText="$t('app.common.close')">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline"  @keyup.enter.native="searchQuery">
          <a-row :gutter="26">
            <!-- 客户姓名 -->
            <a-col :span="4">
              <a-form-item label="客户姓名" >
                <a-input v-model="queryParam.custName" disabled="disabled"></a-input>
              </a-form-item>
            </a-col>
            <!-- 订单号 -->
            <a-col :span="6">
              <a-form-item label="订单号" >
                <a-input v-model="queryParam.orderNo"></a-input>
              </a-form-item>
            </a-col>
            <!-- 商品名 -->
            <a-col :span="6">
              <a-form-item label="商品名" >
                <a-input style="width: 60%;" v-model="queryParam.proName"></a-input>
                <a-button style="width: 18%; margin-left:3%" @click="handleAddProduct" type="primary" icon="search"></a-button>
              </a-form-item>
            </a-col>
            <a-col :span="4" :style="{marginLeft:'42px'}">
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
          rowKey="odetId"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{fixed:true,selectedRowKeys, onSelectAll:onSelectAll,onSelect:onSelect, type: checkBoxFlg ? 'checkbox':'radio'}"
          :customRow="customRowFn"
          :rowClassName="InterlaceDiscoloration"
          :scroll="{x: 1600 , y: 300 }"
          @change="handleTableChange">
          <!-- 供应商名称 字符串超长截取省略号显示-->
          <!-- <span slot="suppName" slot-scope="text">
            <j-ellipsis :value="text" :length="12" />
          </span> -->
          <!-- 地址 字符串超长截取省略号显示-->
          <!-- <span slot="suppLnkAdd" slot-scope="text">
            <j-ellipsis :value="text" :length="12" />
          </span> -->
          <!-- 邮件地址 字符串超长截取省略号显示-->
          <!-- <span slot="suppLnkEmail" slot-scope="text">
            <j-ellipsis :value="text" :length="13" />
          </span> -->
          <!-- 电话 字符串超长截取省略号显示-->
          <!-- <span slot="suppLnkTel" slot-scope="text">
            <j-ellipsis :value="text" :length="11" />
          </span> -->
        </a-table>
      </div>
      <!-- table区域-end -->
    </a-modal>
    <lookup-product ref="selectProduct" @ok="selectProductOk"></lookup-product>
  </div>
</template>

<script>
  import {filterObj} from '@/utils/util'
  import {getAction} from '@/api/manage'
  import JInput from '@/components/jeecg/JInput'
  import lookupProduct from './LookupProduct'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "LookupOrderDetail",
    components: {
      JInput,
      lookupProduct,
      JEllipsis,
    },
    mixins:[JeecgListMixin],
    data() {
      return {
        title: "订单明细查询",
        description:'',
        visible: false,  
        checkBoxFlg:false,
        // 查询条件
        queryParam: {
            custName:'',
            orderNo:'',
            proName:'',
            custId:'',
            proId:'',
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
          {
            title: '订单号',
            align:"left",
            width:140,
            dataIndex: 'orderNo',
            sorter: true
          },
          {
            title: '商品名',
            align:"left",
            sorter: true,
            dataIndex: 'proName',
            width:180,
            scopedSlots: {customRender: 'proName'}
          },
          {
            title: '商品规格',
            align:"left",
            sorter: true,
            dataIndex: 'proSize',
            width:180,
            scopedSlots: {customRender: 'proSize'}
          },
          {
            title: '商品款号',
            align:"left",
            sorter: true,
            dataIndex: 'proAttr1',
            width:180,
            scopedSlots: {customRender: 'proAttr1'}
          },
          {
            title:'订单数量',
            align:"right",
            sorter: true,
            width:120,
            dataIndex: 'quantity',
            scopedSlots: { customRender: 'quantity' },
          },
          {
            title:'单价',
            align:"right",
            sorter: true,
            width:120,
            dataIndex: 'price',
            scopedSlots: { customRender: 'price' },
          },
          {
            title:'数量金额',
            align:"right",
            sorter: true,
            width:120,
            dataIndex: 'money',
            scopedSlots: { customRender: 'money' },
          },
          {
            title:'放样费',
            align:"right",
            sorter: true,
            width:100,
            dataIndex: 'odetMoney1',
            scopedSlots: { customRender: 'odetMoney1' },
          },
          {
            title:'合计金额',
            align:"right",
            sorter: true,
            width:100,
            dataIndex: 'odetTotal',
            scopedSlots: { customRender: 'odetTotal' },
          },
          {
            title:'已开票金额',
            align:"right",
            sorter: true,
            width:140,
            dataIndex: 'amounts',
            scopedSlots: { customRender: 'amounts' },
          },
          {
            title:'剩余未开票金额',
            align:"right",
            dataIndex: 'surplusAmount'
          }
        ],
        //查询排序
        isorter: { 
          column: 'orderNo',
          order: 'asc',
        },
        url: {
          list: "/arap/invoice/selectOrderDetail",
        }
      }
    },
    methods: {
      add(flag,custId,custName){
        if(custId!=this.queryParam.custId){
          this.selectedRowKeys=[];
          this.selectedTable=[];
        }
          this.queryParam.custId=custId;
          this.queryParam.custName=custName;
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
            let index = that.selectedRowKeys.indexOf(selectTable.odetId)
            if(index === -1){
              that.selectedTable.push(selectTable);
              that.selectedRowKeys.push(selectTable.odetId);
            }else{
              return false;
            }
          })
        } else {
          this.dataSource.forEach(selectTable =>{
            let index = that.selectedRowKeys.indexOf(selectTable.odetId);
            if(index === -1){
                  return false;
              }else{
                  that.handleDeleteSelected(index,selectTable.odetId);
            }
          })
        }
      },
      // 选择
      onSelect(record, selected) {
        const that = this;
        if(that.checkBoxFlg==true){
          if (selected === true) {
            that.selectedRowKeys.push(record.odetId);
            that.selectedTable.push(record);
          } else {
            var index = that.selectedRowKeys.indexOf(record.odetId);
            if (index >= 0) {
              that.handleDeleteSelected(index,record.odetId)
            }
          }
        }else{
          that.selectedRowKeys =[record.odetId] ;
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
                    that.selectedRowKeys =[record.odetId] ;
                    that.selectedTable =[record] ;
                  } else {
                    let index = that.selectedRowKeys.indexOf(record.odetId)
                    if (index === -1) {
                      that.selectedRowKeys.push(record.odetId)
                      that.selectedTable.push(record)
                    } else {
                      that.handleDeleteSelected(index,record.odetId)
                    }
                  }
                }
            }
          }
      },
      handleAddProduct(){
        this.$refs.selectProduct.add(false);  
      },
      selectProductOk(record){
        this.queryParam.proName=Object.assign({}, record[0]).proName;
        this.queryParam.proId=Object.assign({}, record[0]).id;
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