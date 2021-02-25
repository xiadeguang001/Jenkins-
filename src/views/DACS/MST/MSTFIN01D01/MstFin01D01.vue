<!--
*   
*   ページ： 【MST-FIN01D01】細目マスタ保
*   説明： 　明細一覧表示画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstFin01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.MstFin01D01.10011')}}</p>
                <a-card :bordered="false">
                    <!-- クエリエリア -->
                    <div class="table-page-search-wrapper">
                        <a-form layout="inline">
                            <!-- 新規 -->
                            <div class="table-operator">
                                <a-row :gutter="24" >
                                    <a-col :md="20" :sm="8">
                                        <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
                                    </a-col>
                                    <a-col :md="4" :sm="8" class="row-right-button">
                                        <a-button style="" icon="file-text" @click="searchQuery" />
                                        <a-button style="" icon="zoom-in" @click="onSearchModel" />
                                    </a-col>
                                </a-row>
                            </div>
                        </a-form>
                    </div>

                    <!-- table-begin -->
                    <div>
                        <a-table
                            ref="table"
                            bordered
                            size="middle"
                            :rowKey="(record,index)=>{return index}"
                            :columns="columns"
                            :dataSource="dataSource1"
                            :pagination="ipagination"
                            :loading="loading"
                            :scroll="{x:1200}"
                            :rowClassName="InterlaceDiscoloration"
                            @change="handleTableChange">

                            <span slot="action" slot-scope="text, record">
                                <a-popconfirm :title="$t('app.message.msg0018')" >
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
                    
                    <mst-fin-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-fin-01-d-03> 
                    <mst-fin-01-d-02 ref="MstFin01D02" @ok="searchOk"></mst-fin-01-d-02> 
                </a-card>  

    </div>
</template>



<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstFin01D03 from './MstFin01D03'; 
import MstFin01D02 from './MstFin01D02';
    export default {
        name: "MstFin01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstFin01D02,
            MstFin01D03,
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                storecd:"",
                subjectcd:"",
                subjectnm:"",
                detailcd:"",
                detailnm:"",

                queryParam: {
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
                        title: this.$t('app.common.number'),
                        dataIndex: '',
                        key:'rowIndex',
                        width:40,
                        align:"center",
                        customRender:function (text, record, index) {
                            return parseInt(index)+1;
                        }
                    },
                    {
                        // 科目コード
                        title: this.$t('app.MstFin01D01.10002'),
                        align: "center",
                        dataIndex: 'subjectcd',
                        width:150,
                    },
                    {
                        // 科目名称
                        title: this.$t('app.MstFin01D01.10003'),
                        align: "left",
                        dataIndex: 'subjectnm',

                    },
                    {
                        // 細目コード
                        title: this.$t('app.MstFin01D01.10004'),
                        align: "center",
                        dataIndex: 'detailcd',
                        width:150
                    },
                    {
                        // 細目名称
                        title: this.$t('app.MstFin01D01.10005'),
                        align: "left",
                        dataIndex: 'detailnm',
                    },
                    {
                        // 処理
                        title: this.$t('app.common.operation'),
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: "center",
                        width: 100,
                    }
                ],
                url: {
                //  list: "/dacs/dairitenMaintenance/list",
                },
                //ダミーデータ　表示用
                dataSource1:[
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"01",
                        detailnm:"収入航空料(01)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"02",
                        detailnm:"収入航空料(02)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"03",
                        detailnm:"収入航空料(03)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"04",
                        detailnm:"収入航空料(04)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"05",
                        detailnm:"収入航空料(05)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"06",
                        detailnm:"収入航空料(06)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"07",
                        detailnm:"収入航空料(07)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"08",
                        detailnm:"収入航空料(08)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"09",
                        detailnm:"収入航空料(09)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"10",
                        detailnm:"収入航空料(10)",
                    },
                    {
                        subjectcd:"90430",
                        subjectnm:"収入航空料",
                        detailcd:"11",
                        detailnm:"収入航空料(11)",
                    },

                  
                ],
            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){
                this.subjectcd = "";
                this.subjectnm = "";
                this.detailcd = "";
                this.detailnm = "";
            },
            onSearchModel(){
           this.$refs.MstFin01D02.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            },

            handelEdit(record){
                this.$refs.MstFin01D01.edit(record);
            },

        }

    }

</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>