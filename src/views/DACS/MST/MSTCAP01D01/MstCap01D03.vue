<!--
*   
*   ページ： エージェントを探すview
*   説明： キャリアと発行店によって、代理店の情報を検索する
*
-->

<template>
    <a-drawer
        :title="title"
        :width="drawerWidth"
        :maskClosable="true"
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
                            <a-select v-model="carriercd" style="width: 160px" @click="handleButtonClick">
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
                            <a-select v-model="departairportcd" style="width: 160px" @click="handleButtonClick">
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
                            <a-select v-model="arrivalairportcd" style="width: 160px" @click="handleButtonClick">
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
                    :label="$t('app.MstCap01D01.10006')">
                        <a-input v-model="firstflightnofrom"
                         style="width:160px" 
                         @change="flightChange" />
                        <span style="margin-top: 18px;margin-left: 15px;">{{$t('app.MstCap01D01.10014')}}</span>
                        <a-input  v-model="firstflightnoto" 
                        @change="flightChange" 
                        style="margin-left:15px;width:160px"  />
                    </a-form-item>

                    <!-- 品目 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.MstCap01D01.10007')">
                    <div v-decorator="['hinmkcd', validatorRules.hinmkcd]" style="width:160px"> 
                        <a-input type="primary" style="width:160px" v-model="hinmkcd" placeholder="5B" />
                    </div>
                    </a-form-item>

                    <!-- 特殊 -->
                    <a-form-item :label="$t('app.MstCap01D01.10008')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select v-model="special" style="width: 160px" @click="handleButtonClick">
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
                            style="width: 160px" />
                    </a-form-item>

                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="resetClick" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="search">{{this.$t('app.common.search')}}</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    import pick from 'lodash.pick'
    export default {
        name: "MstCap01D03",
        components: {
                
        },
        data () {
            return {
                drawerWidth: 600,
                title:this.$t('app.common.search'),
                addTitle: this.$t('app.common.add'),
                editTitle: this.$t('app.common.edit'),
                visible: false,
                disableSubmit:false,
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
                flightHelp:"",
                flightValidateStatus:"",
                note:"",
                departairportcd:"",
                carriercd:"",
                arrivalairportcd:"",
                special: "",  
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
                   
                    hinmkcd: { rules: [{pattern: '^[a-zA-Z0-9]{0,3}$', message: this.$t("app.MstCap01D01.10039")}]},
                }
            }
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                console.log(record);
                this.flightHelp = "";
                this.flightValidateStatus = "";

                this.$nextTick(() => {
                    this.model.firstflightnofrom = record.firstflightnofrom;
                    this.model.firstflightnoto = record.firstflightnoto;

                    this.form.setFieldsValue(pick(this.model, 'firstflightnofrom'))
                    this.form.setFieldsValue(pick(this.model, 'firstflightnoto'))

                })
            },
            close () {
                this.visible = false;

            },
            handleOk () {
                this.$emit('ok', this.model);
                this.flightChange();
                this.form.validateFields((err, values) => {
                    if(!err && this.flightHelp == ""){
                        this.close();
                    }
                });
            },
            handleCancel () {
                this.close();
            },
            handleButtonClick () {

            },
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 400){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 600;
                }
            },

            resetClick(){
                // this.carriercd = "";
            },
            flightChange(){
                if (!/^[0-9]*$/.test(this.firstflightnofrom)){
                    this.flightHelp = this.$t("app.MstCap01D01.10035");
                    this.flightValidateStatus = "error";
                } else if (!/^[0-9]*$/.test(this.firstflightnoto)){
                    this.flightHelp = this.$t("app.MstCap01D01.10037");
                    this.flightValidateStatus = "error";
                }else{
                    this.flightHelp = "";
                    this.flightValidateStatus = "";
                }
            },
        }
    }
</script>