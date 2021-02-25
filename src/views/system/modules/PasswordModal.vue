<template>
  <a-modal
    :title="$t('app.label.resetPassword')"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :cancelText="$t('app.common.close')"
    style="top:20px;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :label="$t('app.label.user.userName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :placeholder="$t('app.Login.10006')" v-decorator="[ 'username', {}]" :readOnly="true"/>
        </a-form-item>

        <a-form-item :label="$t('app.label.user.newPassword')" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback >
          <a-input type="password" :placeholder="$t('app.Login.10007')" v-decorator="[ 'password', validatorRules.password]" />
        </a-form-item>

        <a-form-item :label="$t('app.label.user.confirmPassword')" :labelCol="labelCol" :wrapperCol="wrapperCol" hasFeedback >
          <a-input type="password" @blur="handleConfirmBlur" :placeholder="$t('app.message.msg0024')" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {changPassword} from '@/api/api'

  export default {
    name: "PasswordModal",
    data () {
      return {
        visible: false,
        confirmLoading: false,
        confirmDirty: false,
        validatorRules:{
          password:{
            rules: [{
              required: true,
              message: this.$t('app.message.msg0060')
            }, {
              validator: this.validateToNextPassword,
            }],
          },
          confirmpassword:{
            rules: [{
              required: true, message: this.$t('app.message. msg0024'),
            }, {
              validator: this.compareToFirstPassword,
            }],
          },
        },

        model: {},

        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        form:this.$form.createForm(this)
      }
    },
    created () {
      console.log("created");
    },

    methods: {
      show (username) {
        this.form.resetFields();
        this.visible = true;
        this.model.username = username;
        this.$nextTick(() => {
          this.form.setFieldsValue({username:username});
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
      },
      handleSubmit () {
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true;
            let formData = Object.assign(this.model, values);
            changPassword(formData).then((res)=>{
              if(res.success){
                this.$message.success(res.message);
                this.$emit('ok');
              }else{
                this.$message.warning(res.message);
              }
            }).finally(() => {
              this.confirmLoading = false;
              this.close();
            });
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        const confirmpassword=form.getFieldValue('confirmpassword');
        // console.log("confirmpassword==>",confirmpassword);
        if (value && confirmpassword && value !== confirmpassword) {
          callback(this.$t('app.message. msg0027'));
        }
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback(this.$t('app.message. msg0027'));
        } else {
          callback()
        }
      },
      handleConfirmBlur  (e) {
        const value = e.target.value
        this.confirmDirty = this.confirmDirty || !!value
      }
    }
  }
</script>