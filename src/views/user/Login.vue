<template>
  <div class="main">
    <a-card :bordered="false">
      <div class="top">
        <div class="header">
          <a href="/">
            <img src="~@/assets/logo-top.png" class="logo" alt="logo">
          </a>
        </div>
        <div class="pj-title">
          国内航空貨物システム（DACS）
        </div>
        <div class="desc">

        </div>
      </div>
      <a-form :form="form" class="user-layout-login" ref="formLogin" id="formLogin">
          <a-form-item>
            <a-input
              size="large"
              v-decorator="['username',validatorRules.username,{ validator: this.handleUsernameOrEmail }]"
              type="text"
              :placeholder="$t('app.Login.10000')">
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

          <a-form-item style="margin-top:8px">
            <a-input
              v-decorator="['password',validatorRules.password]"
              size="large"
              type="password"
              autocomplete="false"
              :placeholder="$t('app.Login.10001')">
              <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn">{{$t('app.common.login')}}
        </a-button>
      </a-form-item>
      
    </a-form>
    <project-search ref="ProjectSearch"></project-search>
    </a-card>
  </div>
</template>

<script>
  //import md5 from "md5"
  import api from '@/api'
  // import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
  import { mapActions } from "vuex"
  import { timeFix } from "@/utils/util"
  import Vue from 'vue'
  import { ACCESS_TOKEN ,ENCRYPTED_STRING} from "@/store/mutation-types"
  // import JGraphicCode from '@/components/jeecg/JGraphicCode'
  import { putAction,postAction,getAction } from '@/api/manage'
  import { encryption , getEncryptedString } from '@/utils/encryption/aesEncrypt'
  import store from '@/store/'
  import { USER_INFO } from "@/store/mutation-types"
  import ProjectSearch from './PopUp'

  export default {
    components: {
      // TwoStepCaptcha,
      // JGraphicCode
      ProjectSearch
    },
    data () {
      return {
        customActiveKey: "tab1",
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        form: this.$form.createForm(this),
        encryptedString:{
          key:"",
          iv:"",
        },
        state: {
          time: 60,
          smsSendBtn: false,
        },
        validatorRules:{
          username:{rules: [{ required: true, message: this.$t('app.Login.10003')},{validator: this.handleUsernameOrEmail}]},
          password:{rules: [{ required: true, message: this.$t('app.Login.10004'),validator: 'click'}]},
          mobile:{rules: [{validator:this.validateMobile}]},
          captcha:{rule: [{ required: true, message: this.$t('app.Login.10005')}]},
          inputCode:{rules: [{ required: true, message: this.$t('app.Login.10005')}]}
        },
        verifiedCode:"",
        inputCodeContent:"",
        inputCodeNull:true,

        departList:[],
        departVisible:false,
        departSelected:"",
        currentUsername:"",
        validate_status:"",
        currdatetime:'',
        randCodeImage:'',
        requestCodeSuccess:false
      }
    },
    created () {
      this.currdatetime = new Date().getTime();
      Vue.ls.remove(ACCESS_TOKEN)
      // this.getRouterData();
      // this.handleChangeCheckCode();
      // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
      //this.getEncrypte();
      // update-end- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
    },
    methods: {
      ...mapActions([ "Login", "Logout","PhoneLogin" ]),
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      inputCodeChange(e){
        this.inputCodeContent = e.target.value
      },
      handleChangeCheckCode(){
        this.currdatetime = new Date().getTime();
        getAction(`/sys/randomImage/${this.currdatetime}`).then(res=>{
          if(res.success){
            this.randCodeImage = res.result
            this.requestCodeSuccess=true
          }else{
            this.$message.error(res.message)
            this.requestCodeSuccess=false
          }
        }).catch(()=>{
          this.requestCodeSuccess=false
        })
      },
      handleSubmit () {
        let that = this
        let loginParams = {};
        that.loginBtn = true;
        // 使用账户密码登陆
        that.form.validateFields([ 'username', 'password','inputCode', 'rememberMe' ], { force: true }, (err, values) => {
          if (!err) {
            loginParams.username = values.username
            // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
            //loginParams.password = md5(values.password)
            //loginParams.password = encryption(values.password,that.encryptedString.key,that.encryptedString.iv)
            loginParams.password = values.password
            loginParams.remember_me = values.rememberMe
            // update-begin- --- author:scott ------ date:20190805 ---- for:密码加密逻辑暂时注释掉，有点问题
            loginParams.captcha = that.inputCodeContent
            loginParams.checkKey = that.currdatetime
            console.log("登录参数",loginParams)
            that.Login(loginParams).then((res) => {
              this.departConfirm(res);
            }).catch((err) => {
              that.requestFailed(err);
            });


          }else {
            that.loginBtn = false;
          }
          // this.departConfirm({
          //   success:true, 
          //   result:{
          //     multi_depart:2
          //   }
          // });

        });
      },
      departChange(){

      },
      departOk(){
        this.loginSuccess();
      },
      departConfirm(res){
        console.log("部门参数",res.result)
        if(res.success){
          let multi_depart = res.result.multi_depart
          //0:无部门 1:一个部门 2:多个部门
          if(multi_depart==0){
            this.loginSuccess()
            // this.$notification.warn({
            //   message: this.$t('app.common.prompt'),
            //   description: this.$t('app.message.msg0013'),
            //   duration:3
            // });
          }else if(multi_depart==2){
            this.departVisible=true
            this.currentUsername=this.form.getFieldValue("username")
            this.departList = res.result.departs
          }else {
            this.departList = res.result.departs
            this.loginSuccess()
          }
        }else{
          this.requestFailed(res)
          this.Logout();
        }
      },
     
      loginSuccess () {
        this.loginBtn = false
        this.$refs.ProjectSearch.show()
      },
     
      requestFailed (err) {
        this.$notification[ 'error' ]({
          message: this.$t('app.message.msg0016'),
          description: ((err.response || {}).data || {}).message || err.message || this.$t('app.message.msg0017'),
          duration: 4,
        });
        this.loginBtn = false;
      },
    }
  }
</script>

<style lang="less" scoped>

  .user-layout-login {
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
.top {
        text-align: center;

        .header {
          height: 60px;
          line-height: 60px;
          margin-bottom: 30px;
          .badge {
            position: absolute;
            display: inline-block;
            line-height: 1;
            vertical-align: middle;
            margin-left: -12px;
            margin-top: -10px;
            opacity: 0.8;
          }

          .logo {
            height: 60px;
            vertical-align: top;
            margin-right: 16px;
            border-style: none;
          }

          .title {
            font-size: 23px;
            color: rgba(0, 0, 0, .85);
            font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            font-weight: 600;
            position: relative;
            top: 2px;
          }
        }
        .desc {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.45);
          margin-top: 12px;
          margin-bottom: 20px;
        }
        .pj-title {
          margin-bottom: 15px;
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }
      }
</style>

<style>
  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }
  
</style>

<style>
  .loginCard .ant-card-head {
      color: aliceblue !important;
      background-color: #417bb0 !important;
    }
</style>