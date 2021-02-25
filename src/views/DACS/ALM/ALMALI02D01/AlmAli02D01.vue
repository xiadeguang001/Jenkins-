<!--
*   
*   ページ： 航空便積込問合集計せlist
*   説明： 要約データを表示するために使用されます
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.AlmAli02D01.10005')}}</h1>
        <p class="p-pageSubText">{{$t('app.AlmAli02D01.10006')}}</p>
        <a-card :bordered="false">
            <!-- クエリエリア -->
            <div class="table-page-search-wrapper">
                <a-form layout="inline" @keyup.enter.native="searchQuery">
                    <!-- 检索 -->
                    
                    <div class="table-operator">
                        <a-row :gutter="24" >
                            <a-col :md="24" :sm="8" class="row-right-button">
                                <a-button style="" icon="zoom-in" @click="onSearchModel" />
                            </a-col>
                        </a-row>
                    </div>
                </a-form>
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

            <alm-ali-02-d-02 ref="AlmAli02D02" @ok="searchOk"> </alm-ali-02-d-02>
        </a-card>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import AlmAli02D02 from './AlmAli02D02';
    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            attrs: {},
        };
        if (index >= 15 && index < 20) {
            obj.attrs.colSpan = 0;
        }
        
        return obj;
    };
    const render20Content = (value, row, index) => {
        const obj = {
            children: value,
            attrs: {},
        };
        if (index === 19) {
            obj.attrs.colSpan = 0;
        }
        
        return obj;
    };
    export default {
        name: "ALMALI02D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            AlmAli02D02,
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                blCode:"",// blcode
                blName:"",// bl名前
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
                        dataIndex: 'noIndex',
                        key:'0',
                        width:40,
                        align:"center",
                        customRender:function (text, record, index) {
                            if (index < 15){
                                return parseInt(index)+1;
                            }else{
                                return {
                                    children:<div align="right"> {text}</div>,
                                    attrs: {
                                        colSpan: 3,
                                    }
                                }
                                
                            }
                            
                        }
                    },
                    {
                        key:'1',
                        title: "BLNo.",
                        align: "center",
                        dataIndex: 'blno',
                        width:200,
                        customRender:function (text, record, index) {
                        
                            if (index < 15){
                                return text;
                            }else{
                                if ( index < 19 && index > 14){
                                    return {
                                        children:<div align="right"> {text}</div>
                                    }
                                }
                                return {
                                    
                                    attrs: {
                                        colSpan: 0,
                                    }
                                }
                                
                            }
                            
                        }
                    },
                    {
                        key:'2',
                        title: this.$t('app.AlmAli01D01.10014'),
                        align: "center",
                        dataIndex: 'contno',
                        customRender:function (text, record, index) {
                        
                            if (index < 15){
                                return text;
                            }else{
                                if ( index < 19 && index > 14){
                                    return {
                                        children:<div align="right"> {text}</div>
                                    }
                                }
                                return {
                                    children:<div align="right"> {text}</div>,
                                    attrs: {
                                        colSpan: 8,
                                    }
                                }
                                
                            }
                            
                        }
                    },
                    {
                        
                        title: this.$t('app.AlmAli02D01.10000'),
                        customRender: renderContent,
                        children:[
                            {
                                key:'3',
                                title: this.$t('app.AlmAli02D01.10001'),
                                align: "right",
                                dataIndex: 'jytct',
                                width: 120,
                                customRender:render20Content
                            },
                            {
                                key:'4',
                                title: this.$t('app.AlmAli01D01.10008'),
                                align: "right",
                                dataIndex: 'nkkosu',
                                width: 120,
                                customRender:render20Content
                            },
                            {
                                key:'5',
                                title: this.$t('app.AlmAli01D01.10009'),
                                align: "right",
                                dataIndex: 'wt',
                                width: 120,
                                customRender:render20Content
                            }
                        ]
                    },
                    {
                        
                        title: this.$t('app.AlmAli02D01.10002'),
                        customRender: renderContent,
                        children:[
                            {
                                key:'6',
                                title: this.$t('app.AlmAli02D01.10001'),
                                align: "right",
                                dataIndex: 'jytct2',
                                width: 120,
                                customRender:render20Content
                            },
                            {
                                key:'7',
                                title: this.$t('app.AlmAli01D01.10008'),
                                align: "right",
                                dataIndex: 'jytct2',
                                width: 120,
                                customRender:render20Content
                            },
                            {
                                key:'8',
                                title: this.$t('app.AlmAli01D01.10009'),
                                align: "right",
                                dataIndex: 'wt2',
                                width: 120,
                                customRender:render20Content
                            }
                        ]
                    },
                    {
                        // 件数比率
                        title: this.$t('app.AlmAli02D01.10003'),
                        width:100,
                        align: "right",
                        dataIndex: 'norate',
                        customRender: renderContent

                    },
                    {
                        //航空料
                        title: this.$t('app.AlmAli02D01.10004'),
                        width: 200,
                        align: "right",
                        dataIndex: 'kokuryo',
                        customRender: renderContent
                    },
                
                ],
                url: {
                    list: "",
                },
                dataSource1:[
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },

                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"s便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"その他",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"合計",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"ＢＬ支払い金額",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },

                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },

                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },

                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
                    },
                    {
                        noIndex:"r便",
                        blno:"00002121220033231",
                        contno:"00001",
                        jytct:178,
                        nkkosu:181,
                        wt:124,
                        jytct2:178,
                        nkkosu2:181,
                        wt2:124,
                        norate:23.9,
                        kokuryo:5256
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
            onSearchModel(){
                this.$refs.AlmAli02D02.edit();
            },
            searchOk(){

            }
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>