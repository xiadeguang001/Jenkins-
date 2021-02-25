<!--
*   
*   ページ：便メッセージメンテナンスlist
*   説明： 便メッセージメンテナンス　明細一覧表示画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.AlmAli01D01.10032')}}</h1>
        <p class="p-pageSubText">{{$t('app.AlmAli01D01.10033')}}</p>
        <a-card :bordered="false">
            <!-- クエリエリア -->
            <div class="table-page-search-wrapper">
                <a-form layout="inline" @keyup.enter.native="searchQuery">
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

            <div class="table-operator">
                
            </div>

            <!-- table範囲-begin -->
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
            <!-- table範囲-end -->
            <alm-ali-06-d-02 ref="modalForm" @ok="modalFormOk"></alm-ali-06-d-02>
            <alm-ali-06-d-03 ref="AlmAli06D03" @ok="searchOk"></alm-ali-06-d-03>
        </a-card>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import AlmAli06D02 from './AlmAli06D02';
import AlmAli06D03 from './AlmAli06D03';

    export default {
        name: "ALMALI06D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            AlmAli06D02,
            AlmAli06D03,
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                blcarriercd:"",
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
                        // 年月日
                        title: this.$t('app.AlmAli01D01.10030'),
                        align: "center",
                        width:120,
                        dataIndex: 'ymd',
                        
                    },
                    {
                        
                        title: this.$t('app.AlmAli01D01.10029'),
                        align: "center",
                        width:80,
                        dataIndex: 'hm',
                        
                    },
                    
                    {
                        
                        title: this.$t('app.AlmAli01D01.10010'),
                        width: 120,
                        align: "center",
                        dataIndex: 'blcarriercd'
                    },
                    {
                        
                        title: this.$t('app.AlmAli01D01.10011'),
                        width: 120,
                        align: "center",
                        dataIndex: 'fflightno1'
                    },
                    {
                        // メッセージ
                        title: this.$t('app.AlmAli01D01.10031'),
                        align: "left",
                        dataIndex: 'msg'
                    },
                    
                    {
                        title: this.$t('app.common.operation'),
                        dataIndex: 'action',
                        align:"center",
                        width:100,
                        scopedSlots: { customRender: 'action' },
                    }
                
                ],
                url: {
                    list: "",
                },
                dataSource1:[
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },

                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        blcarriercd:"JAL",
                        fflightno1:"3251",
                        msg:"変更の読み込み"
                    },
                    
                ]
            }
        },
        computed: {
            
        },
        methods: {
        
            resetClick(){
                this.blCode = "";
                this.blName = "";
                this.blcarriercd = "";
                this.sendShop = "";
                this.sendShopDescription = "";
                this.hakoutencd = "";
            },
            
            searchOk(){

            },
            onSearchModel(){
                this.$refs.AlmAli06D03.edit();
            }
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>