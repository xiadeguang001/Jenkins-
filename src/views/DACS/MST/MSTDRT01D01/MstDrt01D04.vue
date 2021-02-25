<!--
*   
*   ページ： 管理店詳細view
*   説明： 管理ストアの詳細データを表示するために使用されます
*
-->

<template>
    <a-modal
        :title="editTitle"
        :width="drawerWidth"
        :maskClosable="false"
        @cancel="handleCancel"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">

        <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">

                    <!-- 発行店コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10003')"
                    hasFeedback >
                        {{sendShopCode}}
                                                
                    </a-form-item>

                    <!-- 発行店 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10016')"
                    hasFeedback >
                        福岡空港                        
                    </a-form-item>
                    <!-- 管理店コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10017')"
                    hasFeedback >
                        {{managementShopCode}}    
                    </a-form-item>

                    <!-- 管理店コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10005')"
                    hasFeedback >
                        長崎空港営業所
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>

        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleOk" :loading="confirmLoading" :disabled="disableSubmit" icon="close-square">閉じる</a-button>
        </div>

    </a-modal>
</template>

<script>
    import { getMsgInfo } from "@/utils/util"
    
    export default {
        name: "MstDrt01D04",
        components: {},
        data () {
        return {
            drawerWidth:700,
            editTitle: this.$t('app.MstDrt01D01.10018'),
            visible: false,
            disableSubmit:false,
            model: {},
            managementShopCode : "",//管理店コード
            sendShopCode: "", // 発行店コード
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
                    
                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                this.managementShopCode = record.kanritencd;
                this.sendShopCode = record.hakoutencd;
            },
            close () {
                this.$emit('close');
                this.disableSubmit = false;
                this.visible = false;
            },
            handleOk () {
                const that = this;
                that.close();
            },
            handleCancel () {
                this.close()
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

<style scoped>

</style>