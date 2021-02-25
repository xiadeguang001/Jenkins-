<!--
*   
*   ページ： 【MST-CAM01D01】キャリアマスタ保守画面　編集画面
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
                    <!-- キャリアコード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstCam01D01.10002')">
                        <a-input v-decorator="['carriercd',validatorRules.carriercd]" style="width:160px" :disabled="disabledFlg" />
                    </a-form-item>
                    <br />

                    <!-- 適用開始日 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstCam01D01.10003')" >
                        <a-date-picker
                            style="width: 160px"
                            v-decorator="['startdate',validatorRules.startdate]" />
                    </a-form-item>

                    <!-- キャリア名 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstCam01D01.10004')">
                        <a-input v-decorator="['carriername',validatorRules.carriername]" style="width:160px" />
                    </a-form-item>

                    <!-- キャリア名名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstCam01D01.10005')">
                        <a-input v-decorator="['carriernameall',validatorRules.carriernameall]"   />
                    </a-form-item>

                    <!-- BLキャリア-->
                    <a-form-item :label="$t('app.MstCam01D01.10006')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select v-model="blcarriercd" style="width: 160px" @click="handleButtonClick">
                                
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


                    <!-- 運貸キャリアコード -->
                    <a-form-item :label="$t('app.MstCam01D01.10007')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select v-model="transportcarriercd" style="width: 160px" @click="handleButtonClick">
                                
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

                    <!-- 通信料 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstCam01D01.10008')">
                        <a-input v-decorator="['communicationcost',validatorRules.communicationcost]"  style="width: 160px" />
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
        name: "MstCam01D03",
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
            carriercd:"", 
            blcarriercd:"",
            startdate:"", 
            carriername:"", 
            carriernameall:"", 
            transportcarriercd:"", 
            communicationcost:"", 
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
                    carriercd: { rules: [{ required: true, message: this.$t('app.MstCam01D01.10017')}
                        , {pattern: '^[0-9]{2}$', message: this.$t('app.MstCam01D01.10018')}]},
                    carriername: { rules: [{ required: true, message: this.$t('app.MstCam01D01.10019') }
                        , {pattern: '^[0-9a-zA-Z]{1,3}$', message: this.$t('app.MstCam01D01.10020')}]},
                    carriernameall: { rules: [{pattern: '^[\uFF00-\uFFFF+一-龠+ぁ-ん+ァ-ヴー]{0,20}$', message: this.$t('app.MstCam01D01.10021')}]},
                    communicationcost: { rules: [{ pattern: '^[0-9]{1,4}$', message: this.$t('app.MstCam01D01.10022')}]},

                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                this.disabledFlg = false;
                this.communicationcost = 0;
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
                    this.transportcarriercd =  record.transportcarriercd;
                    this.$nextTick(() => {
                        this.model.carriercd = record.carriercd;
                        this.model.carriername = record.carriername;
                        this.model.carriernameall = record.carriernameall;
                        this.model.startdate = record.startdate ? moment(record.startdate,"YYYY-MM-DD") : moment("2021-1-1","YYYY-MM-DD");
                        this.model.communicationcost = record.communicationcost;

                        this.form.setFieldsValue(pick(this.model, 'carriercd'))
                        this.form.setFieldsValue(pick(this.model, 'carriername'))
                        this.form.setFieldsValue(pick(this.model, 'carriernameall'))
                        this.form.setFieldsValue(pick(this.model, 'startdate'))
                        this.form.setFieldsValue(pick(this.model, 'communicationcost'))

                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.carriercd = "";
                this.startdate = "";
                this.carriername = "";
                this.carriernameall = "";
                this.blcarriercd = "";
                this.transportcarriercd = "";
                this.communicationcost = "";
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

