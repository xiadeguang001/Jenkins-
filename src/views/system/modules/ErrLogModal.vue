<template>
  <a-modal
    :title="$t('app.common.errorLogEdit')"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :cancelText="$t('app.common.close')">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!-- タスク名 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.errlog.errno')">
          <!-- <a-input v-model="no" disabled/> -->
          
          <a-input v-decorator="[ 'no', {}]" :readOnly="true"/>
        </a-form-item>
        <!-- タスク名 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.errlog.jobname')">
          <!-- <a-input v-model="jobname" disabled/> -->
          <a-input v-decorator="[ 'jobname', {}]" :readOnly="true"/>
        </a-form-item>
        <!-- タスク名 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.user.status')">
          <!-- <j-dict-select-tag dictCode="status_flg" :triggerChange="true" v-model="queryParam.statusFlg"/> -->
          <div>
          <j-dict-select-tag  dictCode="status_flg" :triggerChange="true"
              v-decorator="['statusFlg', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.user.status')}) }]}]" />
          </div>
        </a-form-item>
      
 
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button @click="handleCancel" type="primary">{{$t('app.common.close')}}</a-button>
      <a-button @click="handleSubmit" type="primary">{{$t('app.label.Job.saveSendTask')}}</a-button>
    </template>
  </a-modal>
</template>

<script>
  import { httpAction,postAction } from '@/api/manage'
  import {quartzStatus,getJobClasses} from '@/api/api'
  import JCron from "@/components/jeecg/JCron";
  import pick from 'lodash.pick'
  import JDictSelectTag from '../../../components/dict/JDictSelectTag.vue'
  import JUpload from '../../../components/jeecg/JUpload'

  export default {
    name: "ErrLogModal",
    components: {
      JCron,
      JUpload
    },
    data () {
      return {
         headers: {
          authorization: 'authorization-text',
        },
        queryParam: {},
        buttonStyle: 'solid',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        cron: {
          label: '',
          value: ''
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        url: {
          edit: "/sys/errLog/update"
        }
      }
    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
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
        this.visible = true;
        this.model.statusFlg = this.model.statusFlg + '';
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'no','statusFlg','jobname'));
        });
        

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleSubmit () {
        const that = this;
        // フォーム検証のトリガー
        this.form.validateFields((err, values) => { 
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            httpurl+=this.url.edit;
            method = 'POST';
            let formData = Object.assign(this.model, values);
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
      handleClear () {
        this.edit({});
      },
       handleChange (info) {
        this.picUrl = "";
        if (info.file.status === 'uploading') {
          this.uploadLoading = true;
          return
        }
        if (info.file.status === 'done') {
          var response = info.file.response;
          this.uploadLoading = false;
          if(response.success){
            this.model.avatar = response.message;
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>