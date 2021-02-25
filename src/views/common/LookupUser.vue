<template>
  <div>
    <a-modal
      centered
      :title="title"
      :width="1000"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :cancelText="$t('app.common.close')">

      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline"  @keyup.enter.native="searchQuery">
          <a-row :gutter="24">
            <!-- 登录账号 -->
            <a-col :span="8">
              <a-form-item :label="$t('app.label.usernameSel')">
                <j-input v-model="queryParam.username"></j-input>
              </a-form-item>
            </a-col>
            <!-- 部门 -->
            <a-col :span="8">
              <a-form-item :label="$t('app.label.orgCode')">
                  <j-select-depart v-model="queryParamTwo.orgCode" @selectDept="selectDept" :multiple="false" v-decorator="['post', {}]"></j-select-depart>
              </a-form-item>
            </a-col>
            <!-- 真实姓名 -->
            <a-col :span="8">
              <a-form-item :label="$t('app.label.realnameSel')">
                <j-input v-model="queryParam.realname"></j-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <!-- 工号 -->
            <a-col :span="7" :style="{marginLeft:'28px'}">
              <a-form-item :label="$t('app.label.workNo')" :style="{width:'273px'}"> 
                <j-input v-model="queryParam.workNo"></j-input>
              </a-form-item>
            </a-col>
            <!-- 职务 -->
            <a-col :span="7" :style="{marginLeft:'12px'}">
              <a-form-item :label="$t('app.label.job')" :style="{width:'300px'}">
                <j-select-position v-model="queryParam.post" :multiple="false" v-decorator="['post', {}]"/>
              </a-form-item>
            </a-col>
            <a-col :span="7" :style="{marginLeft:'42px'}">
               <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                  <!-- 查询按钮 -->
                  <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
                  <!-- 重置按钮 -->
                  <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
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
  import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'
  import JSelectDepart from '@/components/jeecgbiz/JSelectDepart'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "LookupUser",
    components: {
      JInput,
      JSelectPosition,
      JSelectDepart
    },
    mixins:[JeecgListMixin],
    data() {
      return {
        title: "用户选择",
        names: [],
        placement: 'right',
        description: '',
        visible: false,   
        checkBoxFlg:false,  
        selectedDepartKeys:[], //保存用户选择部门id
        checkedDepartKeys:[],
        checkedDepartNames:[], // 保存部门的名称 =>title
        checkedDepartNameString:"", // 保存部门的名称 =>title
        // table选中keys
        selectedRowKeys: [],
        // 查询条件
        queryParam: {
          username:'',
          orgCode:'',
          realname:'',
          workNo:'',
          post:'',
        },
        queryParamTwo:{
          deptName:'',
        },
        // 表头
        columns: [
          {
            // 登录账号
            title: this.$t('app.label.usernameSel'),
            align: "center",
            width: 100,
            dataIndex: 'username',
            sorter: true,
          },
          {
            // 真实姓名
            title: this.$t('app.label.realnameSel'),
            align: "center",
            width: 100,
            dataIndex: 'realname',
            sorter: true,
          },
          {
            // 手机号码 
            title: this.$t('app.label.phoneNumber'),
            align: "center",
            width: 100,
            dataIndex: 'phone'
          },
          {
            // 邮箱地址
            title: this.$t('app.label.email'),
            align: "center",
            width: 180,
            dataIndex: 'email'
          },
          {
            // 职务
            title: this.$t('app.label.job'),
            align: "center",
            width: 100,
            dataIndex: 'post',
          },
          {
            // 工号
            title: this.$t('app.label.workNo'),
            align: "center",
            width: 80,
            dataIndex: 'workNo'
          },
          {
            // 机构编码（部门）
            title: this.$t('app.label.orgCode'),
            align: "center",
            width: 80,
            dataIndex: 'orgCode',
          },
        ],
        //数据集
        dataSource: [],
        //table选择的数据
        checkBoxtDataSource:[],
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
          column: 'createTime',
          order: 'desc',
        },
        loading: false,
        url: {
          list: "/sys/user/list",
        }
      }
    },
    // 初期创建
    created() {
      this.loadData();
    },
    methods: {
      // 查询按钮按下
      searchQuery() {
        this.loadData(1);
      },
      // 重置处理
      searchReset() {
        this.queryParam = {};
        this.queryParamTwo={};
        this.loadData(1);
      },
      // 取消按钮
      handleCancel() {
        this.visible = false;
      },
      // 点击确定
      handleOk() {
        this.$emit("ok", this.checkBoxtDataSource);
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
              that.checkBoxtDataSource.push(selectTable);
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
            that.selectedRowKeys.push(record.code);
            that.checkBoxtDataSource.push(record);
          } else {
            var index = that.selectedRowKeys.indexOf(record.code);
            if (index >= 0) {
              that.handleDeleteSelected(index,record.code)
            }
          }
        }else{
          that.selectedRowKeys = [record.code];
          that.checkBoxtDataSource = [record];
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
                    that.checkBoxtDataSource =[record] ;
                  } else {
                    let index = that.selectedRowKeys.indexOf(record.id)
                    if (index === -1) {
                      that.selectedRowKeys.push(record.id)
                      that.checkBoxtDataSource.push(record)
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
        this.checkBoxtDataSource.splice(index, 1)
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
      // 搜索用户对应的部门API
      onSearch(){
        this.$refs.departWindow.add();
      },
      // 获取用户对应部门弹出框提交给返回的数据
      selectDept(record){
        console.log(record);
        this.queryParam.orgCode=record.departOrgCode;
        this.queryParamTwo.deptName=record.departNames;
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