<!--
*   
*   ページ： 项目人员list
*   説明： 要約データを表示するために使用されます
*
-->

<template>
    <a-card :bordered="false">
        
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24" >
                    <!-- 项目名称 -->
                    <a-col :md="6" :sm="8">
                        <a-form-item :label="$t('app.ProjectMemberList.10000')" :labelCol="labelCol" :wrapperCol="wrapperCol"> 
                            <j-custom-search-tag
                            url="/pro/projectMember/searchProject"
                            valueName="pjId"
                            textName="pjName"
                            v-model="queryParam.pjId"
                            >
                            </j-custom-search-tag>
                    </a-form-item>
                    </a-col>
                    <a-col :md="4" :sm="6">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                        <!-- 查询 -->
                            <a-button type="primary" @click="searchMember" icon="search">{{this.$t('app.common.search')}}</a-button>
                        </span>
                    </a-col>
                </a-row>
                <!-- 新增 -->
                <div class="table-operator">
                    <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
                </div>
            </a-form>
        </div>

        <!-- table区域-begin -->
        <div>
            <a-table
                ref="table"
                bordered
                size="middle"
                :rowKey="(record,index)=>{return index}"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                :scroll="{x:1200}"
                :rowClassName="InterlaceDiscoloration"
                @change="handleTableChange">

                <span slot="action" slot-scope="text, record">
                    <a-popconfirm :title="$t('app.ProjectMemberList.10010')" @confirm="() => deleteMember(record.pjmPjId,record.pjmUserId)" >
                        <a><a-icon type="delete"/></a>
                    </a-popconfirm>

                    <a-divider type="vertical"/>

                    <a @click="handleEdit(record)" >
                        <a-icon type="edit"/>
                    </a>
                </span>
            </a-table>
        </div>
        <!-- table-end -->
        <project-member-modal ref="modalForm" @ok="modalFormOk"></project-member-modal>
    </a-card>  
</template>

<script>

import {deleteMember} from '@/api/api'
import {getAction} from '@/api/manage'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JCustomSearchTag from '@/components/dict/JCustomSearchTag'
import ProjectMemberModal from './ProjectMemberModal.vue'
import JInput from '@/components/jeecg/JInput'

    export default {
        name: "ProjectMemberList",
        mixins: [JeecgListMixin],
        // 查询条件
        queryParam: {
            pjId:''
        },
        components: {
            JInput,
            JCustomSearchTag,
            ProjectMemberModal
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),

                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
                recycleBinVisible: false,
                columns: [
                    {
                        title: 'No.',
                        dataIndex: '',
                        key:'rowIndex',
                        width:40,
                        align:"center",
                        customRender:function (text, record, index) {
                            return parseInt(index)+1;
                        }
                    },
                    {
                        // 项目ID
                        title: "项目ID",
                        align: "center",
                        width: 100,
                        dataIndex: 'pjmPjId',
                    },
                    {
                        // 项目名称
                        title: this.$t('app.ProjectMemberList.10000'),
                        align: "center",
                        width: 100,
                        dataIndex: 'pjmPjName',
                    },
                    // 项目人员名称ID
                    {
                        title: "项目人员名称ID",
                        align: "center",
                        width: 100,
                        dataIndex: 'pjmUserId',
                    },
                    {
                        // 项目人员名称
                        title: this.$t('app.ProjectMemberList.10002'),
                        align: "left",
                        width: 200,
                        dataIndex: 'pjmUserName',
                    },
                    {
                        // 项目权限
                        title: this.$t('app.ProjectMemberList.10004'),
                        align: "center",
                        width: 80,
                        dataIndex: 'pjmUserRoleId_dictText',
                    },
                    {
                        // 処理
                        title: this.$t('app.ProjectMemberList.10006'),
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: "center",
                        width: 100,
                    }
                ],
                url: {
                    list: "/pro/projectMember/list",
                },
            }
        },
        methods : {
            deleteMember: function (pjmPjId,pjmUserId) {
                const that = this;
                const formData = new FormData();
                formData.append('pjmPjId', pjmPjId);
                formData.append('pjmUserId', pjmUserId);
                deleteMember(formData).then((res) => {
                    if (res.success) {
                        that.$message.success(res.message);
                    } else {
                        that.$message.warning(res.message);
                    }
                });
            },
            //画面检索
            searchMember(){
                var params = this.getQueryParams();//查询条件
                const than=this;
                than.dataSource=[];
                if(params.pjId==undefined){
                    this.$message.warning(this.$t('app.ProjectMemberList.10007'));
                    return;
                }
                getAction(than.url.list, params).then((res) => {
                    if (res.success) {
                        than.dataSource = Object.assign(res.result.records,than.dataSource);
                        than.ipagination.total = res.result.total;
                    }
                    this.loading = false;
                })
            },
        }
    }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>