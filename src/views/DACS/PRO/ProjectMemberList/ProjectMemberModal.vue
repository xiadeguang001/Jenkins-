<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :maskClosable="false"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{ height: 'calc(100% - 108px)', overflow: 'auto', paddingBottom: '108px' }"
  >
    <div :style="{ width: '100%', padding: '10px 16px', background: '#fff' }">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" class="standard-form">
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="$t('app.ProjectMemberList.10000')"
            hasFeedback
          >
            <j-custom-search-tag
              url="/pro/projectMember/searchProject"
              valueName="pjId"
              textName="pjName"
              v-decorator="['pjmPjId', validatorRules.pjmPjId]"
            >
            </j-custom-search-tag>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label="$t('app.ProjectMemberList.10002')">
            <div v-decorator="['pjmUserId', validatorRules.pjmUserId]">
              <a-button style="width: 40px" type="primary" icon="search" @click="onSearchBl" /><a-input
                v-decorator="['pjmUserName']"
              ></a-input>
            </div>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="$t('app.ProjectMemberList.10004')"
            hasFeedback
          >
            <j-dict-select-tag
              dictCode="pjm_user_role_id"
              :triggerChange="true"
              v-decorator="['pjmUserRoleId', validatorRules.pjmUserRoleId]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </div>

    <div class="fill-drawer-bottom"></div>
    <div style="z-index: 999" class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: 0.8rem" icon="close-square">关闭</a-button>
      </a-popconfirm>

      <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="form"
        >保存</a-button
      >
    </div>
    <project-member-search ref="ProjectMemberSearch" @ok="selectBlOk"></project-member-search>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import { checkMember } from '@/api/api'
import ProjectMemberSearch from './ProjectMemberSearch'
import JCustomSearchTag from '@/components/dict/JCustomSearchTag'

export default {
  name: 'ProjectMemberModal',
  components: {
    ProjectMemberSearch,
    JCustomSearchTag,
  },
  data() {
    return {
      drawerWidth: 700,
      title: this.$t('app.label.action'),
      blCode: '',
      addTitle: this.$t('app.common.add'),
      editTitle: this.$t('app.common.edit'),
      visible: false,
      disableSubmit: false,
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
        pjmPjId: {
          rules: [
            {
              required: true,
              message: this.$t('app.ProjectMemberList.10007'),
            },
          ],
        },

        pjmUserId: {
          rules: [
            {
              required: true,
              message: this.$t('app.ProjectMemberList.10008'),
            },
          ],
        },

        pjmUserRoleId: {
          rules: [
            {
              required: true,
              message: this.$t('app.ProjectMemberList.10009'),
            },
          ],
        },
      },
    }
  },
  computed: {},
  created() {},
  methods: {
    add() {
      this.edit({ status: '1' })
    },
    edit(record) {
      this.resetScreenSize()
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      if (record.status != '1') {
        this.model = Object.assign({}, record)
        this.model.pjmPjId = String(this.model.pjmPjId)
        this.model.pjmUserRoleId = String(this.model.pjmUserRoleId)
        this.$nextTick(() => {
          this.form.setFieldsValue(
            pick(this.model, 'pjmPjId', 'pjmPjName', 'pjmUserId', 'pjmUserName', 'pjmUserRoleId', 'pjmUserRoleName')
          )
        })
      }
    },
    close() {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(this.model, values)

          checkMember(formData)
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },
    onSearchBl() {
      this.$refs.ProjectMemberSearch.show()
    },
    selectBlOk(selectBlCode, selectblName) {
      this.pjmUserId = selectBlCode
      this.pjmUserName = selectblName
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this, 'pjmUserId', 'pjmUserName'))
      })
    },
  },
}
</script>

<style scoped>
@import '~@assets/less/common.less';
</style>