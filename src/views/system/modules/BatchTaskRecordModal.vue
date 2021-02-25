<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :maskClosable="false"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >

    <a-spin :spinning="confirmLoading">
      <a-card class="card" :bordered="false" :title="$t('app.label.batchJob.processResult')">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.taskName')"
               >
              <j-ellipsis :value="model.taskName" :length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.processResult')"
               >
              <j-ellipsis :value="model.result_dictText" :length="30"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.startTime')"
               >
              <j-ellipsis :value="model.startTime" :length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.endTime')"
               >
              <j-ellipsis :value="model.endTime" :length="30"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.processTime')"
               >
              <j-ellipsis :value="model.processTime" :length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.logFilePath')"
               >
              <a @click="downloadFile"><j-ellipsis :value="model.logFileName" :length="30"/></a>
            </a-form-item>
          </a-col>
        </a-row>
        </a-card>

        <a-card class="card" :bordered="false" :title="$t('app.label.batchJob.errorHandleResult')" v-show="model.hasError">
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              :label="$t('app.label.batchJob.errorContent')"
               class="memoform"
               >
               <a-textarea :rows="16" :value="model.errorContent" readonly="readonly" style="word-break: break-all;"/>
            </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="12" :sm="24">
              <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.errorHandleStatus')"
               >
              <j-dict-select-tag style="width:100%" dictCode="task_error_handle_state" :triggerChange="false" v-model="model.errorHandleStatus"/>
              </a-form-item>
              </a-col>
              <a-col :md="12" :sm="24">
              <a-form-item
                :labelCol="labelCol"
                :wrapperCol="wrapperCol"
                :label="$t('app.label.batchJob.errorHandleTime')"
                 >
                 <j-date style="width:100%" v-model="model.errorHandleTime" showTime dateFormat="YYYY-MM-DD HH:mm:ss" :disabled="model.errorHandleStatus != '2'"></j-date>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="24" :sm="24">
              <a-form-item
              :labelCol="labelCol1"
              :wrapperCol="wrapperCol1"
              :label="$t('app.label.batchJob.errorHandleContent')"
              class="memoform"
              >
              <a-textarea rows="2" v-model="model.errorHandleContent"/>
            </a-form-item>
            </a-col>
          </a-row>
        </a-card>
    </a-spin>

    <div class="fill-drawer-bottom"></div>
    <div style="z-index:999 " class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem;float:left">关闭</a-button>
      </a-popconfirm>

      <a-button @click="handleOk" v-show="model.hasError" type="primary" :loading="confirmLoading">{{this.$t('app.common.confirm')}}</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction,postAction } from '@/api/manage'
  import {duplicateCheck, quartzStatus,getJobClasses, batchJobDelete} from '@/api/api'
  import { getMsgInfo } from "@/utils/util"
  import pick from 'lodash.pick'
  import JEllipsis from "@/components/jeecg/JEllipsis";
  import JDate from '@/components/jeecg/JDate';
  import {download} from '@/utils/util';
  import moment from 'moment'
  // import moment from "moment"

  export default {
    name: "BatchTaskRecordModal",
    components: {
      JEllipsis,
      JDate
    },
    data () {
      return {
        title:"操作",
        buttonStyle: 'solid',
        visible: false,
        drawerWidth:780,
        model: {},
        labelCol: {
          md: { span: 8 },
          sm: { span: 24 },
        },
        wrapperCol: {
          md: { span: 16 },
          sm: { span: 24 },
        },
        labelCol1: {
          md: { span: 4 },
          sm: { span: 24 },
        },
        wrapperCol1: {
          md: { span: 20 },
          sm: { span: 24 },
        },
        cron: {
          label: '',
          value: ''
        },
        confirmLoading: false,
        deleteLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          cron: {
            rules: [{
              required: true, message: this.$t('app.label.quartzJob.inputCronMsg')
            }]
          },

          // job名称check
          jobName:{
            rules: [{
              required: true, message: this.$t('app.message.batchJob.msg0001')
            },{
              validator: this.validateJobname,
            }]
          },

          // jobHandler check
          jobHandler:{
            rules: [{
              required: true, message: this.$t('app.message.batchJob.msg0002')
            },{
            }]
          },
        },
        url: {
          edit: "/sys/taskRecord/edit",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        let that = this;
        that.form.resetFields();
        this.model = Object.assign({},record);
        console.log(this.model);

        if (this.model.hasError) {
          if (this.model.errorHandleTime == null) {
            this.model.errorHandleTime = moment().format('YYYY-MM-DD HH:mm:ss');
          }
        }
        this.visible = true;
        
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },

      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log('values',values)
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            // console.log('提交的model',values)
            // console.log('提交的value', values)
            // console.log('提交参数',formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },

      validateJobname(rule, value, callback){
        var params = {
          tableName: 'batch_job_info',
          fieldName: 'job_name',
          fieldVal: value,
          dataId: this.model.id,
          excludeLogicDelete: true,
          logicDeleteFieldName: "delete_flg"
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
          callback()
        } else {
          callback(getMsgInfo(this,'msg0028','batchJob.jobNameLabel'))
        }
      })
      },

      handleDelete(){
        let that = this;
        this.$confirm({
          title: "确认删除",
          content: "是否确认删除该Job?",
          onOk: function () {
            that.simpleActionProcess4Modal(batchJobDelete({id:that.model.id, exclcnt:that.model.exclcnt}), that.deleteLoading);
          }
        });
      },

      downloadFile() {
        if (this.model.logFilePath === null) return;
        download(this.model.logFilePath, this.model.logFileName);
      },
    }
  }
</script>

<style>
  .ant-drawer-body {
    padding-top: 5px !important;
    padding-bottom: 5px !important;
  }

  .ant-card-body {
    padding-top: 12px !important;
    padding-bottom: 12px !important;
  }

  .memoform {
    margin-top: 3px;
  }

  .ant-card {
    margin-bottom: 3px !important;
  }
</style>