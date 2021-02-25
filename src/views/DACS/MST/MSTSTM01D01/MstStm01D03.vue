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
                    <!-- 店コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstStm01D01.10003')">
                        <a-input v-decorator="['storecd',validatorRules.storecd]" style="width:150px" :disabled="disabledFlg" />
                    </a-form-item>
                    <br />

                    <!-- 店名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstStm01D01.10004')" >
                        <a-input v-decorator="['storenm',validatorRules.storenm]" style="width:150px" />
                    </a-form-item>

                    <!-- 地帯コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstStm01D01.10009')">
                        <a-select v-decorator="['area',validatorRules.area]" style="width: 150px" @click="handleButtonClick">
                                
                            <a-select-option value="北九州">
                                北九州
                            </a-select-option>
                            <a-select-option value="南九州">
                                南九州
                            </a-select-option>
                            <a-select-option value="関東">
                                関東
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <!-- 都道府県コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstStm01D01.10010')">
                        <a-select v-decorator="['prefectures',validatorRules.prefectures]" style="width: 150px" @click="handleButtonClick">
                                
                            <a-select-option value="福岡県">
                                福岡県
                            </a-select-option>
                            <a-select-option value="東京都">
                                東京都
                            </a-select-option>
                            <a-select-option value="神奈川県">
                                神奈川県
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <!-- 計上店コード-->
                    <a-form-item :label="$t('app.MstStm01D01.10007')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-decorator="['accountstorecd',validatorRules.accountstorecd]" style="width:150px" />
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
        name: "MstStm01D03",
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
            storecd: "",
            storenm: "",
            area: "",
            prefectures: "",
            accountstorecd: "",
            accountstorenm: "",
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
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
                    storecd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstStm01D01.10003')})}
                        , {pattern: '^[0-9]{1,6}$', message: this.$t('app.MstStm01D01.10012')}]},
                    storenm: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstStm01D01.10004')})}
                        , {pattern: '^\.{1,40}$', message: this.$t('app.MstStm01D01.10013')}]},
                    area: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstStm01D01.10005')})}]},
                    prefectures: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstStm01D01.10006')})}]},
                    accountstorecd: { rules: [{pattern: '^[0-9]{1,6}$', message: this.$t('app.MstStm01D01.10012')}]},

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
                    this.$nextTick(() => {
                        this.disabledFlg = true;
                        this.model.storecd = record.storecd;
                        this.model.storenm = record.storenm;
                        this.model.area = record.area;
                        this.model.prefectures = record.prefectures;
                        this.model.accountstorecd = record.accountstorecd;
                        this.form.setFieldsValue(pick(this.model, 'storecd'))
                        this.form.setFieldsValue(pick(this.model, 'storenm'))
                        this.form.setFieldsValue(pick(this.model, 'area'))
                        this.form.setFieldsValue(pick(this.model, 'prefectures'))
                        this.form.setFieldsValue(pick(this.model, 'accountstorecd'))
                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.storecd = "";
                this.storenm = "";
                this.area = "";
                this.prefectures = "";
                this.accountstorecd = "";
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

