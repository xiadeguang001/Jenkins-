<!--
*   
*   ページ： 【MST-FTA01D01】運賃種別適用マスタ保守画面　編集画面
*   説明： 運賃種別適用マスタ保守（編集画面）
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
                    <!-- キャリア -->
                    <a-form-item :label="$t('app.MstFta01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-select 
                            v-decorator="['carriercd', validatorRules.carriercd]"
                            style="width: 150px" 
                            :disabled="disabledFlg"
                            @click="handleButtonClick">
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
                    <a-form-item :label="$t('app.MstFta01D01.10003')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-select v-decorator="['fareType',validatorRules.fareType]"
                            style="width: 150px" 
                            :disabled="disabledFlg"
                            @click="handleButtonClick"
                        >
                            <a-select-option value="一般">
                                一般
                            </a-select-option>
                            <a-select-option value="特定品目">
                                特定品目
                            </a-select-option>
                            <a-select-option value="品目分類">
                                品目分類
                            </a-select-option>
                            <a-select-option value="引越商品">
                                引越商品
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <!-- 適用開始日 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.MstFta01D01.10004')">
                        <a-date-picker style="width: 150px" v-decorator="['startDate',validatorRules.startDate]" :disabled="disabledFlg"/>
                    </a-form-item>
                    <br />

                    <!-- フライト発時刻 -->
                        <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        :label="this.$t('app.MstFta01D01.10005')">
                            <a-time-picker placeholder="00:00"  style="width:150px" format="HH:mm"
                                v-decorator="['flightDepartureTimeFrom',validatorRules.flightDepartureTimeFrom]" />
                            <span style="margin-left:10px">{{this.$t('app.MstFta01D01.10010')}}</span>
                            <a-time-picker placeholder="00:00" v-model="flightDepartureTimeTo"  format="HH:mm" style="margin-left:10px;width:150px" />
                        </a-form-item>

                    <!-- 重量 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :help="weightHelp"
                    :validateStatus="weightValidateStatus"
                    :required="true"
                    :label="$t('app.MstFta01D01.10006')">
                        <a-input v-model="weightFrom" style="width:150px" @change="weightChange" />
                        <span style="margin-left:2px">{{this.$t('app.MstFta01D01.10008')}}</span>
                        <span style="margin-left:10px">{{this.$t('app.MstFta01D01.10010')}}</span>
                        <a-input  v-model="weightTo" @change="weightChange" style="margin-left:10px;width:150px" />
                        <span style="margin-left:2px">{{this.$t('app.MstFta01D01.10008')}}</span>
                    </a-form-item>

                    <!-- 割引率 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstFta01D01.10007')">
                        <a-input v-decorator="['discountRate',validatorRules.discountRate]" style="width:150px" />
                        <span style="margin-left:2px">{{this.$t('app.MstFta01D01.10009')}}</span>
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
        name: "MstFta01D03",
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
            carriercd: "",
            fareType: "",
            startDate: "",
            flightDepartureTimeFrom: "",
            flightDepartureTimeTo: "",
            weightFrom: "",
            weightTo: "",
            discountRate: "",
            weightHelp:"",
            weightValidateStatus:"",
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
                    carriercd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10002')})}]},
                    fareType: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10003')})}]},
                    startDate: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10004')})}]},
                    flightDepartureTimeFrom: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10011')})}]},
                    discountRate: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10007')})}
                        , {pattern: '^(([-\\+]?([0-9]{1,2}))|100)$', message: this.$t('app.MstFta01D01.10017')}]},

                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                this.flightDepartureTimeTo = null;
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
                    console.log(record.flightDepartureTimeFrom);
                    this.disabledFlg = true;
                    this.weightFrom = record.weightFrom;
                    this.weightTo = record.weightTo;
                    this.flightDepartureTimeTo = record.flightDepartureTimeTo ? moment(record.flightDepartureTimeTo,"HH:mm") : moment("00:00","HH:mm");
                    this.$nextTick(() => {
                        this.model.carriercd = record.carriercd;
                        this.model.fareType = record.fareType;
                        this.model.startDate = record.startDate ? moment(record.startDate,"YYYY-MM-DD") : moment("2021-1-1","YYYY-MM-DD");
                        this.model.flightDepartureTimeFrom = this.model.flightDepartureTimeFrom ? moment(this.model.flightDepartureTimeFrom,"HH:mm") : moment("00:00","HH:mm");
                        this.model.discountRate = record.discountRate;
                        this.form.setFieldsValue(pick(this.model, 'carriercd'))
                        this.form.setFieldsValue(pick(this.model, 'fareType'))
                        this.form.setFieldsValue(pick(this.model, 'startDate'))
                        this.form.setFieldsValue(pick(this.model, 'flightDepartureTimeFrom'))
                        this.form.setFieldsValue(pick(this.model, 'discountRate'))
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
            weightChange(){
                console.log(this.weightFrom)
                if (this.weightFrom == "") {
                    this.weightHelp = this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10013')});
                    this.weightValidateStatus = "error";
                } else if (!/^[0-9]{1,5}$/.test(this.weightFrom)){
                    this.weightHelp = this.$t('app.MstFta01D01.10015');
                    this.weightValidateStatus = "error";
                } else if (this.weightTo == ""){
                    this.weightHelp = this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10014')});
                    this.weightValidateStatus = "error";
                } else if (!/^[0-9]{1,5}$/.test(this.weightTo)){
                    this.weightHelp = this.$t('app.MstFta01D01.10016');
                    this.weightValidateStatus = "error";
                }else{
                    this.weightHelp = "";
                    this.weightValidateStatus = "";
                }
            },

        
        }
    }
</script>

