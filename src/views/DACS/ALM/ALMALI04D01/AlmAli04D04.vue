<!--
*   
*   ページ：  時間の選択
*   説明： 時間の選択
*
-->
<template>
    <a-modal
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
                    <a-form-item :label="$t('app.AlmAli01D01.10012')" 
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-time-picker :placeholder="$t('app.AlmAli01D01.10036')" @change="sendDayChange" format="HH:mm" style="width: 150px" ></a-time-picker>
                    </a-form-item>
                    <a-form-item :label="$t('app.AlmAli01D01.10013')" 
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-time-picker :placeholder="$t('app.AlmAli01D01.10036')" @change="arrivalChange" format="HH:mm" style="width: 150px" ></a-time-picker>
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleCancel"  style="margin-left: 8px">{{this.$t('app.common.cancel')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" >{{this.$t('app.common.confirm')}}</a-button>    
        </div>

    </a-modal>
</template>

<script>
    
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import moment from 'moment' 
    
    export default {
        name: "AlmAli04D04",
        components: {
        
        },
        data () {
        return {
            drawerWidth: 600,
            title:this.$t('app.common.add'), 
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
    
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
            pdtno:"",
            blno:"",
            iconChooseVisible: false,
            validateStatus:"",
            goTime:"",
            arrivalTime:"",
            selectDay:""
        }
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.selectDay = record;
                this.visible = true;
                console.log(record);
            },
            close () {
                this.visible = false;
            },
            handleOk () {
                
                this.$emit('ok', this.selectDay,this.goTime,this.arrivalTime);
                this.close();
            },
            handleCancel () {
                this.close();
            },
            // 根据屏幕变化,设置抽屉尺寸
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
            sendDayChange(time,timeString){
                console.log(time);
                
                this.goTime = timeString;
                console.log(this.goTime);
            },
            arrivalChange(time,timeString){
                console.log(time);
                this.arrivalTime = timeString;
            },
            
        }
    }
</script>

<style scoped>

</style>