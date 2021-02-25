<template>
  <div>
    <!--↓↓↓ 客户基本信息 ↓↓↓-->
    <a-card  class="card" :bordered="false" :loading="loading">
      <div class="table-page-search-wrapper">
        <a-form :form="form" class="form">
          <a-row :gutter="24">
            <a-col>
              <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              required
              :label="$t('app.label.batchJob.defaultErrorRetryTimes')">
                <a-input-number v-decorator="['errorRetryTimes', validatorRules.errorRetryTimes]" />
              </a-form-item>
            </a-col>
            </a-row>
            <a-row :gutter="24">
            <a-col>
              <a-form-item
              :labelCol="labelCol"
              required
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.defaultErrorNoticeEmails')">
                <a-input style="width:60%" v-decorator="['errorNoticeEmails', validatorRules.errorNoticeEmails]" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col>
              <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.noticeEmailHead')"
               class="memoform">
                <a-textarea rows="5" style="width:60%" v-decorator="['emailHead', validatorRules.emailHead]" />
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col>
              <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.noticeEmailFoot')"
               class="memoform">
                <a-textarea rows="5" style="width:60%" v-decorator="['emailFoot', validatorRules.emailFoot]" />
              </a-form-item>
            </a-col>
          </a-row>
          
        </a-form>
      </div>
    </a-card>
    <!--↑↑↑ 客户基本信息 ↑↑↑-->
    <!--↑↑↑ 订单明细一览 ↑↑↑-->
    <!-- fixed footer toolbar -->
    <!-- <footer-tool-bar style="z-index:999 ">
    </footer-tool-bar> -->
    <div width="100%" style="text-align: center;">
      <a-button type="primary" @click="submit" :loading="confirmLoading">保存</a-button>
    </div>
      
  </div>
</template>

<script>
  import FooterToolBar from '@/components/tools/FooterToolBar'

  import pick from 'lodash.pick'
  import { editBatchSystemConfig, batchSystemConfigInfo} from '@/api/api'
  import JDate from '@/components/jeecg/JDate'
  import moment from 'moment'
  import JEllipsis from '@/components/jeecg/JEllipsis'
  import JInput from '@/components/jeecg/JInput'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getMsgInfo } from "@/utils/util"
  import { isEmail} from '@/utils/validate'

  export default {
    mixins: [JeecgListMixin],
    name: 'BatchSystemConfig',
    components: {
      JInput,
      FooterToolBar,
      JEllipsis,
    },
    created() {
      this.init(this);
    },
    data() {
      return {
        model: {},
        custValues: {},
        confirmLoading: false,
        form: this.$form.createForm(this),
        labelCol: {
          md: { span: 8 },
          sm: { span: 24 },
        },
        wrapperCol: {
          md: { span: 16 },
          sm: { span: 24 },
        },
        validatorRules:{
          errorRetryTimes:{rules: [{ required: true, message: getMsgInfo(this, 'msg0001', 'batchJob.defaultErrorRetryTimes') }]},
          errorNoticeEmails:{rules: [{ required: true, message: getMsgInfo(this, 'msg0001', 'batchJob.defaultErrorNoticeEmails') }, {validator : this.validateErrorNoticeEmails}]},
          emailHead:{rules: [{validator : this.limitLength}]},
          emailFoot:{rules:  [{validator : this.limitLength}]},
        },

        url:{}
      }
    },

    methods: {

      limitLength(rule, value, callback) {
        if (value != null && value.length > 1000) {
          callback(this.$t('app.message.msg0044').replace("{0}", "1000"))
        }
        callback();
      },

      validateErrorNoticeEmails(rule, value, callback) {
        if (value != null && value != "") {
          let emails = value.split(',');
          for (let key in emails) {
            if (!isEmail(emails[key])){
              callback(this.$t('app.message.batchJob.msg0006'))
            }
          }
        }
        callback();
      },

      init(obj) {
        batchSystemConfigInfo().then(res => {
          let rr = {};
          if (res.success) {
            rr = res.result;
            obj.model = res.result;
          }

          this.$nextTick(() => {
            this.form.setFieldsValue(pick(rr, 'errorRetryTimes','errorNoticeEmails','emailHead'
            , 'emailFoot'))
          });
        });
      },
      // 提交
      submit () {
        // 信息取得
        this.form.validateFields((err, values) => {
          if (!err) {
            this.confirmLoading = true

            let formData = Object.assign(this.model, values)
            let obj
            // 提交到后台
            obj = editBatchSystemConfig(formData)
            obj.then((res) => {
              if (res.success) {
                this.$message.success(res.message);
              } else {
                this.$message.warning(res.message)
              }
            }).finally(() => {
              this.confirmLoading = false
            })
          }
        })
      },
    }
  }
</script>

<style>
.table-page-search-wrapper .ant-form-explain {
    margin-top: -6px !important;
  }

  .ant-row {
    margin-bottom:4px;
  }

</style>