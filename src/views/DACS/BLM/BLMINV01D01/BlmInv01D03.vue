<!--
*   
*   ページ： 航空便种集計検索モデル
*   説明： クエリ条件を増やすために使用されます
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

                    <a-form-item :label="$t('app.AlmAli01D01.10018')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select v-decorator="['blcarriercd', validatorRules.blcarriercd]" style="width: 150px" @click="handleButtonClick">
                                
                                <a-select-option value="1">
                                    1
                                </a-select-option>
                                <a-select-option value="2">
                                    2
                                </a-select-option>
                            </a-select>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10035')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <div v-decorator="['blnoStart', validatorRules.blnoStart]">
                                <a-input v-model="blnoStart" style="width: 150px"></a-input> ~
                                <a-input v-model="blnoEnd" style="width: 150px"></a-input> 
                            </div>
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
    
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    
    export default {
        name: "BLMINV01D03",
        components: {
        
        },
        data () {
            return {
                drawerWidth: 600,
                title:this.$t('app.common.search'), 
                blCode:"",
                addTitle: this.$t('app.common.add'),
                editTitle: this.$t('app.common.edit'),
                visible: false,
                disableSubmit:false,
                model: {},
                blnoStart:"",
                blnoEnd:"",
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
        computed: {
            validatorRules:function() {
                return {
                    blcarriercd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.AlmAli01D01.10010')})}]},
                    blnoStart: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.AlmAli01D01.10035')})}]},
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
            },
            close () {
                this.visible = false;
            },
            handleOk () {
                this.$emit('ok', this.model);
                this.close();
            },
            handleCancel () {
                this.close();
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
                this.inquiryNumber = "";
                this.containerNo = "";
                
            },

            // 発行店搜索
            onSearchSendShop(){
                
            },
            selectSendShopOk(hakoutencd,hakoutennm){
            
            },
            
            handleButtonClick(){

            },
            airportSelect(){

            },
            arrivalAirPortClick(){

            },
            changeSetOffTime(time,timeString){
                
            },
            sendDayChange(time,timeString){

            }
        }
    }
</script>

<style scoped>

</style>