<template>
  <a-modal
    :title="title"
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
          :label="$t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui')">
          <j-dict-select-tag  v-if="(!this.model.serialNo)" dictCode="zensonFunshitsuShurui" :triggerChange="true"  @change="onSelectChangeSeikyushoShurui"
              v-decorator="['seikyushoShurui', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui')}) }]}]" />
          <label v-else>{{this.model.seikyushoDict}}</label>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.SeikyushoZensonFunshitsu.serialNo')" class="memoform">
          <a-input  v-if="(!this.model.serialNo)" maxLength="255" v-decorator="[ 'serialNo', validatorRules.serialNo]" />
          <label v-else>{{this.model.serialNo}}</label>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
           v-if="queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.area')" class="memoform" >
          <a-input  maxLength="255" v-decorator="['area', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.SeikyushoZensonFunshitsu.shiten')" class="memoform">
          <a-input  maxLength="255" v-decorator="['shiten',  {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.shiten')}) }]}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.SeikyushoZensonFunshitsu.tenMei')" class="memoform">
          <a-input  maxLength="255" v-decorator="['tenMei', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.tenMei')}) }]}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.tenCode')" class="memoform">
          <a-input  maxLength="255" v-decorator="['tenCode', {}]" />
        </a-form-item>
       <!-- <a-form-item :label="$t('app.label.SeikyushoZensonFunshitsu.uketsukebiDate')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 195px"
            format="YYYY-MM-DD"
            v-decorator="['uketsukebiDate',{initialValue:!model.uketsukebiDate?null:moment(model.uketsukebiDate,dateFormat)}]"
            placeholder="日時を選択してください" />
        </a-form-item> -->
        
         <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.SeikyushoZensonFunshitsu.kubun')">
          <j-dict-select-tag  dictCode="kubun" :triggerChange="true"  @change="onSelectChangeKubun"
              v-decorator="['kubun', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.kubun')}) }]}]" />
        </a-form-item>
                <!-- 性别 -->
        <!-- <a-form-item :label="$t('app.label.SeikyushoZensonFunshitsu.kubun')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'kubun', {}]" dictCode="kubun">
            <a-select-option :value="1">{{this.$t('app.label.SeikyushoZensonFunshitsu.zenson')}}</a-select-option>
            <a-select-option :value="2">{{this.$t('app.label.SeikyushoZensonFunshitsu.funshitsu')}}</a-select-option>
          </a-select>
        </a-form-item> -->
        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.SeikyushoZensonFunshitsu.kubun')" class="memoform">
          <a-input  maxLength="255" v-decorator="['kubun', {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.kubun')}) }]}]" />
        </a-form-item> -->

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.tel')" class="memoform">
          <a-input  maxLength="255" v-decorator="['tel', {}]" />
      </a-form-item>

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.keiyakuBango')" class="memoform">
          <!-- <a-input  maxLength="255" v-decorator="['keiyakuBango',  {rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.keiyakuBango')}) }]}]" /> -->
         <a-input  maxLength="255" v-decorator="['keiyakuBango',  {}]" />
        </a-form-item>
    
      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 3 || model.seikyushoShurui == 3 || queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.gatsudo')">
          <a-date-picker
            style="width: 195px"
            format="YYYY/MM/DD"
            v-decorator="['gatsudo',{initialValue:!model.gatsudo?null:moment(model.gatsudo, dateFormat),rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.gatsudo')}) }]}]"
            @change="onoutputDateChange"
            placeholder="日時を選択してください" />
      </a-form-item>

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.sgsUketsukeBi')">
          <a-date-picker
            style="width: 195px"
            format="YYYY/MM/DD"
            v-decorator="['sgsUketsukeBi',{initialValue:!model.sgsUketsukeBi?null:moment(model.sgsUketsukeBi,dateFormat)}]"
            placeholder="日時を選択してください" />
      </a-form-item>

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
           v-if="queryParam.seikyushoShurui == 3 || model.seikyushoShurui == 3 || queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.nyuryoku2SeikyuTsukiKijunbi')">
          <a-date-picker
            style="width: 195px"
            format="YYYY/MM/DD"
            v-decorator="['nyuryoku2SeikyuTsukiKijunbi',{initialValue:!model.nyuryoku2SeikyuTsukiKijunbi?null:moment(model.nyuryoku2SeikyuTsukiKijunbi,dateFormat)},{rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.nyuryoku2SeikyuTsukiKijunbi')}) }]}]"
            placeholder="日時を選択してください" />
      </a-form-item>

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
           v-if="queryParam.seikyushoShurui == 3 || model.seikyushoShurui == 3 || queryParam.seikyushoShurui == 1 || model.seikyushoShurui == 1"
          :label="$t('app.label.SeikyushoZensonFunshitsu.kaiyakuYearMonth')">
          <a-month-picker
            style="width: 195px"
            format="YYYY-MM"
            v-decorator="['kaiyakuYearMonth',{initialValue:!model.kaiyakuYearMonth?null:moment(model.kaiyakuYearMonth, 'YYYY-MM'),rules: [{ required: true, message: $t('app.message.msg0001',{'0': $t('app.label.SeikyushoZensonFunshitsu.kaiyakuYearMonth')}) }]}]"
            @change="onoutputDateChange"
            placeholder="日時を選択してください" />
      </a-form-item>

        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 3 || model.seikyushoShurui == 3"
          :label="$t('app.label.SeikyushoZensonFunshitsu.vlookOne')" class="memoform">
          <a-input  maxLength="255" v-decorator="['vlookOne', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 3 || model.seikyushoShurui == 3"
          :label="$t('app.label.SeikyushoZensonFunshitsu.vlookTwo')" class="memoform">
          <a-input  maxLength="255" v-decorator="['vlookTwo', {}]" />
        </a-form-item>
                <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 3 || model.seikyushoShurui == 3"
          :label="$t('app.label.SeikyushoZensonFunshitsu.vlookThree')" class="memoform">
          <a-input  maxLength="255" v-decorator="['vlookThree', {}]" />
        </a-form-item> -->

      <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 2 || model.seikyushoShurui == 2"
          :label="$t('app.label.SeikyushoZensonFunshitsu.fpnyuyokubi')">
          <a-date-picker
            style="width: 195px"
            format="YYYY/M/D"
            v-decorator="['fpnyuyokubi',{initialValue:!model.fpnyuyokubi?null:moment(model.fpnyuyokubi,dateFormat)}]"
            placeholder="日時を選択してください" />
      </a-form-item>
            <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 2 || model.seikyushoShurui == 2"
          :label="$t('app.label.SeikyushoZensonFunshitsu.hasseiGatsudo')">
          <a-date-picker
            style="width: 195px"
            format="YYYY/M/D"
            v-decorator="['hasseiGatsudo',{initialValue:!model.hasseiGatsudo?null:moment(model.hasseiGatsudo,dateFormat)}]"
            placeholder="日時を選択してください" />
      </a-form-item>
            <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-if="queryParam.seikyushoShurui == 2 || model.seikyushoShurui == 2"
          :label="$t('app.label.SeikyushoZensonFunshitsu.seikyuGatsudo')">
          <a-date-picker
            style="width: 195px"
            format="YYYY/M/D"   
            v-decorator="['seikyuGatsudo',{initialValue:!model.seikyuGatsudo?null:moment(model.seikyuGatsudo,dateFormat)}]"
            placeholder="日時を選択してください" />
      </a-form-item>


        <a-form-item 
        ref="dbType" prop="fileList" :autoLink="true"
            style="height: 80px"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.SeikyushoZensonFunshitsu.pdfData')">
          
            <j-uploadPdf
              name="file"
              @buttonDisabled="buttonDisabled"
              @buttonAble="buttonAble"
              v-decorator="['fileName',{}]"
            >
              <a-button> <a-icontype="upload" /> {{$t('app.label.SeikyushoZensonFunshitsu.upload')}}</a-button>
            </j-uploadPdf>
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
  import {quartzStatus,getJobClasses,duplicateNewCheck} from '@/api/api'
  import JCron from "@/components/jeecg/JCron";
  import pick from 'lodash.pick'
  import JDictSelectTag from '../../../components/dict/JDictSelectTag.vue'
  import JUploadPdf from '../../../components/jeecg/JUploadPdf'
  import moment from 'moment'
  import { getMsgInfo } from "@/utils/util"
  //import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'

  export default {
    name: "SeikyushoZensonFunshitsuModal",
    components: {
      JCron,
      JUploadPdf,
      //JSelectPosition
    },
    data () {
      return {
         headers: {
          authorization: 'authorization-text',
        },
        queryParam: {},
        buttonStyle: 'solid',
        visible: false,
        title:this.$t('app.common.operation'),
        addTitle: '追加',
        editTitle: '編集',
        //disabled:false,
        model: {},
        dateFormat:"YYYY-MM-DD",
        fileList:[],
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
          add: "/sys/seikyushozensonfunshitsu/add",
          edit: "/sys/seikyushozensonfunshitsu/update"
        },
        validatorRules:{
          // 用户账号check
          serialNo:{
            rules: [{
              required: true, message: getMsgInfo(this,'msg0001','SeikyushoZensonFunshitsu.serialNo')
            },{
              validator: this.validateSerialNo,
            }]
          },
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
        this.queryParam.seikyushoShurui = '';
        this.model = Object.assign({},record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'seikyushoDict','seikyushoShurui','serialNo','area','shiten','tenMei','tenCode','kubun','tel','keiyakuBango','fileName'));
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
            console.log("model:"+that.model);
            this.isAble = true; 
            that.confirmLoading = true;
            if(!values.gatsudo){
              values.gatsudo = '';
            }else{
              values.gatsudo = values.gatsudo.format("YYYY/MM/DD");
            }

            if(!values.sgsUketsukeBi){
              values.sgsUketsukeBi = '';
            }else{
              values.sgsUketsukeBi = values.sgsUketsukeBi.format("YYYY/MM/DD");
            }

            if(!values.nyuryoku2SeikyuTsukiKijunbi){
              values.nyuryoku2SeikyuTsukiKijunbi = '';
            }else{
              values.nyuryoku2SeikyuTsukiKijunbi = values.nyuryoku2SeikyuTsukiKijunbi.format("YYYY/MM/DD");
            }

            if(!values.kaiyakuYearMonth){
              values.kaiyakuYearMonth = '';
            }else{
              values.kaiyakuYearMonth = values.kaiyakuYearMonth.format("YYYY-MM");
            }

            if(!values.uketsukebiDate){
              values.uketsukebiDate = '';
            }else{
              values.uketsukebiDate = values.uketsukebiDate.format(this.dateFormat);
            }

            if(!values.fpnyuyokubi){
              values.fpnyuyokubi = '';
            }else{
              values.fpnyuyokubi = values.fpnyuyokubi.format("YYYY/M/D");
            }
            if(!values.hasseiGatsudo){
              values.hasseiGatsudo = '';
            }else{
              values.hasseiGatsudo = values.hasseiGatsudo.format("YYYY/M/D");
            }
            if(!values.seikyuGatsudo){
              values.seikyuGatsudo = '';
            }else{
              values.seikyuGatsudo = values.seikyuGatsudo.format("YYYY/M/D");
            }
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              console.log("1111111");
              httpurl+=this.url.add;
              method = 'post';
            }else{
              console.log("22222222");
              httpurl+=this.url.edit;
              method = 'put';
            }
            console.log("values.fileId前:" +this.model.fileId);

            console.log("values.fileId后:" + this.model.fileId);
            let formData = Object.assign(this.model, values);
            console.log("3333:"+formData.fileList);
            console.log("4444:"+formData.fileName);
            //console.log("3333:"+that.fileList);
            //formData.fileList = that.fileList;
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
              // this.queryParam.denpyoShurui = '';
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.queryParam.denpyoShurui = '';
        //this.queryParam.createTimeRange=[];
        this.close()
      },
      handleClear () {
        //this.queryParam.createTimeRange=[]
        this.edit({});
      },
       handleChange (info) {
          console.log("1111111111");
          this.$refs.dbType.onFieldChange()
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

      onoutputDateChange: function (value) {
        this.queryParam.outputDate=value;
      },  
       onSelectChangeKubun(value) {
        //this.form.resetFields();
        this.queryParam.kubun = value;
      },
      onSelectChangeSeikyushoShurui(value) {
        //this.form.resetFields();
        let formData = Object.assign({}, this.queryParam);
        this.form.resetFields();
        // this.$nextTick(() => { 
        //   this.form.setFieldsValue(pick(formData,'outputDate'));
        // });
        this.queryParam.seikyushoShurui = value;
        console.log("000:" + value);

      },      
      moment,
      // getCurrentData(){
      //   return moment().subtract(1,'months').startOf('month')
      // },
      buttonAble(){
        this.isAble = false;

      },
      buttonDisabled(){
        this.isAble = true; 
        //this.form.resetFields();

      },
      getNowMonth(){
        return moment().startOf('month')
      },
      getLastMonth(){
        return moment().month(moment().month() - 1).startOf('month');
      },
      // serialNo 重复check
      validateSerialNo(rule, value, callback){
        var params = {
          tableName: 't_seikyusho_zenson_funshitsu',
          fieldName: 'serial_no',
          fieldVal: value,
          dataId: this.queryParam.seikyushoShurui
        };
        duplicateNewCheck(params).then((res) => {
          if (res.success) {
          callback()
        } else {
          callback(getMsgInfo(this,'msg0028','SeikyushoZensonFunshitsu.serialNo'))
        }
      })
      },
    }
  }
</script>

<style scoped>

</style>