<!--
*   
*   ページ： 【MST-FTA01D01】運賃種別適用マスタ保守画面
*   説明： 運賃種別適用マスタ保守（一覧画面）
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstFta01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.MstFta01D01.10001')}}</p>

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
        
        <mst-Fta-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-Fta-01-d-03>
        <mst-Fta-01-d-02 ref="MstFta01D02" @ok="searchOk"></mst-Fta-01-d-02>
    </a-card>  
    </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstFta01D03 from './MstFta01D03'; 
import MstFta01D02 from './MstFta01D02';
    export default {
        name: "MstFta01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstFta01D03,
            MstFta01D02
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                carriercd: "",
                fareType: "",
                startDate: "",
                flightDepartureTimeFrom: "",
                flightDepartureTimeTo: "",
                weightFrom: "",
                weightTo: "",
                discountRate: "",
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
                        title: this.$t('app.MstFta01D01.10002'),
                        align: "center",
                        dataIndex: 'carriercd',
                        width:150,
                    },
                    {
                        // 運賃種別
                        title: this.$t('app.MstFta01D01.10003'),
                        align: "center",
                        dataIndex: 'fareType',
                        width:150,
                    },
                    {
                        //適用開始日
                        title: this.$t('app.MstFta01D01.10004'),
                        align: "center",
                        dataIndex: 'startDate',
                        width:120,
                    },
                    {
                        // フライト発時刻
                        title: this.$t('app.MstFta01D01.10005'),
                        align: "center",
                        // dataIndex: 'flightDepartureTime',
                        customRender: (text, record, index) => {
                            return record.flightDepartureTimeFrom + this.$t('app.MstFta01D01.10010') + record.flightDepartureTimeTo;
                        },
                    },
                    {
                        // 重量
                        title: this.$t('app.MstFta01D01.10006'),
                        align: "center",
                        // dataIndex: 'weight',
                        customRender: (text, record, index) => {
                            return record.weightFrom + this.$t('app.MstFta01D01.10008') 
                            + this.$t('app.MstFta01D01.10010') + record.weightTo + this.$t('app.MstFta01D01.10008');
                        },
                    },
                    {
                        // 割引率
                        title: this.$t('app.MstFta01D01.10007'),
                        align: "right",
                        // dataIndex: 'discountRate',
                        customRender: (text, record, index) => {
                            return record.discountRate + this.$t('app.MstFta01D01.10009');
                        },
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
                    // list: "/dacs/dairitenMaintenance/list",
                },
                //ダミーデータ　表示用
                dataSource1:[
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    {
                        carriercd: "JAL",
                        fareType: "一般",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "00:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "120",
                        weightTo: "99999",
                        discountRate: "1",
                    },
                    {
                        carriercd: "ANA",
                        fareType: "特定品目",
                        startDate: "2020-01-20",
                        flightDepartureTimeFrom: "21:00",
                        flightDepartureTimeTo: "22:30",
                        weightFrom: "150",
                        weightTo: "99999",
                        discountRate: "10",
                    },
                    {
                        carriercd: "JTL",
                        fareType: "引越商品",
                        startDate: "2020-12-12",
                        flightDepartureTimeFrom: "11:00",
                        flightDepartureTimeTo: "23:59",
                        weightFrom: "1",
                        weightTo: "9",
                        discountRate: "100",
                    },
                    
                    
                   
                    
                    
                ],
            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){
                this.carriercd = "";
                this.fareType = "";
                this.startDate = "";
                this.flightDepartureTimeFrom = "";
                this.flightDepartureTimeTo = "";
                this.weightFrom = "";
                this.weightTo = "";
                this.discountRate = "";
            },
            onSearchModel(){
                this.$refs.MstFta01D02.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            },
        }

    }

</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>