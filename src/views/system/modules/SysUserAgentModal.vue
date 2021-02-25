<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancelText="$t('app.common.close')">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.userAgentName')">
          <a-input v-decorator="['userName', {}]" readOnly/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.agentUserName')">
          <j-select-user-by-dep  v-decorator="['agentUserName', validatorRules.agentUserName]" :trigger-change="true"></j-select-user-by-dep>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.agentStartTime')">
          <j-date
            v-decorator="[ 'startTime', validatorRules.startTime]"
            :trigger-change="true"
            :showTime="true"
            date-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%" >
          </j-date>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.agentEndTime')">
          <j-date
            v-decorator="[ 'endTime', validatorRules.endTime]"
            :trigger-change="true"
            :showTime="true"
            date-format="YYYY-MM-DD HH:mm:ss"
            style="width:100%">
          </j-date>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.statusDictText')">
          <a-radio-group class="fontiframe" name="radioGroup" v-decorator="[ 'status', {}]">
            <a-radio class="radioGroup" value="1">{{this.$t('app.label.valid')}}</a-radio>
            <a-radio class="radioGroup" value="0">{{this.$t('app.label.invalid')}}</a-radio>
          </a-radio-group>
        </a-form-item>

      </a-form>

    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import { httpAction, getAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate.vue';
  import JSelectUserByDep from '@/components/jeecgbiz/JSelectUserByDep'
  import { getMsgInfo } from "@/utils/util"

  export default {
    name: "SysUserAgentModal",
    components: {
      JDate,
      JSelectUserByDep
    },
    data () {
      return {
        title:this.$t('app.common.operation'),
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
        username:"",
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          agentUserName:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','agentUserName') }]},
          startTime:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','agentStartTime') }]},
          endTime:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','agentEndTime')  }]},
        },
        url: {
          add: "/sys/sysUserAgent/add",
          edit: "/sys/sysUserAgent/edit",
          queryByUserName:"/sys/sysUserAgent/queryByUserName",
        },
      }
    },
    created () {
    },
    methods: {
      agentSettings(username){
        this.username = username;
        this.init();

      },
      init () {
        var params = {userName:this.username};//查询条件
        getAction(this.url.queryByUserName,params).then((res)=>{
          if(res.success){
            console.log("获取流程节点信息",res);
            this.edit (res.result);
          }else{
            this.edit({userName:this.username,status:"0"});
          }
        })
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'userName','agentUserName','status','startTime','endTime'))
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
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                //this.init();
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
      }
    }
  }
</script>

<style scoped>

</style>