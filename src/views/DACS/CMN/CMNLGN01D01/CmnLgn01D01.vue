<!--
*   
*   ページ： パスワード変更
*   説明： 入力画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.CmnLgn01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.CmnLgn01D01.10001')}}</p>

        <a-card :bordered="false">
            <div :style="{padding: '10px 16px',background: '#fff',}">
                <a-spin :spinning="confirmLoading">
                        <!-- 現在のパスワード -->
                    <a-form :form="form" class="standard-form">
                        <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        :label="$t('app.CmnLgn01D01.10002')">
                        <a-input type="password" :placeholder="$t('app.message.msg0001',{'0': $t('app.label.user.loginPassword')})" v-decorator="[ 'oldpassword', validatorRules.oldpassword]" />
                        </a-form-item>
                        <!-- 新しいパスワード -->
                        <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        :label="$t('app.CmnLgn01D01.10003')">
                        <a-input type="password" :placeholder="$t('app.message.msg0001',{'0': $t('app.label.user.newPassword')})" v-decorator="[ 'password', validatorRules.password]" />
                        </a-form-item>
                        <!-- 新しいパスワード（再入力） -->
                        <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        :label="$t('app.CmnLgn01D01.10004')">
                        <a-input type="password" @blur="handleConfirmBlur" :placeholder="$t('app.message.msg0001',{'0': $t('app.label.user.confirmPassword')})" v-decorator="[ 'confirmPassword', validatorRules.confirmpassword]"/>
                        </a-form-item>

                    </a-form>
                    
                </a-spin>
                            <div>
                                &nbsp;&nbsp;
                            </div>

                        <div class="fill-drawer-bottom"></div>
                            <div style="z-index:999 " class="drawer-bootom-button">
                                <a-button
                                    type="primary"
                                    @click="handleOk">
                                    {{  this.$t('app.CmnLgn01D01.10008') }}
                                </a-button>
                            </div>
            </div>
        </a-card>




    </div>
</template>

<script>
import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'


    export default {
        name: "BlmDdc01D01",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                disableSubmit:false,
                fileList: [],
                oldpassword:"",
                password:"",
                confirmpassword:"",
                queryParam: {
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4},
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                confirmLoading: false,
                recycleBinVisible: false,
                columns: [],
                url: {
                    list: "",
                },
                dataSource1:[],

                validatorRules:{
                oldpassword:{
                    rules: [{
                    required: true, message: '古いパスワードを入力してください',
                    }],
                },
                password:{
                    rules: [{
                    required: true, message: '新しいパスワードを入力してください',
                    }, {
                    validator: this.validateToNextPassword,
                    }],
                },
                confirmpassword:{
                    rules: [{
                    required: true, message: '新しいパスワードを確認してください',
                    }, {
                    validator: this.compareToFirstPassword,
                    }],
                }
              },

        }
        },
        computed: {
        },
        methods: {
        show(uname){
            if(!uname){
            this.$message.warning("現在のシステムにログインしているユーザーはいません");
            return
            }else{
            this.username = uname
            this.form.resetFields();
            this.visible = true;
            }
        },
        handleCancel () {
            this.close()
        },
        close () {
            this.$emit('close');
            this.visible = false;
            this.disableSubmit = false;
            this.selectedRole = [];
        },
        handleOk () {
            const that = this;
            // 触发表单验证
            this.form.validateFields((err, values) => {
            if (!err) {
                that.confirmLoading = true;
                let params = Object.assign({username:this.username},values)
                console.log("修改密码提交数据",params)
                putAction(this.url,params).then((res)=>{
                if(res.success){
                    console.log(res)
                    that.$message.success(res.message);
                    that.close();
                }else{
                    that.$message.warning(res.message);
                }
                }).finally(() => {
                that.confirmLoading = false;
                })
            }
            })
        },
        validateToNextPassword  (rule, value, callback) {
            const form = this.form;
            if (value && this.confirmDirty) {
            form.validateFields(['confirm'], { force: true })
            }
            callback();
        },
        compareToFirstPassword  (rule, value, callback) {
            const form = this.form;
            if (value && value !== form.getFieldValue('password')) {
            callback('2つのパスワード入力は一致しません');
            } else {
            callback()
            }
        },
        handleConfirmBlur  (e) {
            const value = e.target.value
            this.confirmDirty = this.confirmDirty || !!value
        }

    }
}

 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>