<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1100"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :cancelText="$t('app.common.close')">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline"  @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <!-- 客户编号 -->
            <a-col :span="6">
              <a-form-item label="客户编号" >
                <j-input v-model="queryParam.custCode"></j-input>
              </a-form-item>
            </a-col>
            <!-- 客户名称 -->
            <a-col :span="6">
              <a-form-item label="客户名称" >
                <j-input v-model="queryParam.custName"></j-input>
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
          :scroll="{y: 400 }"
          :rowSelection="{fixed:true,selectedRowKeys, onSelectAll:onSelectAll,onSelect:onSelect, type: checkBoxFlg ? 'checkbox':'radio'}"
          :customRow="customRowFn"
          :rowClassName="InterlaceDiscoloration"
          @change="handleTableChange">
          <!-- 客户名 字符串超长截取省略号显示 -->
          <span slot="custName" slot-scope="text">
            <j-ellipsis :value="text" :length="13"/>
          </span>
          <!-- 住所 字符串超长截取省略号显示 -->
          <span slot="custLnkAdd" slot-scope="text">
            <j-ellipsis :value="text" :length="12"/>
          </span>
          <!-- 联系人 字符串超长截取省略号显示 -->
          <span slot="custLnkName" slot-scope="text">
            <j-ellipsis :value="text" :length="6"/>
          </span>

          <span slot="phone" slot-scope="text">
            <j-ellipsis :value="text" :length="6"/>
          </span>
          
          <!-- 邮箱 字符串超长截取省略号显示 -->
          <span slot="custLnkEmail" slot-scope="text">
            <j-ellipsis :value="text" :length="15"/>
          </span>
        </a-table>
      </div>
      <!-- table区域-end -->

    </a-modal>
  </div>
</template>

<script>
  import {filterObj} from '@/utils/util'
  import {getAction} from '@/api/manage'
  import JInput from '@/components/jeecg/JInput'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  export default {
    name: "LookupCustomer",
    components: {
      JInput,
      JEllipsis,
    },
    mixins:[JeecgListMixin],
    data() {
      return {
        title: "客户选择",
        description: '',
        checkBoxFlg:false,
        visible: false,
        loading: false,
        //数据集
        dataSource: [],
        //选中数据
        selectedTable:[],
        // table选中keys
        selectedRowKeys: [],
        // 查询条件
        queryParam: {
          custCode:'',
          custName:'',
        },
        queryParam2:{
          salesUserName:'',
        },
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
            // 客户编号
            title: "客户编号",
            align: "left",
            width:110,
            sorter: true,
            dataIndex: 'custCode',
          },
          {
            // 客户名称
            title: "客户名称",
            align: "left",
            width:200,
            sorter: true,
            dataIndex: 'custName',
            scopedSlots: { customRender: 'custName' }
          },
          {
            // 客户联络人
            title: "联络人",
            align: "left",
            width:110,
            dataIndex: 'custLnkName',
            scopedSlots: { customRender: 'custLnkName' }
          },
          {
            // 住所
            title: "联系地址",
            align: "left",
            width:200,
            dataIndex: 'custLnkAdd',
            scopedSlots: { customRender: 'custLnkAdd' }
          },
          {
            // 联系电话 
            title: "联系电话",
            align: "left",
            width:120,
            dataIndex: 'custLnkTel',
            scopedSlots: {customRender: "phone"}
          },
          {
            // 邮箱地址
            title: "邮箱地址",
            align: "left",
            dataIndex: 'custLnkEmail',
            scopedSlots: { customRender: 'custLnkEmail' }
          },
        ],
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
        isorter: {
          column: 'id',
          order: 'asc',
        },
        url: {
          list: "/master/mstCustomer/list",
        }
      }
    },
    //数据处理
    beforeUpdate: function() {
      const than=this;
      than.columns.forEach(tabColumns => {
        if (tabColumns.dataIndex == 'prepareTimeAndPrepareUnit') {
          than.dataSource.forEach(listData => {
            listData.prepareTimeAndPrepareUnit = listData.prepareTime+listData.prepareUnit_dictText;
          })
        }
      })
    },
    // 初期创建用
    created() {
      this.loadData();
    },
    methods: {
      // 查询按钮按下
      searchQuery() {
        this.loadData(1);
      },
      // 重置按钮按下
      searchReset() {
        this.queryParam = {};
        this.queryParam2={};
        this.loadData(1);
      },
      // 取消按钮按下
      handleCancel() {
        this.visible = false;
      },
      // 点击确定
      handleOk() {
        this.$emit("ok", this.selectedTable);
        this.visible = false;
      },
      // 前画面调用显示画面用
      add(multiple) {
        this.visible = true;
        this.checkBoxFlg = multiple;
      },
      // 数据处理
      loadData(arg) {
        //加载数据 若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.ipagination.current = 1;
        }
        var params = this.getQueryParams();//查询条件
        getAction(this.url.list, params).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          }
        });
      },
      //查询条件
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      getQueryField() {
        //TODO 字段权限控制
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
          that.selectedRowKeys = [record.id];
          that.selectedTable = [record];
        }
      },
      //行点击事件
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
      /** 删除已选择的 */
      handleDeleteSelected(index,key) {
        this.selectedRowKeys.splice(index,1)
        this.selectedTable.splice(index, 1)
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