<template>
  <a-drawer
    :title="title"
    :maskClosable="false"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

    <template slot="title">
      <div style="width: 100%;">
        <span>{{ title }}</span>
        <span style="display:inline-block;width:calc(100% - 51px);padding-right:10px;text-align: right">
          <a-button @click="toggleScreen" icon="appstore" style="height:20px;width:20px;border:0px"></a-button>
        </span>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <!-- 用户账号 -->
        <a-form-item :label="$t('app.label.user.userName')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'username', validatorRules.username]" />
        </a-form-item>


        <!-- 登陆密码 -->
        <template v-if="!model.id">
          <a-form-item :label="$t('app.label.user.loginPassword')" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input type="password"  v-decorator="[ 'password', validatorRules.password]" />
          </a-form-item>

          <!-- 确认密码 -->
          <a-form-item :label="$t('app.label.user.confirmPassword')" :labelCol="labelCol" :wrapperCol="wrapperCol" >
            <a-input type="password" @blur="handleConfirmBlur" v-decorator="[ 'confirmpassword', validatorRules.confirmpassword]"/>
          </a-form-item>
        </template>

        <!-- 用户姓名 -->
        <a-form-item :label="$t('app.label.user.userRealName')" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input v-decorator="[ 'realname', validatorRules.realname]" />
        </a-form-item>

        <!-- 工号 -->
        <a-form-item :label="$t('app.label.user.workNo')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'workNo', validatorRules.workNo]" />
        </a-form-item>

        <!-- 角色分配 -->
        <a-form-item :label="$t('app.label.user.casting')" :labelCol="labelCol" :wrapperCol="wrapperCol" v-show="!roleDisabled" >
          <a-select
            mode="multiple"
            style="width: 100%"
            optionFilterProp = "children"
            v-model="selectedRole"
            >
            <a-select-option v-for="(role,roleindex) in roleList" :key="roleindex.toString()" :value="role.id">
              {{ role.roleName }}
            </a-select-option>
          </a-select>
        </a-form-item>
       
        <!-- 头像 -->
        <a-form-item :label="$t('app.label.user.avatar')" :labelCol="labelCol" :wrapperCol="wrapperCol" style="height: 124px">
          <j-image-upload class="avatar-uploader" :text="$t('app.common.upload')" v-model="fileList"></j-image-upload>
        </a-form-item>

        <!-- 生日 -->
        <a-form-item :label="$t('app.label.user.birthday')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-date-picker
            style="width: 100%"
            v-decorator="['birthday', {initialValue:!model.birthday?null:moment(model.birthday,dateFormat)}]"/>
        </a-form-item>

        <!-- 性别 -->
        <a-form-item :label="$t('app.label.user.sex')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select v-decorator="[ 'sex', {}]" dictCode="sex">
            <a-select-option :value="1">{{this.$t('app.label.user.man')}}</a-select-option>
            <a-select-option :value="2">{{this.$t('app.label.user.woman')}}</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 电子邮箱 -->
        <a-form-item :label="$t('app.label.user.email')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'email', validatorRules.email]" />
        </a-form-item>

        <!-- 手机号码 -->
        <a-form-item :label="$t('app.label.user.phoneNumber')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input :disabled="isDisabledAuth('user:form:phone')" v-decorator="[ 'phone', validatorRules.phone]" />
        </a-form-item>

        <!-- 固定电话 -->
        <a-form-item :label="$t('app.label.user.fixedNumber')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[ 'telephone', validatorRules.telephone]"/>
        </a-form-item>

        <!-- 工作流引擎 -->
        <!-- <a-form-item :label="$t('app.label.user.workflowEngine')" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-dict-select-tag  v-decorator="['activitiSync', {}]" :type="'radio'" :triggerChange="true" dictCode="activiti_sync"/>
        </a-form-item> -->

      </a-form>
    </a-spin>
    <depart-window ref="departWindow" @ok="modalFormOk"></depart-window>
    <div class="fill-drawer-bottom"></div>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm :title="$t('app.message.msg0047')" @confirm="handleCancel" :okText="$t('app.common.confirm')" :cancelText="$t('app.common.cancel')">
        <a-button style="margin-right: .8rem">{{this.$t('app.common.cancel')}}</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">{{this.$t('app.common.submit')}}</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import pick from 'lodash.pick'
  import moment from 'moment'
  import Vue from 'vue'
  // 引入搜索部门弹出框的组件
  import departWindow from './DepartWindow'
  import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { getAction } from '@/api/manage'
  import {addUser,editUser,queryUserRole,queryall } from '@/api/api'
  import { disabledAuthFilter } from "@/utils/authFilter"
  import {duplicateCheck } from '@/api/api'
  import JImageUpload from '../../../components/jeecg/JImageUpload'
  import { getMsgInfo } from "@/utils/util"
  import JDictSelectTag from '../../../components/dict/JDictSelectTag.vue'
  import { isEmailBox, isMobileNumber, isPhoneNumber, isNumber} from '@/utils/validate'

  export default {
    name: "UserModal",
    components: {
      JImageUpload,
      departWindow,
      JSelectPosition
    },
    data () {
      return {
        queryParam: {},
        departDisabled: false, //是否是我的部门调用该页面
        roleDisabled: false, //是否是角色维护调用该页面
        modalWidth:800,
        drawerWidth:700,
        modaltoggleFlag:true,
        selectModel: {},
        confirmDirty: false,
        selectedDepartKeys:[], //保存用户选择部门id
        checkedDepartKeys:[],
        checkedDepartNames:[], // 保存部门的名称 =>title
        checkedDepartNameString:"", // 保存部门的名称 =>title
        resultDepartOptions:[],
        userId:"", //保存用户id
        disableSubmit:false,
        userDepartModel:{userId:'',departIdList:[]}, // 保存SysUserDepart的用户部门中间表数据需要的对象
        dateFormat:"YYYY-MM-DD",
        validatorRules:{
          // 用户账号check
          username:{
            rules: [{
              required: true, message: getMsgInfo(this,'msg0001','userAgentName')
            },{
              validator: this.validateUsername,
            }]
          },
          
          // 登录密码check
          password:{
            rules: [
              {
              required: true,
              message: this.$t('app.message. msg0060')
            }, 
            {
              validator: this.validateToNextPassword,
            }],
          },

          // 确认密码check
          confirmpassword:{
            rules: [{
              required: true, message: this.$t('app.message.msg0024'),
            }, {
              validator: this.compareToFirstPassword,
            }],
          },
          // 用户姓名check
          realname:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','userAgentName')}]},
          
          // 手机号check
          phone:{ rules: [{ pattern:isMobileNumber(), message: '携帯番号のフォーマットが間違っています。もう一度入力してください。' }] },
          // 电子邮箱
          email:{ rules: [{ pattern:isEmailBox(), message: 'メールのフォーマットが間違っています。もう一度入力してください。' }] },
          
          // 固定电话
          telephone:{ rules: [{ pattern:isPhoneNumber(), message: '固定電話フォーマットが間違っています。もう一度入力してください。' }] },
        },
        departIdShow:false,
        departIds:[], //负责部门id
        title:this.$t('app.common.operation'),
        addTitle: 'ユーザを追加',
        editTitle: 'ユーザーを編集',
        visible: false,
        model: {},
        roleList:[],
        selectedRole:[],
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },
        uploadLoading:false,
        confirmLoading: false,
        headers:{},
        form:this.$form.createForm(this),
        picUrl: "",
        url: {
          fileUpload: window._CONFIG['domianURL']+"/sys/common/upload2",
          imgerver: window._CONFIG['staticDomainURL'],
          userWithDepart: "/sys/user/userDepartList", // 引入为指定用户查看部门信息需要的url
          userId:"/sys/user/generateUserId", // 引入生成添加用户情况下的url
          syncUserByUserName:"/process/extActProcess/doSyncUserByUserName",//同步用户到工作流
        },
        identity:"1",
        fileList:[],
      }
    },
    created () {
      const token = Vue.ls.get(ACCESS_TOKEN);
      this.headers = {"X-Access-Token":token}

    },
    computed:{
      uploadAction:function () {
        return this.url.fileUpload;
      }
    },
    methods: {
      isDisabledAuth(code){
        return disabledAuthFilter(code);
      },
      //窗口最大化切换
      toggleScreen(){
        if(this.modaltoggleFlag){
          this.modalWidth = window.innerWidth;
        }else{
          this.modalWidth = 800;
        }
        this.modaltoggleFlag = !this.modaltoggleFlag;
      },
      initialRoleList(){
        queryall().then((res)=>{
          if(res.success){
            this.roleList = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      loadUserRoles(userid){
        queryUserRole({userid:userid}).then((res)=>{
          if(res.success){
            this.selectedRole = res.result;
          }else{
            console.log(res.message);
          }
        });
      },
      refresh () {
          this.selectedDepartKeys=[];
          this.checkedDepartKeys=[];
          this.checkedDepartNames=[];
          this.checkedDepartNameString = "";
          this.userId=""
          this.resultDepartOptions=[];
          this.departId=[];
          this.departIdShow=false;
      },   
      add () {
        this.picUrl = "";
        this.refresh();
        this.edit({});
      },
      edit (record) {
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        let that = this;
        that.initialRoleList();
        that.checkedDepartNameString = "";
        that.form.resetFields();
          if(record.hasOwnProperty("id")){
            that.loadUserRoles(record.id);
            setTimeout(() => {
              this.fileList = record.avatar;
            }, 5)
          }
        that.userId = record.id;
        that.visible = true;
        that.model = Object.assign({}, record);
        
        that.$nextTick(() => {
          that.form.setFieldsValue(pick(this.model,'username','sex','realname','email','phone','workNo','telephone','post'))
        });
        //身份为上级显示负责部门，否则不显示
        if(this.model.identity=="2"){
            this.identity="2";
            this.departIdShow=true;
        }else{
            this.identity="1";
            this.departIdShow=false;
        }
        // 调用查询用户对应的部门信息的方法
        that.checkedDepartKeys = [];
        that.loadCheckedDeparts();
      },
      //
      loadCheckedDeparts(){
        let that = this;
        if(!that.userId){return}
        getAction(that.url.userWithDepart,{userId:that.userId}).then((res)=>{
          that.checkedDepartNames = [];
          if(res.success){
            var depart=[];
            var departId=[];
            for (let i = 0; i < res.result.length; i++) {
              that.checkedDepartNames.push(res.result[i].title);
              this.checkedDepartNameString = this.checkedDepartNames.join(",");
              that.checkedDepartKeys.push(res.result[i].key);
              //新增负责部门选择下拉框
              depart.push({
                  key:res.result[i].key,
                  title:res.result[i].title
              })
              departId.push(res.result[i].key)
            }
            that.resultDepartOptions=depart;
            //判断部门id是否存在，不存在择直接默认当前所在部门
            if(this.model.departIds){
                this.departIds=this.model.departIds.split(",");
            }else{
                this.departIds=departId;
            }
            that.userDepartModel.departIdList = that.checkedDepartKeys
          }else{
            console.log(res.message);
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
        this.disableSubmit = false;
        this.selectedRole = [];
        this.userDepartModel = {userId:'',departIdList:[]};
        this.checkedDepartNames = [];
        this.checkedDepartNameString='';
        this.checkedDepartKeys = [];
        this.selectedDepartKeys = [];
        this.resultDepartOptions=[];
        this.departIds=[];
        this.departIdShow=false;
        this.identity="1";
        this.fileList=[];
      },
      moment,
      handleSubmit () {

        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            if(!values.birthday){
              values.birthday = '';
            }else{
              values.birthday = values.birthday.format(this.dateFormat);
            }
            let formData = Object.assign(this.model, values);
            formData.avatar = that.fileList;
            if (that.selectedRole.length == 0){
              alert(that.$t("app.message.msg0059"));
              that.confirmLoading = false;
              return;
            }
            formData.selectedroles = this.selectedRole.length>0?this.selectedRole.join(","):'';
            formData.selecteddeparts = this.userDepartModel.departIdList.length>0?this.userDepartModel.departIdList.join(","):'';
            formData.identity=this.identity;
            //如果是上级择传入departIds,否则为空
            if(this.identity==="2"){
              formData.departIds=this.departIds.join(",");
            }else{
              formData.departIds="";
            }
            // that.addDepartsToUser(that,formData); // 调用根据当前用户添加部门信息的方法
            let obj;
            if(!this.model.id){
              formData.id = this.userId;
              obj=addUser(formData);
            }else{
              obj=editUser(formData);
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
              that.checkedDepartNames = [];
              that.userDepartModel.departIdList = {userId:'',departIdList:[]};
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateToNextPassword  (rule, value, callback) {
        const form = this.form;
        const confirmpassword=form.getFieldValue('confirmpassword');

        if (value && confirmpassword && value !== confirmpassword) {
          callback(this.$t('app.message.msg0027'));
        }
        if (value && this.confirmDirty) {
          form.validateFields(['confirm'], { force: true })
        }
        callback();
      },
      compareToFirstPassword  (rule, value, callback) {
        const form = this.form;
        if (value && value !== form.getFieldValue('password')) {
          callback(this.$t('app.message.msg0027'));
        } else {
          callback()
        }
      },
      // validatePhone(rule, value, callback){
      //   if(!value){
      //     callback()
      //   }else{
      //     //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
      //     if(new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)){
      //       //update-end--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------

      //       var params = {
      //         tableName: 'sys_user',
      //         fieldName: 'phone',
      //         fieldVal: value,
      //         dataId: this.userId
      //       };
      //       duplicateCheck(params).then((res) => {
      //         if (res.success) {
      //           callback()
      //         } else {
      //           callback(getMsgInfo(this,'msg0028','phoneNumber'))
      //         }
      //       })
      //     }else{
      //       callback(getMsgInfo(this,' msg0029','phoneNumber'));
      //     }
      //   }
      // },
      // validateEmail(rule, value, callback){
      //   if(!value){
      //     callback()
      //   }else{
      //     if(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)){
      //       var params = {
      //         tableName: 'sys_user',
      //         fieldName: 'email',
      //         fieldVal: value,
      //         dataId: this.userId
      //       };
      //       duplicateCheck(params).then((res) => {
      //         console.log(res)
      //         if (res.success) {
      //           callback()
      //         } else {
      //           callback(getMsgInfo(this,'msg0028','email'))
      //         }
      //       })
      //     }else{
      //       callback(getMsgInfo(this,' msg0029','email'))
      //     }
      //   }
      // },
      validateUsername(rule, value, callback){
        var params = {
          tableName: 'sys_user',
          fieldName: 'username',
          fieldVal: value,
          dataId: this.userId
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
          callback()
        } else {
          callback(getMsgInfo(this,'msg0028','userAgentName'))
        }
      })
      },
      handleConfirmBlur  (e) {
        const value = e.target.value;
        this.confirmDirty = this.confirmDirty || !!value
      },

      normFile  (e) {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e
        }
        return e && e.fileList
      },
      beforeUpload: function(file){
        var fileType = file.type;
        if(fileType.indexOf('image')<0){
          this.$message.warning(this.$t('app.message.msg0030'));
          return false;
        }
        //TODO 验证文件大小
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
          console.log(response);
          if(response.success){
            this.model.avatar = response.message;
            this.picUrl = "Has no pic url yet";
          }else{
            this.$message.warning(response.message);
          }
        }
      },
      // 搜索用户对应的部门API
      onSearch(){
        this.$refs.departWindow.add(this.checkedDepartKeys,this.userId);
      },
      // 获取用户对应部门弹出框提交给返回的数据
      modalFormOk (formData) {
        this.checkedDepartNames = [];
        this.selectedDepartKeys = [];
        this.checkedDepartNameString = '';
        this.userId = formData.userId;
        this.userDepartModel.userId = formData.userId;
        this.departIds=[];
        this.resultDepartOptions=[];
        var depart=[];
        for (let i = 0; i < formData.departIdList.length; i++) {
          this.selectedDepartKeys.push(formData.departIdList[i].key);
          this.checkedDepartNames.push(formData.departIdList[i].title);
          this.checkedDepartNameString = this.checkedDepartNames.join(",");
          //新增部门选择，如果上面部门选择后不为空直接付给负责部门
          depart.push({
              key:formData.departIdList[i].key,
              title:formData.departIdList[i].title
          })
          this.departIds.push(formData.departIdList[i].key)
        }
        this.resultDepartOptions=depart;
        this.userDepartModel.departIdList = this.selectedDepartKeys;
        this.checkedDepartKeys = this.selectedDepartKeys  //更新当前的选择keys
       },

      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 300){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 450;
        }
      },
      identityChange(e){
        if(e.target.value==="1"){
            this.departIdShow=false;
        }else{
            this.departIdShow=true;
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader > .ant-upload {
    width:104px;
    height:104px;
  }
  .ant-upload-select-picture-card i {
    font-size: 49px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .ant-table-tbody .ant-table-row td{
    padding-top:10px;
    padding-bottom:10px;
  }

</style>