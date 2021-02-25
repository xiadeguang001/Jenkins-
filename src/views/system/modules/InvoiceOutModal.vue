<template>
  <a-modal
    :title="$t('app.label.Job.out')"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :cancelText="$t('app.common.close')">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.Job.outputDate')">
          <a-month-picker
            style="width: 195px"
            format="YYYY-MM"
           v-decorator="['outputDate',{initialValue:moment(getNowMonth(), 'YYYY-MM'),rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.Job.outputDate')}) }]}]"
            @change="onoutputDateChange"
            placeholder="日時を選択してください" />
        </a-form-item>

         <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.Job.denpyoShurui')">
          <j-dict-select-tag  dictCode="seikyushoShurui" :triggerChange="true"  @change="onSelectChange"
              v-decorator="['seikyushoShurui', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.Job.denpyoShurui')}) }]}]" />
        </a-form-item>
        <div style="height:37px;">
            <a-form-item :label="$t('app.label.Job.lastPrintDate')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="queryParam.seikyushoShurui ==5">
                <a-date-picker
                  style="width: 195px;"
                  format="YYYY-MM-DD"
                  v-decorator="['lastPrintDate',{initialValue:moment(getNowMonth(), 'YYYY-MM'),rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.Job.lastPrintDate')}) }]}]"
                  @change="onlastPrintDateChange"
                  placeholder="日時を選択してください" />
            </a-form-item>
            <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
            </a-form-item>
        </div>
 

        <!-- <a-form-item :label="$t('app.label.Job.baseDate')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="queryParam.seikyushoShurui ==6">
              <a-range-picker
                style="width: 300px"
                v-model="queryParam.createTimeRange"
                format="YYYY-MM-DD"
                :placeholder="['開始時間', '終了時間']"
                @change="onDateChange"
                @ok="onDateOk"
              />
        </a-form-item> -->
      

      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button :disabled="isAble" @click="handleClear" type="primary">{{$t('app.common.clear')}}</a-button>
      <a-button :disabled="isAble" @click="handleSubmit" type="primary">{{$t('app.label.Job.saveSendTask')}}</a-button>
    </template>
  </a-modal>
</template>

<script>
  import { httpAction,postAction } from '@/api/manage'
  import {quartzStatus,getJobClasses,ouputInvoicePost} from '@/api/api'
  import JCron from "@/components/jeecg/JCron";
  import pick from 'lodash.pick'
  import JDictSelectTag from '../../../components/dict/JDictSelectTag.vue'
  import JUpload from '../../../components/jeecg/JUpload'
  import moment from 'moment'
 

  export default {
    name: "InvoiceOutModal",
    components: {
      JCron,
      JUpload
    },
    data () {
      return {
         //visibility: "visibility:hidden",
         headers: {
          authorization: 'authorization-text',
        },
        queryParam: {
          createTimeRange:[]
        },
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
        isAble: false,
        form: this.$form.createForm(this)
        // url: {
        //   add: "/sys/job/add"
        // }
      }
    },
    computed:{
      // uploadAction:function () {
      //   return this.url.fileUpload;
      // }
    },
    created () {
    },
    methods: {

      edit (record) {
        let that = this;
        that.form.resetFields();
        this.model = Object.assign({},record);
        this.visible = true;
        // this.$nextTick(() => {
        //   this.form.setFieldsValue(pick(this.model,'seikyushoShurui','originalData','remark'));
        // });
        
      },
      show(record) {
        this.edit({});
        let that = this
        this.visible = true
        this.record = record
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleSubmit () {
        const that = this;
        this.loading = true;
        this.isAble = true;
        that.confirmLoading = true;
        this.form.validateFields((err, values) => { 
        if (!err) {
          let formData = Object.assign(this.model, values);
          formData.selectJobWork = this.selectJobWork;
          if (formData.outputDate != null ) { 
              formData.outputDate = formData.outputDate.format('YYYY-MM');
          }
          //時間パラメーターはバックグラウンドに渡されません
          delete formData.createTimeRange;
          if (formData.lastPrintDate != null && (this.queryParam.seikyushoShurui ==5)) { 
            formData.createTime_begin = formData.lastPrintDate.format('YYYY-MM-DD');
          }
          ouputInvoicePost(formData).then((response) => {
            let yy = new Date().getFullYear() + ''
            let mm = new Date().getMonth() + 1
            let dd = new Date().getDate()
            let hh = new Date().getHours()
            let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
            let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
            let fileName = yy + mm + dd + hh + mf + ss
            if (formData.seikyushoShurui == '1') {
              fileName = 'output_99.9_' + fileName
            } else if (formData.seikyushoShurui == '2') {
              fileName = 'output_FP1_' + fileName
            } else if (formData.seikyushoShurui == '3') {
              fileName = 'output_iO_' + fileName
            } else if (formData.seikyushoShurui == '4') {
              fileName = 'output_SDスマホ_' + fileName
            } else if (formData.seikyushoShurui == '5') {
              fileName = 'output_スマプリ_' + fileName
            } else if (formData.seikyushoShurui == '6') {
              fileName = 'output_MDM明細_' + fileName
            } else if (formData.seikyushoShurui == '7') {
              fileName = 'output_999収支策定_' + fileName
            }
            console.log(fileName)
            const blob = new Blob([response])
            if (window.navigator.msSaveOrOpenBlob) {
              // 兼容IE
              fileName = fileName +'.zip'
              navigator.msSaveBlob(blob, fileName)
            } else {
              fileName = fileName +'.zip'

              let url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' }))
              console.log(url)
              let link = document.createElement('a')
              link.style.display = 'none'
              link.href = url
              link.setAttribute('download', fileName)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link) //下载完成移除元素
              window.URL.revokeObjectURL(url) //释放掉blob对象
            }

          }).finally(() => {
                this.loading = false
                that.confirmLoading = false;
                this.isAble = false; 
                //this.queryParam.seikyushoShurui = 0;
                //this.queryParam.createTimeRange=[];
                //that.close();
        })

        }else{
              this.loading = false
              that.confirmLoading = false;
              this.isAble = false; 
        }
      })
         
      },
      handleCancel () {
        this.queryParam.seikyushoShurui = 0;
        this.queryParam.createTimeRange=[];
        this.close()
      },
      handleClear () {
        
        this.queryParam.seikyushoShurui = 0;
        this.queryParam.createTimeRange=[]
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
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onoutputDateChange: function (value) {
        this.queryParam.outputDate=value;
      },   
      onlastPrintDateChange: function (value) {
        this.queryParam.lastPrintDate=value;
      },    
      onDateOk(value) {
        console.log(value);
      },
      onSelectChange(value) {

        let formData = Object.assign({}, this.queryParam);
        this.form.resetFields();
        this.$nextTick(() => { 
          this.form.setFieldsValue(pick(formData,'outputDate'));
        });
        this.queryParam.createTimeRange=[]
        this.queryParam.seikyushoShurui = value;
      },      
      moment,
      getCurrentData(){
        return moment().subtract(1,'months').startOf('month')
      },
      buttonAble(){
        this.isAble = false;
      },
      buttonDisabled(){        
        //   this.$nextTick(() => {
        //   this.form.setFieldsValue(pick(this.model,'originalData'));
        // });
        this.isAble = true;

      },
      getNowMonth(){
        return moment().startOf('month')
      }
    }
  }
</script>

<style scoped>

</style>