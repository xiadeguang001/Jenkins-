<!--
*   
*   ページ： 【MST-ITM01D01】品目マスタ保守
*   説明： 　明細一覧表示画面
*
-->


<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstItm01D01.10000')}}</h1>
          <p class="p-pageSubText">{{$t('app.MstItm01D01.100010')}}</p>
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
                 
                <mst-itm-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-itm-01-d-03>   
                <mst-itm-01-d-02 ref="MstItm01D02" @ok="searchOk"></mst-itm-01-d-02>  
            </a-card>  
        </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstItm01D03 from './MstItm01D03'; 
import MstItm01D02 from './MstItm01D02';
    export default {
        name: "MstItm01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstItm01D02,
            MstItm01D03
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                blcarriercd:"",
                goodscode: "",
                goodsnm: "",
                freightrate:"",

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
                        // ＢＬキャリア
                        title: this.$t('app.MstItm01D01.10001'),
                        align: "center",
                        dataIndex: 'blcarriercd',
                    },
                    {
                        // 品目コード
                        title: this.$t('app.MstItm01D01.10002'),
                        align: "center",
                        dataIndex: 'goodscode',
                    },
                    {
                        // 品目名
                        title: this.$t('app.MstItm01D01.10003'),
                        align: "left",
                        dataIndex: 'goodsnm',
                    },
                    {
                        // 運賃掛率
                        title: this.$t('app.MstItm01D01.10004'),
                        align: "right",
                        dataIndex: 'freightrate',
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
                        blcarriercd: "JAL",
                        goodscode: "13",
                        goodsnm: "さつま揚げ",
                        freightrate:"100%"
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "1A",
                        goodsnm: "一般混載",
                        freightrate:"100%"
                    },
                    {
                       blcarriercd: "JAL",
                        goodscode: "1B",
                        goodsnm: "魚介類混載",
                        freightrate:"100%"
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "2A",
                        goodsnm: "果実·野菜類混載",
                        freightrate:"100%"
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "3B",
                        goodsnm: "宅配貨物",
                        freightrate:"100%"
                    },
                    {
                       blcarriercd: "JAL",
                        goodscode: "3A",
                        goodsnm: "書類·印刷物·出版物",
                        freightrate:"100%"
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "2B",
                        goodsnm: "新聞",
                        freightrate:"100%"
                    },
                    {
                       blcarriercd: "JAL",
                        goodscode: "1C",
                        goodsnm: "機械·器具·部品",
                        freightrate:"100%"
                    },
                    {
                       blcarriercd: "JAL",
                        goodscode: "3E",
                        goodsnm: "衣料品",
                        freightrate:"100%"
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "3F",
                        goodsnm: "衣料品",
                        freightrate:"100%"
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "2D",
                        goodsnm: "機械·器具·部品",
                        freightrate:"100%"
                    },

                  
                ],
            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){
                this.blcarriercd = "";
                this.goodscode = "";
                this.goodsnm = "";
                this.freightrate="";
            },
            onSearchModel(){
                this.$refs.MstItm01D02.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            },

            manageGoodsEdit(record){
                this.$refs.MstItm01D01.edit(record);
            },

        }

    }

</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>