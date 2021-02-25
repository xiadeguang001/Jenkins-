<!--
*   
*   ページ：  便メッセージメンテナンスlist
*   説明： 便メッセージメンテナンスlist新規、編集することができます
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

                    <a-form-item :label="$t('app.AlmAli01D01.10010')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-select default-value="JAL" style="width: 150px" @click="handleButtonClick">
                                
                                <a-select-option value="1">
                                    JAL
                                </a-select-option>
                                <a-select-option value="2">
                                    MHG
                                </a-select-option>
                            </a-select>
                    </a-form-item>
                    &nbsp;
                    <a-form-item :label="$t('app.AlmAli01D01.10011')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="fflightno1"   ></a-input>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10031')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="msg"   ></a-input>
                            <div style="color: #0000FF">※メッセージは全角４５文字です。</div>
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleCancel"  style="margin-left: 8px">{{this.$t('app.common.cancel')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" >{{this.$t('app.common.confirm')}}</a-button>    
        </div>
        
    </a-drawer>
</template>

<script>
    
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import moment from 'moment' 
    
    
    
    export default {
        name: "AlmAli06D02",
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
            msg:"",
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
            fflightno1:"",
            iconChooseVisible: false,
            validateStatus:"",
            calendarDatas:[],
        }
        },
        methods: {
            add (){
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.msg = this.model.msg;
                this.fflightno1 = this.model.fflightno1;
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
            handleButtonClick(){

            }

        
        }
    }
</script>

<style scoped>

</style>