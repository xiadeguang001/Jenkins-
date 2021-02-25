<!--
*   
*   页面： 「キャリアマスタ保守」明細入力画面
*   描述： 用于新增编辑「キャリアマスタ保守」
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
                    <a-form-item :label="$t('app.MstCap01D01.10003')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['carriercd', validatorRules.carriercd]"
                            style="width: 160px" 
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
                    
                    <!-- 発空港 -->
                    <a-form-item :label="$t('app.MstCap01D01.10004')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['departairportcd', validatorRules.departairportcd]"
                            style="width: 160px" 
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
                    <!-- 着空港 -->
                    <a-form-item :label="$t('app.MstCap01D01.10005')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['arrivalairportcd', validatorRules.arrivalairportcd]"
                            style="width: 160px" 
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

                    <!-- 第1フライトNo -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :help="flightHelp"
                    :validateStatus="flightValidateStatus"
                    :required="true"
                    :label="$t('app.MstCap01D01.10006')">
                        <a-input v-model="firstflightnofrom"
                         style="width:160px" 
                         @change="flightChange" 
                         :disabled="disabledFlg" />
                        <span style="margin-top: 18px;margin-left: 15px;">{{$t('app.MstCap01D01.10014')}}</span>
                        <a-input  v-model="firstflightnoto" 
                        @change="flightChange" 
                        style="margin-left:15px;width:160px" 
                        :disabled="disabledFlg" />
                    </a-form-item>
                   
                    <!-- 品目 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.MstCap01D01.10007')">
                    <div v-decorator="['hinmkcd', validatorRules.hinmkcd]" style="width:160px"> 
                        <a-input type="primary" style="width:160px" v-model="hinmkcd" placeholder="5B" :disabled="disabledFlg" />
                    </div>
                    </a-form-item>
                    <!-- 特殊 -->
                    <a-form-item :label="$t('app.MstCap01D01.10008')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['special', validatorRules.special]"
                            style="width: 160px" 
                            :disabled="disabledFlg"
                            @click="handleButtonClick">
                                <a-select-option value="特殊1">
                                    特殊1
                                </a-select-option>
                                <a-select-option value="特殊2">
                                    特殊2
                                </a-select-option>
                                <a-select-option value="特殊3">
                                    特殊3
                                </a-select-option>
                                <a-select-option value="特殊4">
                                    特殊4
                                </a-select-option>
                                <a-select-option value="特殊5">
                                    特殊5
                                </a-select-option>
                            </a-select>
                    </a-form-item>

                    <!-- 適用開始日 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.MstCap01D01.10009')">
                        <a-date-picker
                            style="width: 160px"
                            :disabled="disabledFlg"
                            v-decorator="['startdate',validatorRules.startdate]" />
                    </a-form-item>
                    <br />

                    <!-- 区分 -->
                    <a-form-item :label="$t('app.MstCap01D01.10010')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['division', validatorRules.division]"
                            style="width: 160px" 
                            @click="handleButtonClick">
                                
                                <a-select-option value="単価">
                                    単価
                                </a-select-option>
                                <a-select-option value="総額">
                                    総額
                                </a-select-option>
                            </a-select>
                    </a-form-item>

                    <!-- 重量帯1 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :help="weight1Help"
                    :validateStatus="weight1ValidateStatus"
                    :label="$t('app.MstCap01D01.10011')">
                        <a-input v-model="weight1a"
                         style="width:160px" 
                         @change="weight1Change" />
                        <span style="margin-left:15px;">{{$t('app.MstCap01D01.10048')}}</span>
                        <a-input  v-model="weight1b" 
                        @change="weight1Change" 
                        style="margin-left:15px;width:160px"/>
                    </a-form-item>

                    <!-- 重量帯2 -->
                    <a-form-item
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"
                        :help="weight2Help"
                        :validateStatus="weight2ValidateStatus"
                        :label="$t('app.MstCap01D01.10012')">
                        <a-input v-model="weight2a"
                            style="width:160px" 
                            @change="weight2Change"  />
                        <span style="margin-left:15px">{{$t('app.MstCap01D01.10048')}}</span>
                        <a-input  v-model="weight2b" 
                            @change="weight2Change" 
                            style="margin-left:15px;width:160px" />
                    </a-form-item>

                    <!-- 重量帯1 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :help="weight3Help"
                    :validateStatus="weight3ValidateStatus"
                    :label="$t('app.MstCap01D01.10013')">
                        <a-input v-model="weight3a"
                         style="width:160px" 
                         @change="weight3Change" />
                        <span style="margin-left:15px">{{$t('app.MstCap01D01.10048')}}</span>
                        <a-input  v-model="weight3b" 
                        @change="weight3Change" 
                        style="margin-left:15px;width:160px"  />
                    </a-form-item>

                    <!-- 備考 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.MstCap01D01.10030')">
                        <a-input type="text"  v-model="note"  />
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

    import pick from 'lodash.pick'
      import moment from 'moment' 

    export default {
        name: "MstCap01D02",
        components: {
        
        },
        data () {
            return {
                drawerWidth:700,
                title:this.$t('app.common.search'),
                addTitle: this.$t('app.common.add'),
                editTitle: this.$t('app.common.edit'),
                visible: false,
                disableSubmit:false,
                disabledFlg:false,
                model: {},
                firstflightnofrom:"",
                firstflightnoto:"",
                hinmkcd:"",
                startdate:"",
                division:"",
                weight1a:"",
                weight1b:"",
                weight2a:"",
                weight2b:"",
                weight3a:"",
                weight3b:"",
                note:"",
                departairportcd:"",
                carriercd:"",
                arrivalairportcd:"",
                special: "", 
                division: "",
                flightHelp:"",
                flightValidateStatus:"",
                weight1Help:"",
                weight1ValidateStatus:"",
                weight2Help:"",
                weight2ValidateStatus:"",
                weight3Help:"",
                weight3ValidateStatus:"",
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
                    carriercd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10003')})}]},
                    departairportcd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10004')}) }]},
                    arrivalairportcd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10005')}) }]},
                    hinmkcd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10007')})}
                        , {pattern: '^[a-zA-Z0-9]{0,3}$', message: this.$t("app.MstCap01D01.10039")}]},
                    special: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10008') })}]},
                    startdate: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10009') })}]},
                    division: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10010') })}]},
                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                // 默认值
                this.disabledFlg = false;
                this.hinmkcd = "";
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                this.flightHelp = "";
                this.flightValidateStatus = "";
                this.weight1Help = "";
                this.weight1ValidateStatus = "";
                this.weight2Help = "";
                this.weight2ValidateStatus = "";
                this.weight3Help = "";
                this.weight3ValidateStatus = "";
                this.firstflightnofrom = "";
                this.firstflightnoto = "";
                this.weight1a = "";
                this.weight1b = "";
                this.weight2a = "";
                this.weight2b = "";
                this.weight3a = "";
                this.weight3b = "";
                console.log(record);
                if (record.status != '1') {
                    console.log(1);
                    this.disabledFlg = true;
                    this.hinmkcd = record.hinmkcd;
                    this.firstflightnofrom = record.firstflightnofrom;
                    this.firstflightnoto = record.firstflightnoto;
                    this.weight1a = record.weight1a;
                    this.weight1b = record.weight1b;
                    this.weight2a = record.weight2a;
                    this.weight2b = record.weight2b;
                    this.weight3a = record.weight3a;
                    this.weight3b = record.weight3b;
                    this.$nextTick(() => {
                    this.model.carriercd = record.carriercd;
                    this.model.departairportcd = record.departairportcd;
                    this.model.arrivalairportcd = record.arrivalairportcd;
                    this.model.special = record.special;
                    this.model.division = record.division;
                    this.model.startdate = record.startdate ? moment(record.startdate,"YYYY-MM-DD") : moment("2021-1-1","YYYY-MM-DD");
                    this.model.communicationcost = record.communicationcost;

                    this.form.setFieldsValue(pick(this.model, 'carriercd'))
                    this.form.setFieldsValue(pick(this.model, 'departairportcd'))
                    this.form.setFieldsValue(pick(this.model, 'arrivalairportcd'))
                    this.form.setFieldsValue(pick(this.model, 'special'))
                    this.form.setFieldsValue(pick(this.model, 'division'))
                    this.form.setFieldsValue(pick(this.model, 'communicationcost'))

                    })
                }
            },
            close () {
                this.$emit('close');
                this.carriercd = "";

                this.disableSubmit = false;

                this.visible = false;
            },
            handleOk () {
                const that = this;

                this.flightChange();
                this.weight1Change();
                this.weight2Change();
                this.weight3Change();
                this.form.validateFields((err, values) => {
                    if(!err && this.flightHelp == "" && this.weight1Help == ""
                        && this.weight2Help == "" && this.weight3Help == ""){
                        this.close();
                    }
                });

            },
            handleCancel () {
                this.close();
            },
            // 根据屏幕变化,设置抽屉尺寸
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

            // ボタンを押下
            handleButtonClick(){
            },
            flightChange(){
                if (this.firstflightnofrom == "") {
                    this.flightHelp = this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10031')});
                    this.flightValidateStatus = "error";
                } else if (!/^[0-9]*$/.test(this.firstflightnofrom)){
                    this.flightHelp = this.$t("app.MstCap01D01.10035");
                    this.flightValidateStatus = "error";
                } else if (this.firstflightnoto == ""){
                    this.flightHelp = this.$t('app.message.msg0001',{'0': this.$t('app.MstCap01D01.10032')});
                    this.flightValidateStatus = "error";
                } else if (!/^[0-9]*$/.test(this.firstflightnoto)){
                    this.flightHelp = this.$t("app.MstCap01D01.10037");
                    this.flightValidateStatus = "error";
                }else{
                    this.flightHelp = "";
                    this.flightValidateStatus = "";
                }
            },
            weight1Change(){
                if (!/^[0-9]{0,5}$/.test(this.weight1a)){
                    this.weight1Help = this.$t('app.MstCap01D01.10043');
                    this.weight1ValidateStatus = "error";
                } else if (!/^[0-9]{0,8}(\.[0-9])?$/.test(this.weight1b)){
                    this.weight1Help = this.$t('app.MstCap01D01.10044');
                    this.weight1ValidateStatus = "error";
                }else{
                    this.weight1Help = "";
                    this.weight1ValidateStatus = "";
                }
            },
            weight2Change(){
                if (!/^[0-9]{0,5}$/.test(this.weight2a)){
                    this.weight2Help = this.$t('app.MstCap01D01.10045');
                    this.weight2ValidateStatus = "error";
                } else if (!/^[0-9]{0,8}(\.[0-9])?$/.test(this.weight2b)){
                    this.weight2Help = this.$t('app.MstCap01D01.10044');
                    this.weight2ValidateStatus = "error";
                }else{
                    this.weight2Help = "";
                    this.weight2ValidateStatus = "";
                }
            },
            weight3Change(){
                if (!/^[0-9]{0,5}$/.test(this.weight3a)){
                    this.weight3Help = this.$t('app.MstCap01D01.10046');
                    this.weight3ValidateStatus = "error";
                } else if (!/^[0-9]{0,8}(\.[0-9])?$/.test(this.weight3b)){
                    this.weight3Help = this.$t('app.MstCap01D01.10044');
                    this.weight3ValidateStatus = "error";
                }else{
                    this.weight3Help = "";
                    this.weight3ValidateStatus = "";
                }
            },

        }
    }


</script>

