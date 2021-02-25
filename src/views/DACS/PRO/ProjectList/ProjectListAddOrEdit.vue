<!--
*   
*   ページ： 项目を追加view
*   説明： 项目データの追加と編集に使用
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

        <div :style="{width: '100%',padding: '8px 14px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    <!-- 项目名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectList.10002')">
                        <a-input v-decorator="[ 'pjName', validatorRules.pjName]"/>
                    </a-form-item>

                    <!-- 前台项目GitUrl -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectList.10003')">
                         <a-input v-decorator="[ 'pjClGitUrl', validatorRules.pjClGitUrl]"/>
                    </a-form-item>

                    <!-- 后台台项目GitUrl -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectList.10004')">
                         <a-input v-decorator="[ 'pjBlGitUrl', validatorRules.pjBlGitUrl]"/>
                    </a-form-item>

                    <!-- 项目Url -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectList.10005')">
                         <a-input v-decorator="[ 'pjUrl', validatorRules.pjUrl]"/>
                    </a-form-item>

                    <!-- 项目负责人 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectList.10006')">
                         <a-input v-decorator="[ 'pjLeaderName', validatorRules.pjLeaderName]"/>
                    </a-form-item>

                    <!-- Jenkins任务名称 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.ProjectList.10007')">
                         <a-input v-decorator="[ 'pjJenkinsJobName', validatorRules.pjJenkinsJobName]"/>
                    </a-form-item>

                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-popconfirm :title="$t('app.MstDrt01D01.10021')" @confirm="handleCancel" :okText="$t('app.common.confirm')" :cancelText="$t('app.common.cancel')">
                <a-button style="margin-right: .8rem" icon="close-square">关闭</a-button>
            </a-popconfirm>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="form">保存</a-button>    
        </div>
    </a-drawer>
</template>

<script>
    // import ProjectListSearchName from './ProjectListSearchName'; // 项目名選択搜索view
    // import ProjectListSearchLeader from './ProjectListSearchLeader'; // 项目负责人選択搜索view
    import JCustomSearchTag from '@/components/dict/JCustomSearchTag'
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import { addProject, editProject, duplicateCheck, pjNameCheck} from '@/api/api'

    export default {
        name: "ProjectListAddOrEdit",
        components: {
            JCustomSearchTag
        },
        data () {
        return {
            drawerWidth:700,
            title:this.$t('app.label.action'),
            // blCode:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            pjId:"", 
            pjName:"",
            pjLeaderName: "",
            pjClGitUrl:"",
            pjBlGitUrl:"",
            pjUrl:"",
            pjJenkinsJobName:"",
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
                    pjName: { rules: [{ required: true, message: this.$t('app.ProjectList.10013') },
                    // { validator: this.validatePjName}
                    ]},
                    pjClGitUrl: { rules: [{ required: true, message: this.$t('app.ProjectList.10015') }]},
                    pjBlGitUrl: { rules: [{ required: true, message: this.$t('app.ProjectList.10016') }]},
                    pjUrl: { rules: [{ required: true, message: this.$t('app.ProjectList.10017') }]},
                    pjJenkinsJobName: { rules: [{ required: true, message: this.$t('app.ProjectList.10017') }]},
                    pjLeaderName: { rules: [{ required: true, message: this.$t('app.ProjectList.10018') }]},
                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                
                this.agencyCommisionRate = 0;
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                
                console.log(record);
                if (record.status != '1') {
                    console.log(1);
                    this.disabledFlg = true;
                    this.pjName = record.pjName;
                    this.pjClGitUrl = record.pjClGitUrl;
                    this.pjBlGitUrl = record.pjBlGitUrl;
                    this.pjUrl = record.pjUrl;
                    this.pjLeaderName = record.pjLeaderName;
                    this.pjJenkinsJobName = record.pjJenkinsJobName;
                    this.$nextTick(() => {
                        this.pjName = record.pjName;
                        this.pjClGitUrl = record.pjClGitUrl;
                        this.pjBlGitUrl = record.pjBlGitUrl;
                        this.pjUrl = record.pjUrl;
                        this.pjLeaderName = record.pjLeaderName;
                        this.pjJenkinsJobName = record.pjJenkinsJobName;

                        this.form.setFieldsValue(pick(this.model, 'pjName'))
                        this.form.setFieldsValue(pick(this.model, 'pjClGitUrl'))
                        this.form.setFieldsValue(pick(this.model, 'pjBlGitUrl'))
                        this.form.setFieldsValue(pick(this.model, 'pjUrl'))
                        this.form.setFieldsValue(pick(this.model, 'pjLeaderName'))
                        this.form.setFieldsValue(pick(this.model, 'pjJenkinsJobName'))
                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.pjLeaderName = "";
                this.disableSubmit = false;
                this.visible = false;
            },
            handleOk () {
                const that = this;
                this.form.validateFields((err, values) => {
                    if (!err) {
                        that.confirmLoading = true;
                        let formData = Object.assign(this.model, values);

                        // pjNameCheck(formData).then((res) => {
                        //     if (res.success) {
                        //         that.$message.success(res.message);
                        //         that.$emit('ok');
                        //         if (!this.model.pjId) {
                        //             obj = addProject(formData)
                        //         } else {
                        //             obj = editProject(formData)
                        //     }
                        //     obj.then((res) => {
                        //         if (res.success) {
                        //         that.$message.success(res.message)
                        //         that.$emit('ok')
                        //         } else {
                        //         that.$message.warning(res.message)
                        //         }
                        //     }).finally(() => {
                        //         that.confirmLoading = false
                        //         that.close()
                        //     })
                        //     }else{
                        //         that.$message.warning(res.message);
                        //     }
                        // }).finally(() => {
                        //     that.confirmLoading = false;
                        //     that.close();
                        // })
                        let obj
                        let pjc
                        if (!this.model.pjId) {
                            pjc = pjNameCheck(formData)

                            pjc.then((res) => {
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
                            obj = addProject(formData)
                        } else {
                            obj = editProject(formData)
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
            },
            initDictConfig() {
            },
        }
    }
</script>

<style scoped>

</style>