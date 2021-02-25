<!--
*   
*   ページ： コンテナ棚卸調査表問合せ
*   説明： 要約データを表示するために使用されます
*
-->
<template>
    <div>
    <h1 class="p-pageTitle">{{$t('app.CtmCst01D01.10000')}}</h1>
    <p class="p-pageSubText">{{$t('app.CtmCst01D01.10001')}}</p>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <div class="table-operator">
                    <a-row :gutter="24" >
                        <a-col :md="20" :sm="8">
                            <a-form-item 
                            :label="this.$t('app.CtmCst01D01.10002')" 
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                            {{"2021/02/02"}}
                            </a-form-item>
                        </a-col>
                        <a-col :md="4" :sm="8" class="row-right-button">
                            <a-button style="" icon="printer" @click="searchQuery" />
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

            </a-table>
        </div>
        <!-- table区域-end -->
    </a-card>  
    </div>
</template>

<script>
import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
export default {
        name: "CtmCst01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput
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
                        // コンテナNo.
                        title: this.$t('app.CtmCst01D01.10003'),
                        align: "center",
                        dataIndex: 'containerNo',
                        width: 200,
                        scopedSlots: {customRender: 'containerNo'},
                    },
                    {
                        // コンピュータ在庫
                        title: this.$t('app.CtmCst01D01.10004'),
                        align: "center",
                        dataIndex: 'computerZaiko',
                        width: 250,
                        scopedSlots: {customRender: 'computerZaiko'},
                    },
                    {
                        // 現在庫
                        title: this.$t('app.CtmCst01D01.10005'),
                        align: "center",
                        children: [
                            {
                                dataIndex: 'zaiko1',
                                align: 'center',
                            },
                            {
                                dataIndex: 'zaiko2',
                                align: 'center',
                            },
                            {
                                dataIndex: 'zaiko3',
                                align: 'center',
                            },
                            {
                                dataIndex: 'zaiko4',
                                align: 'center',
                            },
                            {
                                dataIndex: 'zaiko5',
                                align: 'center',
                            }
                        ]
                    }
                ],
                url: {
                    
                },
                dataSource1:[{
                        containerNo: "83001",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83002",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83003",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83004",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83005",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83006",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83007",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83008",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83009",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    },
                    {
                        containerNo: "83010",
                        computerZaiko: "99999999",
                        zaiko1: "OKA",
                        zaiko2: "CST",
                        zaiko3: "OKA",
                        zaiko4: "OKA",
                        zaiko5: "OKA"
                    }],
            }
        },
        computed: {
            
        },
        methods: {
            onSearchModel(){
                
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
