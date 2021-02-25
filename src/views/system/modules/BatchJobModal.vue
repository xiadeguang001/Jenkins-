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
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.batchJob.jobNameLabel')"
          hasFeedback >
          <a-input :placeholder="$t('app.message.batchJob.msg0001')" v-decorator="['jobName', validatorRules.jobName]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.batchJob.jobHandlerLabel')">
          <a-input :placeholder="$t('app.message.batchJob.msg0002')" v-decorator="['jobHandler', validatorRules.jobHandler]" />
        </a-form-item>

      </a-form>
    </a-spin>

    <div class="fill-drawer-bottom"></div>
    <div style="z-index:999 " class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem;float:left">关闭</a-button>
      </a-popconfirm>

      <a-button @click="handleDelete" type="danger" :loading="deleteLoading" v-show="this.model.id">删除</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">{{this.$t('app.common.confirm')}}</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction,postAction } from '@/api/manage'
  import {duplicateCheck, quartzStatus,getJobClasses, batchJobDelete, simpleSave, simpleDelete} from '@/api/api'
  import { getMsgInfo } from "@/utils/util"
  import JCron from "@/components/jeecg/JCron";
  import pick from 'lodash.pick'
  // import moment from "moment"

  export default {
    name: "BatchJobModal",
    components: {
      JCron
    },
    data () {
      return {
        title:"操作",
        buttonStyle: 'solid',
        visible: false,
        drawerWidth:600,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
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
          add: "/sys/job/add",
          edit: "/sys/job/edit",
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
        console.log(this.model)
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'jobName','jobHandler'));
        });
        
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
            let req = {dbDomain:"batch_job_info", params:[formData]};
            simpleSave(req).then((res)=>{
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
            that.simpleActionProcess4Modal(simpleDelete({dbDomain:"batch_info", params:[{id:that.model.id, exclcnt:that.model.exclcnt}]}), that.deleteLoading);
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>