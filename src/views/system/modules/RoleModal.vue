<template>
  <a-drawer
    :title="title"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handleCancel"
    cancelText="关闭"
    wrapClassName="ant-modal-cust-warp"
    style="top:5%;height: 85%;overflow-y: hidden">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 角色名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.roleName')">
          <a-input v-decorator="[ 'roleName', validatorRules.roleName]" maxlength="200" />
        </a-form-item>

        <!-- 角色编码 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.roleCoding')">
          <a-input :disabled="roleDisabled" v-decorator="[ 'roleCode', validatorRules.roleCode]" maxlength="100"/>
        </a-form-item>

        <!-- 描述 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.description')" class="memoform">
          <a-textarea :rows="5" v-decorator="[ 'description', validatorRules.description ]" maxlength="255" />
        </a-form-item>

      </a-form>
    </a-spin>
    <div class="fill-drawer-bottom"></div>
    <div style="z-index:999 " class="drawer-bootom-button">
      <a-popconfirm title="編集を中止してもよろしいですか？" @confirm="handleCancel" okText="確認" cancelText="キャンセル">
        <a-button style="margin-right: .8rem">キャンセル</a-button>
      </a-popconfirm>

      <a-button @click="handleOk" type="primary" :loading="confirmLoading">提出</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import pick from 'lodash.pick'
  import {addRole,editRole,duplicateCheck } from '@/api/api'
  import { getMsgInfo } from "@/utils/util"

  export default {
    name: "RoleModal",
    data () {
      return {
        title:"操作",
        addTitle: '役割を追加',
        editTitle: '役割を編集',
        visible: false,
        roleDisabled: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          // 角色名称check
          roleName:{
            rules: [
              { required: true, message: getMsgInfo(this,'msg0001','roleName')}
            ]},
          // 角色名称check
          roleCode:{
            rules: [
              { required: true, message: getMsgInfo(this,'msg0001','roleCoding')},
              { validator: this.validateRoleCode}
            ]},
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
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;

        //编辑页面禁止修改角色编码
        if(this.model.id){
          this.roleDisabled = true;
        }else{
          this.roleDisabled = false;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'roleName', 'description','roleCode'))
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
            let formData = Object.assign(this.model, values);
            let obj;
            console.log(formData)
            if(!this.model.id){
              obj=addRole(formData);
            }else{
              obj=editRole(formData);
            }
            obj.then((res)=>{
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
      validateRoleCode(rule, value, callback){
        if(/[\u4E00-\u9FA5]/g.test(value)){
          callback(this.$t('app.message.msg0046'));
        }else{
          var params = {
            tableName: "sys_role",
            fieldName: "role_code",
            fieldVal: value,
            dataId: this.model.id,
          };
          duplicateCheck(params).then((res)=>{
            if(res.success){
              callback();
            }else{
              callback(res.message);
            }
          });
        }
      }

    }
  }
</script>

<style scoped>

</style>