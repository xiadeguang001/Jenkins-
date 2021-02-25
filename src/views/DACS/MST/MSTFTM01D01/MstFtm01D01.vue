<!--
*   
*   ページ： 【MST-FTM01D01】運賃種別マスタ保守画面
*   説明： 　明細一覧表示画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstFtm01D01.10000')}}</h1>
            <p class="p-pageSubText">{{$t('app.MstFtm01D01.10009')}}</p>
    <a-card :bordered="false">
        <!-- クエリエリア -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline"  @keyup.enter.native="searchQuery">
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

                <span slot="kanritencd" slot-scope="text, record">
                    <a @click="manageGoodsEdit(record)" > {{record.kanritencd + record.kanritennm}}</a>                
                </span>

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
        
        <mst-ftm-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-ftm-01-d-03> 
        <mst-ftm-01-d-02 ref="MstFtm01D02" @ok="searchOk"></mst-ftm-01-d-02> 
    </a-card>  
    </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstFtm01D03 from './MstFtm01D03'; 
import MstFtm01D02 from './MstFtm01D02';
    export default {
        name: "MstFtm01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstFtm01D02,
            MstFtm01D03
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                blcarriercd:"",
                goodsnm:"",
                goodscode:"",

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
                        title: this.$t('app.MstFtm01D01.10001'),
                        align: "center",
                        width:300,
                        dataIndex: 'blcarriercd',
                    },
                    {
                        // 運賃種別
                        title: this.$t('app.MstFtm01D01.10002'),
                        align: "center",
                      
                        dataIndex: 'goodscode',
                    },
                    {
                        // 運賃種別名
                        title: this.$t('app.MstFtm01D01.10003'),
                        align: "center",
                        width:800,
                        dataIndex: 'goodsnm',
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
                        goodscode: "01",
                        goodsnm:"一般",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "02",
                        goodsnm:"一般",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "03",
                        goodsnm:"特定品目",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "04",
                        goodsnm:"品目分類",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "05",
                        goodsnm:"引越貨物",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "06",
                        goodsnm:"年末年始",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "07",
                        goodsnm:"一般",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                        goodsnm:"一般",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                        goodsnm:"一般",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                        goodsnm:"一般",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                        goodsnm:"一般",
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
            },
            onSearchModel(){
                this.$refs.MstFtm01D02.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            },

            manageGoodsEdit(record){
                this.$refs.MstFtm01D01.edit(record);
            },

        }

    }

</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>