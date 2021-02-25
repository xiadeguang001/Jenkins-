<!--
*   
*   ページ： 项目页面詳細view
*   説明： 用于显示项目页面详细数据
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

                    <!-- 画面逻辑名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectFormList.10001')"
                    hasFeedback >
                        {{pjfLogicName}}
                                                
                    </a-form-item>

                    <!-- 画面物理名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectFormList.10002')"
                    hasFeedback >
                        {{pjfPhysicsName}}                
                    </a-form-item>
                    <!-- 项目ID -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectFormList.10005')"
                    hasFeedback >
                        {{pjfPjName}}    
                    </a-form-item>

                    <!--  画面类型 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectFormList.10004')"
                    hasFeedback >
                        {{pjfFormType_dictText}}    
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>

        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleOk" :loading="confirmLoading" :disabled="disableSubmit" icon="close-square">关闭</a-button>
        </div>

    </a-modal>
</template>

<script>
    import { getMsgInfo } from "@/utils/util"
    
    export default {
        name: "ProjectFormDetail",
        components: {},
        data () {
        return {
            drawerWidth:700,
            editTitle: this.$t('app.ProjectFormList.10006'),
            visible: false,
            disableSubmit:false,
            model: {},
            pjfLogicName : "",// 画面逻辑名称 
            pjfPhysicsName: "", // 画面物理名称
            pjfPjId : "",// 项目ID
            pjfPjName:'',
            pjfFormType: "", // 画面类型
            pjfFormType_dictText:"",
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
                this.pjfLogicName = record.pjfLogicName;
                this.pjfPhysicsName = record.pjfPhysicsName;
                this.pjfPjId = record.pjfPjId;
                this.pjfFormType = record.pjfFormType;
                this.pjfPjName = record.pjfPjName;
                this.pjfFormType_dictText = record.pjfFormType_dictText;
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