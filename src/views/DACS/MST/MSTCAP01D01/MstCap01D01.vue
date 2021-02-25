<!--
*   
*   页面： MST-CAP01D01】キャリア施策マスタ保守画面
*   描述： 明細一覧表示画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstCap01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.MstCap01D01.10001')}}</p>
    <a-card :bordered="false">
        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <!-- 新增 -->

                <div class="table-operator">
                    <a-row :gutter="24" >
                        <a-col :md="22" :sm="8">
                            <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
                        </a-col>
                        <a-col :md="2" :sm="8" class="row-right-button">
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
        <mst-cap-01-d-02 ref="modalForm" @ok="modalFormOk"></mst-cap-01-d-02>
        <mst-cap-01-d-03 ref="MstCap01D03" @ok="searchOk"></mst-cap-01-d-03>
    </a-card>  
    </div>
</template>

<script>

import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

import MstCap01D02 from './MstCap01D02'; // 新增编辑页面
import MstCap01D03 from './MstCap01D03'; // 新增编辑页面
    export default {
        name: "MstCap01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstCap01D02,
            MstCap01D03,
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                firstflightnofrom:"",
                firstflightnoto:"",
                hinmkcd:"",
                startdate:"",
                division:"",
                weight1a:"",
                weight1b:"",
                weight2a:"",
                weight2b:"",
                weight3a:"",
                weight3b:"",
                note:"",
                carriercdnm:"",
                departairportcd:"",
                carriercd:"",
                arrivalairportcd:"",
                special: "", 
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
                        // キャリア
                        title: this.$t('app.MstCap01D01.10003'),
                        align: "center",
                        dataIndex: 'carriercd',
                    },
                    {
                        // 発空港
                        title: this.$t('app.MstCap01D01.10004'),
                        align: "center",
                        dataIndex: 'departairportcd',
                        // scopedSlots: {customRender: 'departairportcd'},
                    },
                    {
                        // 着空港
                        title: this.$t('app.MstCap01D01.10005'),
                        align: "center",
                        dataIndex: 'arrivalairportcd',
                        // scopedSlots: {customRender: 'arrivalairportcd'},
                    },
                    {
                        // 第1フライトNo
                        title: this.$t('app.MstCap01D01.10006'),
                        align: "center",
                        dataIndex: 'firstflightnofrom',
                        customRender: (text, record, index) => {
                            return record.firstflightnofrom+ " ～ " + record.firstflightnoto;
                        },
                    },
                    {
                        // 品目
                        title: this.$t('app.MstCap01D01.10007'),
                        align: "center",
                        dataIndex: 'hinmkcd'
                    },
                    {
                        // 特殊
                        title: this.$t('app.MstCap01D01.10008'),
                        align: "center",
                        dataIndex: 'special'
                    },
                    {
                        //適用開始日
                        title: this.$t('app.MstCap01D01.10009'),
                        align: "center",
                        dataIndex: 'startdate',
                        width: 120,
                    },
                    {
                        // 区分
                        title: this.$t('app.MstCap01D01.10010'),
                        align: "center",
                        dataIndex: 'division'
                    },
                    {
                        // 重量帯1
                        title: this.$t('app.MstCap01D01.10011'),
                        align: "center",
                        children: [
                            {
                                dataIndex: 'weight1a',
                                align: 'center',
                                customRender: (text, record, index) => {
                                    return record.weight1a ? record.weight1a + "Kg" : "";
                                },
                            },
                            {
                                dataIndex: 'weight1b',
                                align: 'center',
                            }
                        ]
                    },
                    {
                        // 重量帯2
                        title: this.$t('app.MstCap01D01.10012'),
                        align: "center",
                        children: [
                            {
                                dataIndex: 'weight2a',
                                align: 'center',
                                customRender: (text, record, index) => {
                                    return record.weight2a ? record.weight2a + "Kg" : "";
                                },
                            },
                            {
                                dataIndex: 'weight2b',
                                align: 'center',
                            }
                        ]
                    },
                    {
                        // 重量帯3
                        title: this.$t('app.MstCap01D01.10013'),
                        align: "center",
                        children: [
                            {
                                dataIndex: 'weight3a',
                                align: 'center',
                                customRender: (text, record, index) => {
                                    return record.weight3a ? record.weight3a + "Kg" : "";
                                },
                            },
                            {
                                dataIndex: 'weight3b',
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
                    //list: "/dacs/careerMeasures/list",
                },
                
                dataSource1:[
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "81.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "105.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },{
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "81.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "105.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },{
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "81.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "105.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },{
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "81.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "105.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },{
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "81.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "105.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },{
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "5B",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "81.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "105.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },
                    {
                        carriercd: "JAL",
                        departairportcd: "AKJ",
                        arrivalairportcd: "HND",
                        firstflightnofrom: "0000",
                        firstflightnoto: "9999",
                        hinmkcd: "8A",
                        special: "特殊5",
                        startdate: "2008-04-01",
                        division: "単価",
                        weight1a: "100",
                        weight1b: "77.0",
                        weight2a: "",
                        weight2b: "",
                        weight3a: "",
                        weight3b: "",

                    },  
                ],

            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){

            },
            onSearchModel(){
                this.$refs.MstCap01D03.edit(this.queryParam);
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