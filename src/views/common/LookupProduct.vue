<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1200"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :cancelText="$t('app.common.close')">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <!-- 商品编号 -->
            <a-col :span="6">
              <a-form-item label="商品编号">
                <a-input v-model="queryParam.proCode"></a-input>
              </a-form-item>
            </a-col>
            <!-- 商品名称 -->
            <a-col :span="6">
              <a-form-item label="商品名称">
                <a-input v-model="queryParam.proName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="6" >
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
          size="small"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :scroll="{ y: 240 }"
          :rowSelection="{fixed:true,selectedRowKeys, onSelectAll:onSelectAll,onSelect:onSelect, type: checkBoxFlg ? 'checkbox':'radio'}"
          :customRow="customRowFn"
          :rowClassName="InterlaceDiscoloration"
          @change="handleTableChange">

          <!-- 商品名称 字符串超长截取省略号显示 -->
          <span slot="proName" slot-scope="text">
            <j-ellipsis :value="text" :length="12"/>
          </span>
          <span slot="proSize" slot-scope="text">
            <j-ellipsis :value="text" :length="12"/>
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
    name: "LookupProduct",
    components: {
      JInput,
      JEllipsis
    },
    mixins:[JeecgListMixin],
    data() {
      return {
        // 商品选择画面
        title: "商品选择",
        description: this.$t('app.label.productView'),
        visible: false,
        loading: false,
        checkBoxFlg:false,
        // table选中keys
        selectedRowKeys: [],
        //选中数据
        selectedTable:[],
        // 查询条件
        queryParam: {
            proCode:'',
            proName:'',
        },
        //数据集
        dataSource: [],
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
            // 商品编号
            title: "商品编号",
            align: "left",
            width: 120,
            dataIndex: 'proCode',
            sorter: true,
          },
          {
            // 商品名称
            title: "商品名称",
            align: "left",
            width: 180,
            dataIndex: 'proName',
            scopedSlots: {customRender: 'proName'},
            sorter: true
          },
          {
            // 规格
            title: "规格",
            align: "left",
            width: 180,
            dataIndex: 'proSize',
            scopedSlots: {customRender: 'proSize'},
            sorter: true,
          },
          {
            title: "款号",
            align: "left",
            width: 140,
            dataIndex: 'proAttr1',
          },
          {
            title: "颜色",
            align: "left",
            width: 120,
            dataIndex: 'proAttr2'
          },
          {
            title: "门幅",
            align: "left",
            width: 100,
            dataIndex: 'proAttr3',
          },
          {
            title: "克重",
            align: "right",
            width: 120,  
            dataIndex: 'proAttr4',
          },
          {
            // 单位名称
            title: "单位",
            align: "left",
            dataIndex: 'unitName',
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
        // 排序
        isorter: {
          column: 'proCode',
          order: 'asc',
        },
        url: {
            // 商品查询
          list: "/master/mstProduct/list",
        }
      }
    },
    // 初期创建
    created() {
      this.loadData();
    },
    beforeUpdate: function() {
      const than=this;
      than.columns.forEach(tabColumns => {
        if (tabColumns.dataIndex == 'weighAndWeighUnit') {
          than.dataSource.forEach(listData => {
            listData.weighAndWeighUnit = listData.weigh+listData.weighUnit_dictText;
          })
        }
        if(tabColumns.dataIndex == 'lengthAndLengthUnit'){
          than.dataSource.forEach(listData => {
            listData.lengthAndLengthUnit = listData.length +listData.lengthUnit_dictText;
          })
        }
      })
    },
    methods: {
      // 查询按钮按下
      searchQuery() {
        this.loadData(1);
      },
      // 重置处理
      searchReset() {
        this.queryParam = {};
        this.loadData(1);
      },
      // 取消按钮
      handleCancel() {
        this.visible = false;
      },
      // 点击确定
      handleOk() {
        this.$emit("ok", this.selectedTable);
        this.visible = false;
      },
      // 前画面调用方法显示画面用
      add(multiple) {
        this.checkBoxFlg= multiple;
        this.visible = true;
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
          that.selectedRowKeys =[record.id] ;
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