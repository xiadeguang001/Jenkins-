<!--
*   
*   ページ： 【MST-STM01D01】店マスタ保守画面　編集画面
*   説明： 店舗データの追加と編集に使用
*
-->

<template>
    <a-drawer
        :title="title"
        :width="drawerWidth"
        :maskClosable="false"
        @close="handleCancel"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">

        <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    <!-- 担当者コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstPcm01D01.10003')">
                        <a-input v-decorator="['chargepersoncd',validatorRules.chargepersoncd]" style="width:150px" :disabled="disabledFlg" />
                    </a-form-item>
                    <br />

                    <!-- 担当者名 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstPcm01D01.10004')" >
                        <a-input v-decorator="['chargepersonnm',validatorRules.chargepersonnm]" style="width:150px" />
                    </a-form-item>

                    <!-- パスワード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstPcm01D01.10005')">
                        <a-input v-decorator="['password',validatorRules.password]" style="width:150px" />
                    </a-form-item>

                    <!-- 権限コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstPcm01D01.10006')">
                        <a-input v-decorator="['authority',validatorRules.authority]" style="width:150px" />
                    </a-form-item>

                    <!-- 所属店-->
                    <a-form-item :label="$t('app.MstPcm01D01.10008')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-decorator="['affiliationstore',validatorRules.affiliationstore]" style="width:150px" />
                    </a-form-item>

                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-popconfirm :title="$t('app.message.msg0311')" @confirm="handleCancel" :okText="$t('app.common.confirm')" :cancelText="$t('app.common.cancel')">
                <a-button style="margin-right: .8rem" icon="close-square">{{$t('app.common.cancel')}}</a-button>
            </a-popconfirm>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="form">{{$t('app.common.save')}}</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    import { getMsgInfo } from "@/utils/util"
      import moment from 'moment' 
    import pick from 'lodash.pick'

    export default {
        name: "MstPcm01D03",
        components: {
        
        },
        data () {
        return {
            drawerWidth:700,
            title:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            disabledFlg: false,
            model: {},
            chargepersoncd: "",
            chargepersonnm: "",
            password: "",
            prefectures: "",
            affiliationstore: "",
            accountstorenm: "",
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 },
            },

            confirmLoading: false,
            form: this.$form.createForm(this),

            iconChooseVisible: false,
            validateStatus:""
        }
        },
        computed:{
            validatorRules:function() {
                return {
                    chargepersoncd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstPcm01D01.10003')})}
                        , {pattern: '^[0-9]{1,8}$', message: this.$t('app.MstPcm01D01.10012')}]},
                    chargepersonnm: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstPcm01D01.10004')})}
                        , {pattern: '^[\uFF00-\uFFFF+一-龠+ぁ-ん+ァ-ヴー]{0,10}$', message: this.$t('app.MstPcm01D01.10013')}]},
                    password: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstPcm01D01.10005')})}
                        , {pattern: '^[0-9a-zA-Z]{1,8}$', message: this.$t('app.MstPcm01D01.10010')}]},
                    authority: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstPcm01D01.10006')})}
                        , {pattern: '^[0-9]{2}$', message: this.$t('app.MstPcm01D01.10011')}]},
                    affiliationstore: { rules: [{required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstPcm01D01.10008')})}]},

                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                this.disabledFlg = false;
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                
                console.log(record);
                if (record.status != '1') {
                    console.log(1);
                    this.disabledFlg = true;
                    this.$nextTick(() => {
                        this.model.chargepersoncd = record.chargepersoncd;
                        this.model.chargepersonnm = record.chargepersonnm;
                        this.model.password = record.password;
                        this.model.authority = record.authority;
                        this.model.affiliationstore = record.affiliationstore.substr(0,4);
                        this.form.setFieldsValue(pick(this.model, 'chargepersoncd'))
                        this.form.setFieldsValue(pick(this.model, 'chargepersonnm'))
                        this.form.setFieldsValue(pick(this.model, 'password'))
                        this.form.setFieldsValue(pick(this.model, 'authority'))
                        this.form.setFieldsValue(pick(this.model, 'affiliationstore'))
                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.chargepersoncd = "";
                this.chargepersonnm = "";
                this.password = "";
                this.authority = "";
                this.affiliationstore = "";
                this.disableSubmit = false;
                this.visible = false;
            },
            handleOk () {
                const that = this;
                this.form.validateFields((err, values) => {
                    if(!err){
                        this.close();
                    }
                });
            },
            handleCancel () {
                this.close();
            },
            handleButtonClick(){

            },
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 500){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 700;
                }
            },
            initDictConfig() {
            },


        
        }
    }
</script>

