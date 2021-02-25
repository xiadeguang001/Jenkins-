<!--
*   
*   ページ： 発送連絡入力list
*   説明： 明細入力画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.SCM.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.SCM.10001')}}</p>
    <a-card :bordered="false">
        <!-- クエリエリア -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
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
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                :scroll="{x:1200}"
                :rowClassName="InterlaceDiscoloration"
                @change="handleTableChange">

                <span slot="kanritencd" slot-scope="text, record">
                    <a @click="manageShopEdit(record)" > {{record.kanritencd + record.kanritennm}}</a>                
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
        
        <!-- <mst-drt-01-d-02 ref="MstDrt01D02" @ok="selectBlOk"></mst-drt-01-d-02>
        <mst-drt-01-d-03 ref="MstDrt01D03" @ok="selectSendShopOk"></mst-drt-01-d-03>
        <mst-drt-01-d-04 ref="MstDrt01D04" @ok="managementFormOk"></mst-drt-01-d-04>
        <mst-drt-01-d-05 ref="modalForm" @ok="modalFormOk"></mst-drt-01-d-05>
        <mst-drt-01-d-06 ref="MstDrt01D06" @ok="searchOk"></mst-drt-01-d-06> -->
    </a-card>  
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
// import MstDrt01D02 from './MstDrt01D02'; //ＢＬキャリア選択
// import MstDrt01D03 from './MstDrt01D03'; // 発行店選択
// import MstDrt01D04 from './MstDrt01D04'; // 管理店詳細
// import MstDrt01D05 from './MstDrt01D05'; 
// import MstDrt01D06 from './MstDrt01D06';
    export default {
        name: "MstDrt01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            // MstDrt01D02,
            // MstDrt01D03,
            // MstDrt01D04,
            // MstDrt01D05,
            // MstDrt01D06
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                blCode:"",// 検索されたblcode
                blName:"",// 検索されたbl名
                blcarriercd:"",
                sendShop:"",// 検索されたディストリビューションストアコード
                sendShopDescription:"",// 検索された店舗の説明
                hakoutencd: "",
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
                        title: this.$t('app.SCM.ScmSci01D01.10000'),
                        align: "center",
                        dataIndex: 'dispkbn',
                        width: 100
                    },
                    {
                        
                        title: this.$t('app.SCM.ScmSci01D01.10001'),
                        align: "left",
                        dataIndex: 'CSTOPKBN',
                        width: 200,
                        customRender: (text, record, index) => {
                            return record.hakoutencd + record.airportnm;
                        }
                    },
                    {
                        
                        title: this.$t('app.AlmAli01D01.10016'),
                        align: "center",
                        width: 80,
                        dataIndex: 'hasouymd',
                    },
                    {
                        title: this.$t('app.SCM.ScmSci01D01.10002'),
                        align: "left",
                        dataIndex: 'blno',
                        width: 250,
                        scopedSlots: {customRender: 'kanritencd'},
                    },
                    {
                        title: this.$t('app.AlmAli01D01.10014'),
                        width: 100,
                        align: "center",
                        dataIndex: 'contno'
                    },
                    {
                        
                        title: this.$t('app.SCM.ScmSci01D01.10003'),
                        align: "left",
                        width: 250,
                        dataIndex: 'planflightno'
                    },
                    {
                        title: this.$t('app.SCM.ScmSci01D01.10004'),
                        width: 100,
                        align: "right",
                        dataIndex: 'comment1'
                    },
                    {
                        title: this.$t('app.SCM.ScmSci01D01.10005'),
                        align: "center",
                        dataIndex: 'comment2'
                    },
                    {
                        title: this.$t('app.AlmAli01D01.10005'),
                        align: "center",
                        dataIndex: 'kokubs'
                    },
                    {
                        title: this.$t('app.AlmAli01D01.10008'),
                        align: "center",
                        dataIndex: 'kosu'
                    },
                    {
                        title: this.$t('app.SCM.ScmSci01D01.10006'),
                        align: "center",
                        dataindex: 'deccarriercd'
                    },
                    {
                        title: this.$t('app.SCM.ScmSci01D01.10007'),
                        align: "center",
                        dataindex: 'decflightno'
                    },
                    {
                        title: this.$t('app.SCM.ScmSci01D01.10008'),
                        align: "center",
                        dataindex: 'conttype'
                    },
                    {
                        title: this.$t('app.AlmAli01D01.10009'),
                        align: "center",
                        dataindex: 'juryo'
                    },
                    {
                        // 処理
                        title: this.$t('app.MstDrt01D01.10010'),
                        dataIndex: 'action',
                        scopedSlots: {customRender: 'action'},
                        align: "center",
                        width: 100,
                    }
                ],
                url: {
                    list: "",
                },
            }
        },
        computed: {
            
        },
        methods: {
            // Blキャリア 搜索
            onSearchBl(){
                this.$refs.MstDrt01D02.add(this.blCode,this.blName);
            },

            selectBlOk(selectBlCode, selectblName){
                this.blCode = selectBlCode;
                this.blName = selectblName;
                this.blcarriercd = selectBlCode  + ":"+ selectblName
            },
            // 発行店搜索
            onSearchSendShop(){
                this.$refs.MstDrt01D03.add(this.sendShop,this.sendShopDescription);
            },
            selectSendShopOk(hakoutencd,hakoutennm){
                this.sendShop = hakoutencd;
                this.sendShopDescription = hakoutennm;
                this.hakoutencd = hakoutencd + ":" + hakoutennm;
            },
            manageShopEdit(record){
                this.$refs.MstDrt01D04.edit(record);
            },
            managementFormOk(){

            },
            resetClick(){
                this.blCode = "";
                this.blName = "";
                this.blcarriercd = "";
                this.sendShop = "";
                this.sendShopDescription = "";
                this.hakoutencd = "";
            },
            onSearchModel(){
                this.$refs.MstDrt01D06.edit(this.queryParam);
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