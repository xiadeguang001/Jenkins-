<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :cancelText="$t('app.common.close')"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!-- 名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.itemText')">
          <a-input  v-decorator="['itemText', validatorRules.itemText]"/>
        </a-form-item>

        <!-- 数据值 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.itemValue')">
          <a-input v-decorator="['itemValue', validatorRules.itemValue]"/>
        </a-form-item>

        <!-- 描述 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.description')">
          <a-input v-decorator="['description']"/>
        </a-form-item>

        <!-- 排序值 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.sortOrder')">
          <a-input-number :min="1" v-decorator="['sortOrder',{'initialValue':1}]"/>
          <span v-html="$t('app.label.sortOrderRule')"></span>
        </a-form-item>

        <!-- 是否启用 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.visibleCheck')"
          hasFeedback>
          <a-switch :checkedChildren="$t('app.common.enable')" :unCheckedChildren="$t('app.common.disable')" @change="onChose" v-model="visibleCheck"/>
        </a-form-item>

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import pick from 'lodash.pick'
  import {addDictItem, editDictItem} from '@/api/api'
  import { getMsgInfo } from "@/utils/util"

  export default {
    name: "DictItemModal",
    data() {
      return {
        title: this.$t('app.label.action'),
        visible: false,
        visibleCheck: true,
        model: {},
        dictId: "",
        status: 1,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          itemText: {rules: [{required: true, message: getMsgInfo(this,'msg0001','itemText') }]},
          itemValue: {rules: [{required: true, message: getMsgInfo(this,'msg0001','itemValue') }]},
        },
      }
    },
    created() {
    },
    methods: {
      // 新增
      add(dictId) {
        this.dictId = dictId;
        this.edit({});
      },
      // 编辑
      edit(record) {
        if (record.id) {
          this.dictId = record.dictId;
          this.visibleCheck = (record.status == 1) ? true : false;
        }
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.dictId = this.dictId;
        this.model.status = this.status;
        this.visible = true;
        // 画面赋值
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue', 'description', 'sortOrder'))
        });
      },
      // 禁用
      onChose(checked) {
        if (checked) {
          this.status = 1;
          this.visibleCheck = true;
        } else {
          this.status = 0;
          this.visibleCheck = false;
        }
      },
      // 确定
      handleOk() {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            values.itemText = (values.itemText || '').trim()
            values.itemValue = (values.itemValue || '').trim()
            values.description = (values.description || '').trim()
            let formData = Object.assign(this.model, values);
            formData.status = this.status;
            let obj;
            // 判断 新增处理 还是 编辑处理
            if (!this.model.id) {
              obj = addDictItem(formData);
            } else {
              obj = editDictItem(formData);
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })
          }
        })
      },
      // 关闭
      handleCancel() {
        this.close();
      },
      close() {
        this.$emit('close');
        this.visible = false;
      },
    }
  }
</script>