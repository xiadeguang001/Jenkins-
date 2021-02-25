<!--
*   
*   ページ： コンテナ在庫問合せ
*   説明： 要約データを表示するために使用されます
*
-->
<template>
    <div>
    <h1 class="p-pageTitle">{{$t('app.CtmCvi01D01.10000')}}</h1>
    <p class="p-pageSubText">{{$t('app.CtmCvi01D01.10001')}}</p>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <div class="table-operator">
                    <a-row :gutter="24" >
                        <a-col :md="20" :sm="8">
                            
                        </a-col>
                        <a-col :md="4" :sm="8" class="row-right-button">
                            <a-button style="" icon="file-text" @click="searchQuery" />
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

                <span slot="container" slot-scope="text, record">
                    <a @click="showInfo(record)" > {{record.container}}</a>                
                </span>
            </a-table>
        </div>
        <!-- table区域-end -->
        <ctm-cvi-01-d-02 ref="CtmCvi01D02"></ctm-cvi-01-d-02>
        <ctm-cvi-01-d-03 ref="CtmCvi01D03" @ok="searchOk"></ctm-cvi-01-d-03>
    </a-card>  
    </div>
</template>

<script>
import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import CtmCvi01D02 from './CtmCvi01D02'; // 明細画面
import CtmCvi01D03 from './CtmCvi01D03'; // 検索画面
export default {
        name: "CtmCvi01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            CtmCvi01D02,
            CtmCvi01D03
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
                        // コンテナ
                        title: this.$t('app.CtmChc01D01.10000'),
                        align: "center",
                        dataIndex: 'container',
                        width: 250,
                        scopedSlots: {customRender: 'container'},
                    },
                    {
                        // フライト日
                        title: this.$t('app.CtmChc01D01.10001'),
                        align: "center",
                        dataIndex: 'flightday',
                        width: 250,
                        scopedSlots: {customRender: 'flightday'},
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
                                //　Fキャリア
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
                        flightday:"2021/01/29",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0001",
                        flight2: "0002",
                        airport1: "KUA",
                        airport2: "CTS",
                        container:"00002",
                        flightday:"2021/01/28",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0003",
                        flight2: "0003",
                        airport1: "HND",
                        airport2: "MMY",
                        container:"00003",
                        flightday:"2021/01/27",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0004",
                        flight2: "0004",
                        airport1: "HND",
                        airport2: "MMY",
                        container:"00004",
                        flightday:"2021/01/26",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0005",
                        flight2: "0005",
                        airport1: "HND",
                        airport2: "MMY",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0006",
                        flight2: "0006",
                        airport1: "KUA",
                        airport2: "MMY",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        container:"00005",
                        flightday:"2021/01/25",
                    },],
            }
        },
        computed: {
            
        },
        methods: {
            onSearchModel(){
                this.$refs.CtmCvi01D03.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            },showInfo(record){
                this.$refs.CtmCvi01D02.edit(record);
            }
        }

    }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
