<!--
*   
*   ページ： 【MST-ITM01D01】品目マスタ保守　新規画面
*   説明： キャリアデータの追加と編集に使用
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
                
                    <!-- BLキャリア-->
                    <a-form-item :label="$t('app.MstItm01D01.10001')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select v-decorator="['blcarriercd',validatorRules.blcarriercd]"  style="width: 150px" :disabled="disabledFlg" @click="handleButtonClick">
                                <a-select-option value="JAL">
                                    JAL
                                </a-select-option>
                                <a-select-option value="ANA">
                                    ANA
                                </a-select-option>
                                <a-select-option value="JTA">
                                    JTA
                                </a-select-option>
                            </a-select>
                    </a-form-item>

                    <!-- 品目コード -->
                    <a-form-item :label="$t('app.MstItm01D01.10002')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-input v-decorator="['goodscode',validatorRules.goodscode]" style="width:150px" :disabled="disabledFlg" />
                    </a-form-item>

                      <!-- 品目名 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstItm01D01.10003')">
                        <a-input v-decorator="['goodsnm',validatorRules.goodsnm]" style="width:150px"  />
                    </a-form-item>

                    <!-- 運賃掛率 -->
                     <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstItm01D01.10004')"
                    hasFeedback >
                        <a-input-number :min="0" max="9999" style="width: 100px;" v-decorator="['freightrate',validatorRules.freightrate]"   @change="changeRate"/> %
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
        name: "MstItm01D03",
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
            disabledFlg:false,
            model: {},
            blcarriercd:"", 
            goodscode:"", 
            goodsnm:"", 
            freightrate: "",
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
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
                      blcarriercd: { rules: [{ required: true, message: this.$t('app.MstItm01D01.10005')}]},
                      goodscode: { rules: [{ required: true, message: this.$t('app.MstItm01D01.10006')},
                             {pattern: '^[0-9]{1,3}$', message: this.$t('app.MstItm01D01.10006')}]},

                      goodsnm: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstItm01D01.10009')})},
                          {pattern: '^\.{1,40}$', message: this.$t('app.MstItm01D01.10007')}]},

                      freightrate: { rules: [{required:true, message: this.$t('app.MstItm01D01.10008')}]}

                }          
                      
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                this.disabledFlg = false;
               // this.communicationcost = 0;
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
                    console.log(record.blcarriercd);
                    this.disabledFlg = true;
                    this.blcarriercd = record.blcarriercd;
                    this.goodscode =  record.goodscode;
                    this.goodsnm = record.goodsnm;
                    this.freightrate = record.freightrate;

                    this.$nextTick(() => {
                        this.model.blcarriercd = record.blcarriercd;
                        this.goodscode =  record.goodscode;
                        this.goodsnm = record.goodsnm;
                        this.freightrate= record.freightrate;
                       

                        this.form.setFieldsValue(pick(this.model, 'blcarriercd'))
                        this.form.setFieldsValue(pick(this.model, 'goodscode'))
                        this.form.setFieldsValue(pick(this.model, 'goodsnm'))
                        this.form.setFieldsValue(pick(this.model, 'freightrate'))
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
            changeRate(value) {
                this.agencyCommisionRate = value;
            },
        }
    }
</script>

