<!--
*   
*   ページ：全社メッセージメンテナンスlist
*   説明： 全社メッセージメンテナンス　明細一覧表示画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.AlmAli01D01.10027')}}</h1>
        <p class="p-pageSubText">{{$t('app.AlmAli01D01.10028')}}</p>
        <a-card :bordered="false">
            <!-- クエリエリア -->
            <div class="table-page-search-wrapper">
                <a-form layout="inline" @keyup.enter.native="searchQuery">
                    
                    <div class="table-operator">
                        <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
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
            <alm-ali-05-d-02 ref="modalForm" @ok="modalFormOk"></alm-ali-05-d-02>
            
        </a-card>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import AlmAli05D02 from './AlmAli05D02';

    export default {
        name: "ALMALI05D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            AlmAli05D02,
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
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
                        msg:"2"
                    },
                    { 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },{ 
                        ymd:"2021/01/29",
                        hm:"10:09",
                        msg:"2"
                    },
                ]
            }
        },
        computed: {
            
        },
        methods: {
        
            
        
            
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>