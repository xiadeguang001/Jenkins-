<!--
*   
*   ページ： 项目list
*   説明： 项目データを表示するために使用されます
*
-->

<template>
    <a-card :bordered="false">
        
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <a-row :gutter="24" >
                    <!-- 项目名称 -->
                    <a-col :md="6" :sm="8">
                        <a-form-item :label="$t('app.ProjectList.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <!-- <a-input-search v-model="blpj" enter-button @search="onSearchBl" > </a-input-search> -->
                            <a-input-search v-model="queryParam.pjName" > </a-input-search>

                        </a-form-item>
                    </a-col>

                    <!-- 项目负责人 -->
                    <a-col :md="6" :sm="8">
                        <a-form-item :label="$t('app.ProjectList.10006')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <!-- <a-input-search  v-model="pjLeaderName" enter-button @search="onSearchLeader" ></a-input-search> -->
                             <a-input-search  v-model="queryParam.pjLeaderName" ></a-input-search>
                        </a-form-item>
                    </a-col >
                    <a-col :md="4" :sm="6">
                        <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                        <!-- 查询 -->
                            <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
                            <a-button type="primary" @click="resetClick" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
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

                <!-- <span slot="kanritencd" slot-scope="text, record">
                    <a @click="manageShopEdit(record)" > {{record.kanritencd + record.kanritennm}}</a>                
                </span> -->

                <span slot="action" slot-scope="text, record">
                    <a-popconfirm :title="$t('app.message.msg0018')"  @confirm="() => handleDelete(record.pjId)" >
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
        <!-- <project-list-search-name ref="ProjectListSearchName" @ok="selectBlOk"></project-list-search-name>
        <project-list-search-leader ref="ProjectListSearchLeader" @ok="selectLeaderOK"></project-list-search-leader> -->
        <project-list-add-or-edit ref="modalForm" @ok="modalFormOk"></project-list-add-or-edit>
    </a-card>  
</template>

<script>

// import {getAction} from '@/api/manage';
// import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
// import ProjectListSearchName from './ProjectListSearchName.vue';//项目名選択搜索view
// import ProjectListSearchLeader from './ProjectListSearchLeader.vue';//项目负责人選択搜索view
import ProjectListAddOrEdit from './ProjectListAddOrEdit.vue';//项目追加编辑view

    export default {
        name: "ProjectListSearch",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            // ProjectListSearchName,
            // ProjectListSearchLeader,
            ProjectListAddOrEdit,
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                pjId:"", 
                pjName:"",
                // blpj:"",
                pjLeaderName: "",
                queryParam: {
                    pjName:"",
                    // blpj:"",
                    pjLeaderName:"",
                },
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
                        title: this.$t('app.ProjectList.10001'),
                        align: "center",
                        dataIndex: 'pjId',
                        width: 100
                        // customRender: (text, record, index) => {
                        //     return record.pjId;
                        // }
                    },
                    {
                        // 项目名称
                        title: this.$t('app.ProjectList.10002'),
                        align: "left",
                        dataIndex: 'pjName',
                        width: 200,
                        // customRender: (text, record, index) => {
                        //     return record.pjName;
                        // }
                    },
                    {
                        // 前台项目GitUrl
                        title: this.$t('app.ProjectList.10003'),
                        align: "left",
                        dataIndex: 'pjClGitUrl',
                        width: 200,
                        // customRender: (text, record, index) => {
                        //     return record.pjClGitUrl;
                        // }
                    },
                    {
                        // 后台台项目GitUrl
                        title: this.$t('app.ProjectList.10004'),
                        align: "center",
                        width: 200,
                        dataIndex: 'pjBlGitUrl',
                        //scopedSlots: {customRender: 'pjBlGitUrl'},
                    },
                    {
                        // 项目Url
                        title: this.$t('app.ProjectList.10005'),
                        align: "left",
                        dataIndex: 'pjUrl',
                        width: 200,
                        // scopedSlots: {customRender: 'pjUrl'},
                    },
                    {
                        // 项目负责人
                        title: this.$t('app.ProjectList.10006'),
                        width: 100,
                        align: "center",
                        dataIndex: 'pjLeaderName'
                    },
                    {
                        // Jenkins任务名称
                        title: this.$t('app.ProjectList.10007'),
                        align: "left",
                        width: 250,
                        dataIndex: 'pjJenkinsJobName'
                    },
                    {
                        // 処理
                        title: this.$t('app.ProjectList.10010'),
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: "center",
                        width: 100,
                    }
                ],
                url: {
                    list: "sysp/projectList/list",
                    delete: "sysp/projectList/delete",
                },
            }
        },
        computed: {
            
        },
        methods: {
            // // 项目名称搜索
            // onSearchBl(){
            //     this.$refs.ProjectListSearchName.add(this.pjId,this.pjName);
            //     // debugger;
            // },

            // selectBlOk(selectPjId, selectPjName){
            //     this.pjId = selectPjId;
            //     this.pjName = selectPjName;
            //     this.blpj = selectPjId  + ":"+ selectPjName

            // },

            // // 项目负责人搜索
            // onSearchLeader(){
            //     this.$refs.ProjectListSearchLeader.add(this.pjLeaderName);
            // },

            // selectLeaderOK(selectLeaderName){
            //     this.pjLeaderName = selectLeaderName;
            // },
            // manageShopEdit(record){
            //     this.$refs.ProjectListSearchLeader.edit(record);
            // },
            managementFormOk(){

            },
            addList(){

            },
            resetClick(){
                var that = this;
                that.queryParam.pjId = "";
                that.queryParam.pjName = "";
                // this.blpj = "";
                that.queryParam.pjLeaderName = "";
                that.loadData(this.ipagination.current);
            }

        }

    }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>