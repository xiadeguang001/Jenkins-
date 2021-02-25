<!--
*   
*   ページ： 便メッセージメンテナンス
*   説明：便メッセージメンテナンスを検索。
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
                            <a-select default-value="1" style="width: 150px" @click="handleButtonClick">
                                
                                <a-select-option value="1">
                                    1
                                </a-select-option>
                                <a-select-option value="2">
                                    2
                                </a-select-option>
                            </a-select>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10011')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="fflightno1"   ></a-input>
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
        name: "AlmAli05D03",
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
            fflightno1:"",
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
                this.fflightno1 = "";
                
            },
            handleButtonClick(){

            }
            
        }
    }
</script>

<style scoped>

</style>