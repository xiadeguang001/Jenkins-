<!--
*   
*   页面： 「コンテナ履歴」明細入力画面
*   描述： 用于新增编辑「コンテナ履歴」
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

        <div :style="{width: '120%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    <!-- コンテナ -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10000')">
                    <div style="width:150px"> 
                        <a-input type="primary" style="width:150px" :readOnly="true" v-decorator="['container']" />
                    </div>
                    </a-form-item>

                    <!-- フライト日 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10001')">
                    <div style="width:150px"> 
                        <a-input type="primary" style="width:150px" :readOnly="true" v-decorator="['flightday']" />
                    </div>
                    </a-form-item>

                    <br />
                    
                    <!-- 出発 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10002')">
                    </a-form-item>

                    <!-- 出発 Fキャリア -->
                    <a-form-item :label="$t('app.CtmChc01D01.10004')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['carriercd1', validatorRules.carriercd1]"
                            style="width: 150px" 
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

                    <!-- 出発 フライト -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10005')">
                    <div style="width:150px"> 
                        <a-input type="primary" style="width:150px" v-decorator="['flight1', validatorRules.flight1]" v-model="flight1"/>
                    </div>
                    </a-form-item>

                    <br />

                    <!-- 到着 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10003')">
                    </a-form-item>
                    <!-- 到着 Fキャリア -->
                    <a-form-item :label="$t('app.CtmChc01D01.10004')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select 
                            v-decorator="['carriercd2', validatorRules.carriercd2]"
                            style="width: 150px" 
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

                    <!-- 到着 フライト -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10005')">
                    <div style="width:150px"> 
                        <a-input type="primary" style="width:150px" v-decorator="['flight2', validatorRules.flight2]" v-model="flight2"/>
                    </div>
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
        name: "CtmChc01D02",
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
                model: {},
                carriercd1:"",
                carriercd2:"",
                flight1:"",
                flight2:"",
                container:"",
                flightday:"",
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
                    carriercd1: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.CtmChc01D01.10007')})}]},
                    carriercd2: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.CtmChc01D01.10009')})}]},
                    flight1: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.CtmChc01D01.10008')})},{ pattern: '^[0-9]{0,4}$', message: this.$t('app.CtmChc01D01.10011',{'0': this.$t('app.CtmChc01D01.10008')})}]},
                    flight2: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.CtmChc01D01.10010')})},{ pattern: '^[0-9]{0,4}$', message: this.$t('app.CtmChc01D01.10011',{'0': this.$t('app.CtmChc01D01.10010')})}]},

                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                // 默认值
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                
                console.log(record);
                if (record.status != '1') {
                    console.log(1);
                    
                    this.$nextTick(() => {
                    this.model.container = record.container;
                    this.model.flightday = record.flightday;
                    this.model.carriercd1 = record.carriercd1;
                    this.model.carriercd2 = record.carriercd2;
                    this.model.flight1 = record.flight1;
                    this.model.flight2 = record.flight2;

                    this.form.setFieldsValue(pick(this.model, 'container'))
                    this.form.setFieldsValue(pick(this.model, 'flightday'))
                    this.form.setFieldsValue(pick(this.model, 'carriercd1'))
                    this.form.setFieldsValue(pick(this.model, 'carriercd2'))
                    this.form.setFieldsValue(pick(this.model, 'flight1'))
                    this.form.setFieldsValue(pick(this.model, 'flight2'))

                    })
                }
            },
            close () {
                this.$emit('close');
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

        }
    }
</script>