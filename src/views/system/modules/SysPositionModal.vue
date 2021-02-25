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
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <!-- 职务编号 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.positionCode')">
          <a-input v-decorator="['code', validatorRules.code]" maxLength="20" :disabled="codeDisable" style="width: 67%;"/> 
          <a-button @click="initCode" icon="sync" style="width: 30%;margin-left:3%" :disabled="codeButtonDisable">编号刷新</a-button>
        </a-form-item>
        <!-- 职务名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.positionName')">
          <a-input v-decorator="['name', validatorRules.name]" maxLength="20"/>
        </a-form-item>
        <!-- 职级 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.positionPostRank')">
           <j-dict-select-tag dictCode="post_rank" :triggerChange="true" v-decorator="['postRank', validatorRules.postRank]" />

        </a-form-item>
        <!-- 备注 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.memo')" class="memoform">
           <a-textarea v-decorator="['memo', validatorRules.memo]"/>
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
  import { httpAction,getAction } from '@/api/manage'
  import { getMsgInfo } from "@/utils/util" 
  import { getNextCode } from '@/api/api'

  export default {
    name: 'PositionModal',
    data() {
      return {
        title: this.$t('app.label.action'),
        addTitle: '添加职位',
        editTitle: '编辑职位',
        visible: false,
        codeDisable : false,
        codeButtonDisable : false,
        tableId: 'sys_position',
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
        validatorRules: {
          // 职务编号
          code: { rules: [{ required: true, message: getMsgInfo(this,'msg0001','positionCode')},
                {pattern:/^[0-9a-zA-Z]+$/,  message: '职位编号只能输入英数字'},
                { validator: this.checkCode }] },
          //职务名称
          name: { rules: [{ required: true, message: getMsgInfo(this,'msg0001','positionName')},{ validator: this.checkName }] },
          //职级
          postRank:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','positionPostRank')}]},
        },
        url: {
          add: '/sys/position/add',
          edit: '/sys/position/edit',
          check:'/sys/position/check',
        },
      }
    },
    methods: {
       checkCode(rule, value, callback) {
        // 重复校验
        var params = {
          //表名
          tableName: 'sys_position',
          //check 字段名
          fieldName: 'code',
          //字段值
          newFieldVal: value,
          oldFieldVal:this.model.code,
          dataId: this.model.id
        }
        getAction(this.url.check,params).then((res)=>{
            if(res.success){
              callback()
            }else{
              callback(res.message)
            }
        })
      },
      checkName(rule, value, callback) {
        // 重复校验
        var params = {
          tableName: 'sys_position',
          fieldName: 'name',
          newFieldVal: value,
          oldFieldVal:this.model.name,
          dataId: this.model.id
        }
        getAction(this.url.check,params).then((res)=>{
            if(res.success){
              callback()
            }else{
              callback(res.message)
            }
        })
      },
      add() {
        this.edit({})
        this.initCode()
      },
      edit(record) {
        this.form.resetFields()
        this.model = Object.assign({}, record)
        this.visible = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,
            'code','name','postRank','memo'
          ))
        })
        this.codeDisable = true
        this.codeButtonDisable = true
      },
      initCode(){
        //根据tableId, 取得最新编号
        getNextCode(this.tableId, null).then((res) => {
          if (res.success) {
            this.codeDisable = res.result.disabled
            this.codeButtonDisable = false
            this.model = Object.assign({}, {'code':res.result.nextCode})
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(this.model, 'code'))
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      //关闭
      close() {
        this.$emit('close')
        this.visible = false
      },
      //确认
      handleOk() {
        const that = this
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true
            let httpurl = ''
            let method = ''
            if (this.title=="添加职位") {
              httpurl += this.url.add
              method = 'post'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
            values.code = (values.code || '').trim()
            values.name = (values.name || '').trim()
            values.postRank = (values.postRank || '').trim()
            values.memo = (values.memo || '').trim()
            let formData = Object.assign(this.model, values);
            httpAction(httpurl, formData, method).then((res) => {
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
      handleCancel() {
        this.close()
      },


    }
  }
</script>