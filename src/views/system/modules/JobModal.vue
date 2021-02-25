<template>
  <a-modal
    :title="$t('app.common.add')"
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
            v-decorator="['outputDate',{initialValue:moment(getLastMonth(), 'YYYY-MM'),rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.Job.outputDate')}) }]}]"
            @change="onoutputDateChange"
            placeholder="日時を選択してください" />
        </a-form-item>


         <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.Job.denpyoShurui')">
          <j-dict-select-tag  dictCode="denpyoShurui" :triggerChange="true"  @change="onSelectChange"
              v-decorator="['denpyoShurui', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.Job.denpyoShurui')}) }]}]" />
        </a-form-item>

       <a-form-item :label="$t('app.label.Job.lastPrintDate')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="queryParam.denpyoShurui ==5">
              <!-- <a-date-picker
                style="width: 210px"
                v-model="queryParam.dateNow"
                format="YYYY-MM-DD"
                :placeholder=""
                @change="onDateChange"
              /> -->
          <a-date-picker
            style="width: 195px"
            format="YYYY-MM-DD"
            v-decorator="['lastPrintDate',{initialValue:moment(getCurrentData(), 'YYYY-MM-DD')}]"
            placeholder="日時を選択してください" />
        </a-form-item>

        <a-form-item :label="$t('app.label.Job.baseDate')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="queryParam.denpyoShurui ==6">
              <a-range-picker
                style="width: 300px"
                v-model="queryParam.createTimeRange"
                format="YYYY-MM-DD"
                :placeholder="['開始時間', '終了時間']"
                @change="onDateChange"
                @ok="onDateOk"
              />
        </a-form-item>
      
        <a-form-item 
            style="height: 80px"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.Job.originalData')">
          
            <j-upload
              name="file"
              @buttonDisabled="buttonDisabled"
              @buttonAble="buttonAble"
              v-decorator="['originalData', {rules: [{ required: true, message: $t('app.message.msg0002',{'0': $t('app.label.Job.originalData')}) }]}]"
            >
              <a-button> <a-icontype="upload" /> {{$t('app.label.Job.upload')}}</a-button>
            </j-upload>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.Job.remark')" class="memoform">
          <a-textarea :rows="5" maxLength="255" v-decorator="['remark', {}]" />
        </a-form-item>

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
  import {quartzStatus,getJobClasses} from '@/api/api'
  import JCron from "@/components/jeecg/JCron";
  import pick from 'lodash.pick'
  import JDictSelectTag from '../../../components/dict/JDictSelectTag.vue'
  import JUpload from '../../../components/jeecg/JUpload'
  import moment from 'moment'

  export default {
    name: "JobModal",
    components: {
      JCron,
      JUpload
    },
    data () {
      return {
         headers: {
          authorization: 'authorization-text',
        },
        queryParam: {
          createTimeRange:[],
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
        form: this.$form.createForm(this),
        url: {
          add: "/sys/job/add"
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
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'denpyoShurui','originalData','remark'));
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
            this.isAble = true; 
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
            formData.selectJobWork = this.selectJobWork;
            formData.status = this.selectStatusList;
            // 時間パラメーターはバックグラウンドに渡されません
            delete formData.createTimeRange; 
            if (this.queryParam.createTime_begin != null && ( this.queryParam.denpyoShurui ==6)) {
             
                formData.createTime_begin = this.queryParam.createTime_begin;
            }
            if (this.queryParam.createTime_end != null && ( this.queryParam.denpyoShurui ==6)) {
                formData.createTime_end = this.queryParam.createTime_end;
            }

            if (formData.lastPrintDate != null && (this.queryParam.denpyoShurui ==5)) { 
                formData.createTime_begin = formData.lastPrintDate.format('YYYY-MM-DD');
            }

            if (formData.outputDate != null ) { 
                formData.outputDate = formData.outputDate.format('YYYY-MM');
            }
 
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              this.isAble = false; 
              this.queryParam.denpyoShurui = 0;
              this.queryParam.createTimeRange=[];
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.queryParam.denpyoShurui = 0;
        this.queryParam.createTimeRange=[];
        this.close()
      },
      handleClear () {
        
        this.queryParam.denpyoShurui = 0;
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
      onDateOk(value) {
        console.log(value);
      },
      onSelectChange(value) {
         let formData = Object.assign({}, this.queryParam);
    
        this.form.resetFields();
        this.$nextTick(() => { 
          this.form.setFieldsValue(pick(formData,'outputDate'));
        });
        
        // if(value == 6){

        //   this.queryParam.createTimeRange=[moment().subtract(1,'months').startOf('month'),moment().subtract(1,'months').endOf('month')]
        // } else {

          this.queryParam.createTimeRange=[]
        //}
        this.queryParam.denpyoShurui = value;
      },      
      moment,
      getCurrentData(){
        return moment().subtract(1,'months').startOf('month')
      },
      buttonAble(){
        this.isAble = false;
      },
      buttonDisabled(){        
          this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'originalData'));
        });
        this.isAble = true;

      },
      getNowMonth(){
        return moment().startOf('month')
      },
      getLastMonth(){
        return moment().month(moment().month() - 1).startOf('month');
      }
    }
  }
</script>

<style scoped>

</style>