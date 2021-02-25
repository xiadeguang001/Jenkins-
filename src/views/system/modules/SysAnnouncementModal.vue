<template>
  <a-drawer
    :title="title"
    :maskClosable="false"
    :width="900"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @close="handleCancel"
    @cancel="handleCancel"
    :okButtonProps="{ props: {disabled: disabled} }"
    :cancelText="$t('app.common.close')">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row style="width: 100%;">

          <!-- 标题 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.titile')">
              <a-input v-decorator="['titile', validatorRules.title]" :readOnly="disableSubmit"/>
            </a-form-item>
          </a-col>

          <!-- 消息类型 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.msgCategory')">
              <a-select
                v-decorator="[ 'msgCategory', validatorRules.msgCategory]"
                :disabled="disableSubmit"
                :getPopupContainer = "(target) => target.parentNode">
                <a-select-option value="1">{{this.$t('app.label.notice')}}</a-select-option>
                <a-select-option value="2">{{this.$t('app.label.message')}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row style="width: 100%;">

          <!-- 开始时间 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.startTime')">
              <j-date style="width: 100%" :getCalendarContainer="node => node.parentNode" v-decorator="[ 'startTime', validatorRules.startTime]" showTime dateFormat="YYYY-MM-DD HH:mm:ss" ></j-date>
            </a-form-item>
          </a-col>
          <!-- 结束时间 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.endTime')"
              class="endTime">
              <j-date style="width: 100%" :getCalendarContainer="node => node.parentNode" v-decorator="[ 'endTime', validatorRules.endTime]" showTime dateFormat="YYYY-MM-DD HH:mm:ss"></j-date>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%;">
          <!-- 优先级 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.priority')">
              <a-select
                v-decorator="[ 'priority', {}]"
                :disabled="disableSubmit"
                :getPopupContainer = "(target) => target.parentNode">
                <a-select-option value="L">{{this.$t('app.label.low')}}</a-select-option>
                <a-select-option value="M">{{this.$t('app.label.in')}}</a-select-option>
                <a-select-option value="H">{{this.$t('app.label.high')}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- 通告类型 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.msgType')">
              <a-select
                v-decorator="[ 'msgType', validatorRules.msgType]"
                :disabled="disableSubmit"
                @change="chooseMsgType"
                :getPopupContainer = "(target) => target.parentNode">
                <a-select-option value="USER">{{this.$t('app.label.specifyUsers')}}</a-select-option>
                <a-select-option value="ALL">{{this.$t('app.label.allUsers')}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%;">

          <!-- 指定用户 -->
          <a-col :span="24/2">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.specifyUsers')"
              v-if="userType">
              <a-select
                mode="multiple"
                v-model="selectedUser"
                @dropdownVisibleChange="selectUserIds"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%;">
          <!-- 内容 -->
          <a-col :span="24">
            <a-form-item
              :labelCol="labelColX1"
              :wrapperCol="wrapperColX1"
              :label="$t('app.label.msgContent')"
              class="memoform j-field-content">
              <j-editor v-decorator="[ 'msgContent', {} ]" triggerChange></j-editor>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <select-user-list-modal ref="UserListModal" @choseUser="choseUser"></select-user-list-modal>

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
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import { getAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import JEditor from '@/components/jeecg/JEditor'
  import SelectUserListModal from "./SelectUserListModal";
  import moment from 'moment'
  import { getMsgInfo } from "@/utils/util"

  export default {
    components: { JEditor, JDate, SelectUserListModal},
    name: "SysAnnouncementModal",
    data () {
      return {
        title: this.$t('app.common.operation'),
        addTitle: '添加通告',
        editTitle: '编辑通告',
        visible: false,
        disableSubmit:false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        labelColX1: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperColX1: {
          xs: { span: 24 },
          sm: { span: 21 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
          title:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','titile') }]},
          msgCategory:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','msgCategory')}]},
          msgType:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','msgType') }]},
          endTime:{rules:[{validator: this.endTimeValidate}]},
          startTime:{rules:[{validator: this.startTimeValidate}]}
        },
        url: {
          queryByIds: "/sys/user/queryByIds",
          add: "/sys/annountCement/add",
          edit: "/sys/annountCement/edit",
        },
        userType:false,
        userIds:[],
        selectedUser:[],
        disabled:false,
        msgContent:"",
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
        this.model = {}
        this.disable = false;
        this.visible = true;
        this.getUser(record);
      },
      getUser(record){
        this.model = Object.assign({}, record);
        // 指定用户
        if(record&&record.msgType === "USER"){
          this.userType =  true;
          this.userIds = record.userIds;
          getAction(this.url.queryByIds,{userIds:this.userIds}).then((res)=>{
            if(res.success){
              for(var i=0;i<res.result.length;i++){
                this.selectedUser.push(res.result[i].realname);
              }
              this.$refs.UserListModal.edit(res.result,this.userIds);
            }
          });
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'endTime','startTime','titile','msgContent','sender','priority','msgCategory','msgType','sendStatus','delFlag'))
        });
      },
      close () {
        this.$emit('close');
        this.selectedUser = [];
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
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
            if(this.userType){
              formData.userIds =  this.userIds;
            }
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
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
        this.visible = false;
        this.$emit('close');
        this.resetUser();
      },
      resetUser (){
        this.userType =  false;
        this.userIds = [];
        this.selectedUser = [];
        this.disabled = false;
        this.$refs.UserListModal.edit(null,null);
      },
      selectUserIds() {
        this.$refs.UserListModal.add(this.selectedUser,this.userIds);
      },
      chooseMsgType(value) {
        if("USER" == value) {
          this.userType = true;
        } else {
          this.userType = false;
          this.selectedUser = [];
          this.userIds = [];
        }
      },
      // 子modal回调
      choseUser:function(userList){
        this.selectedUser = [];
        this.userIds = [];
        for(var i=0;i<userList.length;i++){
          this.selectedUser.push(userList[i].realname);
          if(i<userList.length-1){
            this.userIds += userList[i].id+","
          }else{
            this.userIds += userList[i].id
          }
        }
      },
      startTimeValidate(rule,value,callback){
        let endTime = this.form.getFieldValue("endTime")
        if(!value || !endTime){
          callback()
        }else if(moment(value).isBefore(endTime)){
          callback()
        }else{
          callback(this.$t('app.message.msg0300'))
        }
      },
      endTimeValidate(rule,value,callback){
        let startTime = this.form.getFieldValue("startTime")
        if(!value || !startTime){
          callback()
        }else if(moment(startTime).isBefore(value)){
          callback()
        }else{
          callback(this.$t('app.message.msg0301'))
        }
      }

    }
  }
</script>

<style scoped>

</style>