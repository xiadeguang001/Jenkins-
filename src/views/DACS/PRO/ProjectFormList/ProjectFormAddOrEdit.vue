<!--
*   
*   ページ： 添加编辑项目页面
*   説明： 项目页面的添加或编辑
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
                    <!-- 项目 -->
                    <a-form-item :label="$t('app.ProjectFormList.10005')" :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <j-custom-search-tag
                            url="/projectForm/queryProject"
                            valueName="pjId"
                            textName="pjName"
                            v-decorator="[ 'pjfPjId', validatorRules.pjfPjId]" >
                            
                        </j-custom-search-tag>
                    </a-form-item>

                    <!-- 画面逻辑名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectFormList.10001')">
                        <a-input v-decorator="[ 'pjfLogicName', validatorRules.pjfLogicName]"/>
                    </a-form-item>

                    <!-- 画面物理名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectFormList.10002')">
                        <a-input v-decorator="[ 'pjfPhysicsName', validatorRules.pjfPhysicsName]"/>
                    </a-form-item>                      

                    <!-- 画面类型-->                 
                    <a-form-item :label="$t('app.ProjectFormList.10004')" :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <j-dict-select-tag dictCode="pjf_form_type" :triggerChange="true"  v-decorator="['pjfFormType', validatorRules.pjfFormType]"/>
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-popconfirm :title="$t('app.ProjectFormList.10008')" @confirm="handleCancel" :okText="$t('app.ProjectFormList.10011')" :cancelText="$t('app.ProjectFormList.10012')">
                <a-button style="margin-right: .8rem" icon="close-square">取消</a-button>
            </a-popconfirm>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="form">保存</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import JCustomSearchTag from '@/components/dict/JCustomSearchTag'
    import { addProjectForm, editProjectForm, duplicateCheck } from '@/api/api'

    export default {
        name: "ProjectFormAddOrEdit",
        components: {
            JCustomSearchTag
        },
        data () {
        return {
            drawerWidth:700,
            title:this.$t('app.label.action'),
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            pjfFormTypeName:"", 
            pjfLogicName: "", 
            pjfPjId:"",
            disabledFlg:false,
            queryParam: {
                    pjId:""
            },
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
                    pjfFormType: { rules: [{ required: true, message: this.$t('app.ProjectFormList.10009') }]},
                    pjfLogicName: { rules: [{ required: true, message: this.$t('app.ProjectFormList.10009') }]},
                    pjfPhysicsName: { rules: [{ required: true, message: this.$t('app.ProjectFormList.10009') }]},
                    pjfPjId: { rules: [{ required: true, message: this.$t('app.ProjectFormList.10009') }]}
                }
            }
        },
        created () {
            
        },
        methods: {
            add () {
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
                    
                    this.model = Object.assign({},record);
                    this.model.pjfPjId = String(this.model.pjfPjId)
                    this.model.pjfFormType = String(this.model.pjfFormType)
                    this.$nextTick(() => {
                        this.form.setFieldsValue(pick(this.model, 'pjfFormType'))
                        this.form.setFieldsValue(pick(this.model, 'pjfLogicName'))
                        this.form.setFieldsValue(pick(this.model, 'pjfPhysicsName'))
                        this.form.setFieldsValue(pick(this.model, 'pjfPjId'))
                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.pjfLogicName = "";
                this.disableSubmit = false;
                this.visible = false;
            },
            handleOk () {
                const that = this;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        let formData = Object.assign(this.model, values)
                        that.confirmLoading = true;
                        let obj
                        if (!this.model.pjfFormId) {
                            obj = addProjectForm(formData)
                        } else {
                            obj = editProjectForm(formData)
                        }
                        obj.then((res) => {
                        if (res.success) {
                            that.$message.success(res.message)
                            that.$emit('ok')
                        } else {
                            that.$message.warning(res.message)
                        }
                        }).finally(() => {
                        that.confirmLoading = false
                        that.close()
                        })
                    }
                });
            },
            handleCancel () {
                this.close();
            },
            
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 500){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 700;
                }
            }
        }
    }
</script>

<style scoped>

</style>