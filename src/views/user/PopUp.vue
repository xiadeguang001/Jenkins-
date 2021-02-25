<!--
*   
*   ページ： ＢＬキャリア選択搜索view
*   説明： 用于ＢＬキャリア選択搜索数据
*
-->

<template>
    <a-modal
        :title="title"
        :width="500"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        :cancelText="$t('app.common.close')">
    <template slot="footer">
        <a-button @click="handleCancel">{{this.$t('app.common.close')}}</a-button>
        <a-button @click="handleConfirm">{{this.$t('app.common.confirm')}}</a-button>
    </template>
    <!-- クエリエリア -->
    <div class="table-page-search-wrapper">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="10" >
                <a-col :md="20" :sm="200">
                    <a-form-item :label="$t('app.ProjectFormList.10005')">
                        <j-custom-search-tag
                            url="/projectForm/queryProject"
                            valueName="pjId"
                            textName="pjName"
                            v-model="queryParam.pjId">
                        </j-custom-search-tag>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>

    </div>
    
    <!-- table-end -->
    
    </a-modal>
</template>

<script>
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import JInput from '@/components/jeecg/JInput'
    import JCustomSearchTag from '@/components/dict/JCustomSearchTag'
    import { timeFix } from "@/utils/util"

    export default {
        name: "PopUp", // ＢＬキャリア選択搜索view
        mixins: [JeecgListMixin],
        components: {
            JInput,
            JCustomSearchTag
        },
        
        data() {
            return {
                title: this.$t('app.ProjectFormList.10015'),
                visible: false,
                visibleCheck: true,
                queryParam: {
                    pjId:"",
                },
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
       
                url: {
                    list: "",
                },
            }
        },
        methods: {
            show() {
                this.form.resetFields();
                this.visible = true;
            },
            handleCancel() {
                this.close();
            },
            close() {
                this.$emit('close');
                this.visible = false;
            },
            selectRow(record){
                this.$emit("ok",record.id,record.username);
                this.close();
            },
            handleConfirm() {
                var params = this.queryParam;//查询条件
                if(params.pjId==""){
                    this.$message.warning(this.$t('app.ProjectFormList.10014'));
                    return;
                }
                this.$router.push({ name: "agency_maintenance", params: { pjId: params.pjId }})
                    this.$notification.success({
                    message: this.$t('app.message.msg0014'),
                    description: `${timeFix()}`,
                });
            },
        }
    }
</script>