<template>
  <a-drawer
    :title="title"
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handleCancel"
    :cancelText="$t('app.common.close')"
  >
      <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!-- 字典名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.dictName')">
          <a-input v-decorator="[ 'dictName', validatorRules.dictName]"/>
        </a-form-item>

        <!-- 字典编号 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.dictCode')">
          <a-input v-decorator="[ 'dictCode', validatorRules.dictCode]"/>
        </a-form-item>

        <!-- 描述 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
           :label="$t('app.label.description')">
          <a-input v-decorator="[ 'description']"/>
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
  import { addDict, editDict, duplicateCheck } from '@/api/api'
  import { getMsgInfo } from "@/utils/util"

  export default {
    name: 'DictModal',
    data() {
      return {
        value: 1,
        title: this.$t('app.label.action'),
        addTitle: '添加字典',
        editTitle: '编辑字典',
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          dictName: { rules: [{ required: true, message: getMsgInfo(this,'msg0001','dictName') }]},
          dictCode: {
            rules: [{ required: true, message: getMsgInfo(this,'msg0001','dictCode') }]
          }
        }
      }
    },
    created() {
    },
    methods: {
       validateDictCode(rule, value, callback) {
        // 重复校验
        var params = {
          tableName: 'sys_dict',
          fieldName: 'dict_code',
          fieldVal: value,
          dataId: this.model.id
        }
        duplicateCheck(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback(res.message)
          }
        })
      },
      // 新增
      add() {
        this.edit({})
      },
      // 编辑
      edit(record) {
        if (record.id) {
          this.visiblekey = true
        } else {
          this.visiblekey = false
        }
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'dictName', 'dictCode', 'description'))
        })
      },
      // 确定
      handleOk() {
        const that = this;
        // alert(123);
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            values.dictName = (values.dictName || '').trim()
            values.dictCode = (values.dictCode || '').trim()
            values.description = (values.description || '').trim()
            let formData = Object.assign(this.model, values)
            let obj
            console.log(formData)
            if (!this.model.id) {
              obj = addDict(formData)
            } else {
              obj = editDict(formData)
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            }).finally(() => {
              that.confirmLoading = false
              that.close()
            })
          }
        })
      },
      // 关闭
      handleCancel() {
        this.close()
      },
      close() {
        this.$emit('close')
        this.visible = false
      }
    }
  }
</script>