<!--
*   
*   ページ： 【MST-FTM01D01】運賃種別マスタ保守画面　新規画面
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
                    <a-form-item :label="$t('app.MstFtm01D01.10001')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                           <a-select v-decorator="['blcarriercd',validatorRules.blcarriercd]" placeholder="---" style="width: 150px" @click="handleButtonClick"  :disabled="disabledFlg" >
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

                    <!-- 運賃種別 -->
                    <a-form-item :label="$t('app.MstFtm01D01.10002')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-input v-decorator="['goodscode',validatorRules.goodscode]" style="width:150px"   :disabled="disabledFlg" />
                    </a-form-item>

                      <!-- 運賃種別名 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstFtm01D01.10003')">
                        <a-input v-decorator="['goodsnm',validatorRules.goodsnm]" style=""   />
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
        name: "MstFtm01D03",
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
            goodsnm: "",
            goodscode:"",
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
                      blcarriercd: { rules: [{ required: true, message: this.$t('app.MstFtm01D01.10004')}]},
                
                      goodscode:{ rules: [{ required: true, message: this.$t('app.MstFtm01D01.10006')}
                        , {pattern: '^[0-9]{2}$', message: this.$t('app.MstFtm01D01.10005')}]},

                      goodsnm: { rules: [{pattern: '^[\uFF00-\uFFFF+一-龠+ぁ-ん+ァ-ヴー]{0,10}$', message: this.$t('app.MstFtm01D01.10007')}]},
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
                    this.$nextTick(() => {
                        this.model.blcarriercd = record.blcarriercd;
                        this.model.goodsnm = record.goodsnm;
                        this.model.goodscode = record.goodscode;
                       

                        this.form.setFieldsValue(pick(this.model, 'blcarriercd'))
                        this.form.setFieldsValue(pick(this.model, 'goodscode'))
                        this.form.setFieldsValue(pick(this.model, 'goodsnm'))
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

