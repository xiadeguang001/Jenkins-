<!--
*   
*   ページ： 【MST-CAM01D01】キャリアマスタ保守画面
*   説明： 要約データを表示するために使用されます
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstCam01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.MstCam01D01.10001')}}</p>

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
        
        <mst-cam-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-cam-01-d-03>
        <mst-cam-01-d-02 ref="MstCam01D02" @ok="searchOk"></mst-cam-01-d-02>
    </a-card>  
    </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstCam01D03 from './MstCam01D03'; 
import MstCam01D02 from './MstCam01D02';
    export default {
        name: "MstCam01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstCam01D03,
            MstCam01D02
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                carriercd:"",
                carriername:"",
                carriernameall:"",
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
                        // コード
                        title: this.$t('app.MstCam01D01.10002'),
                        align: "center",
                        dataIndex: 'carriercd',
                    },
                    {
                        //適用開始日
                        title: this.$t('app.MstCam01D01.10003'),
                        align: "center",
                        dataIndex: 'startdate',
                        width:120,
                    },
                    {
                        // キャリア名
                        title: this.$t('app.MstCam01D01.10004'),
                        align: "center",
                        dataIndex: 'carriername',
                    },
                    {
                        // キャリア名名称
                        title: this.$t('app.MstCam01D01.10005'),
                        align: "left",
                        dataIndex: 'carriernameall',
                    },
                    {
                        // ＢＬキャリア
                        title: this.$t('app.MstCam01D01.10006'),
                        align: "center",
                        dataIndex: 'blcarriercd',
                    },
                    {
                        // 運貸キャリア
                        title: this.$t('app.MstCam01D01.10007'),
                        align: "center",
                        dataIndex: 'transportcarriercd',
                    },
                    {
                        // 通信料
                        title: this.$t('app.MstCam01D01.10008'),
                        align: "center",
                        dataIndex: 'communicationcost',
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
                        carriercd: "01",
                        startdate: "2008-04-01",
                        carriername: "JAL",
                        carriernameall: "日本航空",
                        blcarriercd: "JAL",
                        transportcarriercd: "JAL",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "02",
                        startdate: "2008-04-01",
                        carriername: "ANA",
                        carriernameall: "全日本航空",
                        blcarriercd: "ANA",
                        transportcarriercd: "ANA",
                        communicationcost: "50",
                    },
                    {
                        carriercd: "03",
                        startdate: "2008-04-01",
                        carriername: "JAS",
                        carriernameall: "日本エアシステム",
                        blcarriercd: "JAL",
                        transportcarriercd: "JAL",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },{
                        carriercd: "01",
                        startdate: "2008-04-01",
                        carriername: "JAL",
                        carriernameall: "日本航空",
                        blcarriercd: "JAL",
                        transportcarriercd: "JAL",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "02",
                        startdate: "2008-04-01",
                        carriername: "ANA",
                        carriernameall: "全日本航空",
                        blcarriercd: "ANA",
                        transportcarriercd: "ANA",
                        communicationcost: "50",
                    },
                    {
                        carriercd: "03",
                        startdate: "2008-04-01",
                        carriername: "JAS",
                        carriernameall: "日本エアシステム",
                        blcarriercd: "JAL",
                        transportcarriercd: "JAL",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                    {
                        carriercd: "04",
                        startdate: "2008-04-01",
                        carriername: "JTA",
                        carriernameall: "日本ランスオーシャン",
                        blcarriercd: "JAL",
                        transportcarriercd: "JTA",
                        communicationcost: "0",
                    },
                ],
            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){
                this.carriercd = "";
                this.startdate = "";
                this.carriername = "";
                this.carriernameall = "";
                this.blcarriercd = "";
                this.transportcarriercd = "";
                this.communicationcost = "";
            },
            onSearchModel(){
                this.$refs.MstCam01D02.edit(this.queryParam);
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