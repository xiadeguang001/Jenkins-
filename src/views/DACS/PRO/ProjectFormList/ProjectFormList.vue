<!--
*   
*   ページ： 项目页面list
*   説明： 要約データを表示するために使用されます
*
-->

<template>
    <a-card :bordered="false">
        
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24" >
                    
                    <a-col :md="4" :sm="10">
                        <a-form-item :label="$t('app.ProjectFormList.10005')">
                            <j-custom-search-tag
                                url="/projectForm/queryProject"
                                valueName="pjId"
                                textName="pjName"
                                v-model="queryParam.pjId">
                            </j-custom-search-tag>
                            </a-form-item>
                    </a-col>
                        
                    <a-col :md="4" :sm="6">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                        <!-- 查询 -->
                            <a-button type="primary" @click="searchProjectForm" icon="search">{{this.$t('app.common.search')}}</a-button>
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

                <span slot="pjfLogicName" slot-scope="text, record">
                    <a @click="projectFormEdit(record)" > {{record.pjfLogicName}}</a>                
                </span>

                <span slot="action" slot-scope="text, record">
                    <a-popconfirm :title="$t('app.ProjectFormList.10013')" @confirm="() =>handleDelete(record.pjfFormId)">
                        <a ><a-icon type="delete"/></a>
                    </a-popconfirm>

                    <a-divider type="vertical"/>

                    <a @click="handleEdit(record)" >
                        <a-icon type="edit"/>
                    </a>
                </span>
            </a-table>
        </div>
        <!-- table-end -->
        
        <project-form-detail ref="ProjectFormDetail" @ok="managementFormOk"></project-form-detail>
        <project-form-add-or-edit ref="modalForm" @ok="modalFormOk"></project-form-add-or-edit> 
    </a-card>  
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import JCustomSearchTag from '@/components/dict/JCustomSearchTag'

import ProjectFormDetail from './ProjectFormDetail'; // 项目页面詳細
import ProjectFormAddOrEdit from './ProjectFormAddOrEdit';


    export default {
        name: "ProjectFormList",
        mixins: [JeecgListMixin],
        queryParam: {
            pjId:""
        },
        components: {
            JCustomSearchTag,
            JInput,
            ProjectFormDetail,
            ProjectFormAddOrEdit
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                pjfLogicName:"",
                sendShopDescription:"",
                pjfPhysicsName: "",
                pjfFormId:"",
                pjId:"",
               
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
                        // 画面逻辑名称
                        title: this.$t('app.ProjectFormList.10001'),
                        align: "left",
                        dataIndex: 'pjfLogicName',
                        width: 200,
                         scopedSlots: {customRender: 'pjfLogicName'}
                    },
                    {
                        // 画面物理名称
                        title: this.$t('app.ProjectFormList.10002'),
                        align: "center",
                        width: 80,
                        dataIndex: 'pjfPhysicsName',
                        // scopedSlots: {customRender: 'airportcd'},
                    },
                    {
                        // 项目ID
                        title: this.$t('app.ProjectFormList.10005'),
                        align: "left",
                        dataIndex: 'pjfPjName',
                        width: 250,
                        // scopedSlots: {customRender: 'pjfPjId'},
                    },
                    {
                        // 画面类型
                        title: this.$t('app.ProjectFormList.10004'),
                        width: 100,
                        align: "center",
                        dataIndex: 'pjfFormType_dictText'
                    },
                    {
                        // 処理
                        title: this.$t('app.ProjectFormList.10010'),
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: "center",
                        width: 100,
                    }
                ],
                url: {
                    list:  "/projectForm/list",
                    delete: "/projectForm/delete",
                },
            }
        },
        computed: {
            
        },
        methods: {
            //画面检索
            searchProjectForm(){
                var params = this.getQueryParams();//查询条件
                const than=this;
                than.dataSource=[];
                if(params.pjId==undefined){
                    this.$message.warning(this.$t('app.ProjectFormList.10014'));
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
            projectFormEdit(record){
                console.log(record);
                this.$refs.ProjectFormDetail.edit(record);
            },
            managementFormOk(){

            },
        }

    }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>