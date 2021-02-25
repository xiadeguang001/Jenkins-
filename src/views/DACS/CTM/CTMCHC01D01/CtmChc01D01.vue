<!--
*   
*   ページ： コンテナ履歴修正
*   説明： 要約データを表示するために使用されます
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.CtmChc01D01.10012')}}</h1>
        <p class="p-pageSubText">{{$t('app.CtmChc01D01.10013')}}</p>
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline" @keyup.enter.native="searchQuery">
                    <!-- 新增 -->

                    <div class="table-operator">
                        <a-row :gutter="24" >
                            <a-col :md="22" :sm="8">
                                <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
                            </a-col>
                            <a-col :md="2" :sm="8" class="row-right-button">
                                <a-button style="" icon="zoom-in" @click="onSearchModel" />
                            </a-col>
                        </a-row>
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
            <!-- table区域-end -->
            <ctm-chc-01-d-02 ref="modalForm" @ok="modalFormOk"></ctm-chc-01-d-02>
            <ctm-chc-01-d-03 ref="CtmChc01D03" @ok="searchOk"></ctm-chc-01-d-03>
        </a-card>  
    </div>
</template>

<script>
import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import CtmChc01D02 from './CtmChc01D02'; // 検索画面
import CtmChc01D03 from './CtmChc01D03'; // 検索画面
export default {
        name: "CtmChc01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            CtmChc01D02,
            CtmChc01D03
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                carriercd1:"",
                carriercd2:"",
                flight1:"",
                flight2:"",
                airport1:"",
                airport2:"",
                container:"",
                flightday:"",
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
                        // 出発
                        title: this.$t('app.CtmChc01D01.10002'),
                        align: "center",
                        children: [
                            {
                                // Fキャリア
                                title: this.$t('app.CtmChc01D01.10004'),
                                dataIndex: 'carriercd1',
                                align: 'center',
                            },
                            {
                                // フライト
                                title: this.$t('app.CtmChc01D01.10005'),
                                dataIndex: 'flight1',
                                align: 'center',
                            },
                            {
                                // 空港
                                title: this.$t('app.CtmChc01D01.10006'),
                                dataIndex: 'airport1',
                                align: 'center',
                            }
                        ]
                    },
                    {
                        // 到着
                        title: this.$t('app.CtmChc01D01.10003'),
                        align: "center",
                        children: [
                            {
                                // Fキャリア
                                title: this.$t('app.CtmChc01D01.10004'),
                                dataIndex: 'carriercd2',
                                align: 'center',
                            },
                            {
                                // フライト
                                title: this.$t('app.CtmChc01D01.10005'),
                                dataIndex: 'flight2',
                                align: 'center',
                            },
                            {
                                // 空港
                                title: this.$t('app.CtmChc01D01.10006'),
                                dataIndex: 'airport2',
                                align: 'center',
                            }
                        ]
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
                    
                },
                dataSource1:[{
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00001",
                        flightday:"20210129",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0001",
                        flight2: "0002",
                        airport1: "KUA",
                        airport2: "CTS",
                        container:"00002",
                        flightday:"20210128",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0003",
                        flight2: "0003",
                        airport1: "HND",
                        airport2: "MMY",
                        container:"00003",
                        flightday:"20210127",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0004",
                        flight2: "0004",
                        airport1: "HND",
                        airport2: "MMY",
                        container:"00004",
                        flightday:"20210126",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0005",
                        flight2: "0005",
                        airport1: "HND",
                        airport2: "MMY",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0006",
                        flight2: "0006",
                        airport1: "KUA",
                        airport2: "MMY",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"20210125",
                    },],
            }
        },
        computed: {
            
        },
        methods: {
            onSearchModel(){
                this.$refs.CtmChc01D03.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            }
        }

    }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
