<!--
*   
*   ページ： フライト情報マスタ保守
*   説明： フライト情報保守を検索、新規、削除、編集することができます。
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.AlmAli04D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.AlmAli04D01.10001')}}</p>
        <a-card :bordered="false">
            <!-- クエリエリア -->
            <div class="table-page-search-wrapper">
                <a-form layout="inline" @keyup.enter.native="searchQuery">
                    <!-- 检索 -->
                    
                    <div class="table-operator">
                        <a-row :gutter="24" >
                            <a-col :md="20" :sm="8">
                                <a-button @click="handleAdd" type="primary" icon="plus">{{$t('app.common.add')}}</a-button>
                            </a-col>
                            <a-col :md="4" :sm="8" class="row-right-button">
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
            <alm-ali-04-d-03 ref="modalForm" @ok="modalFormOk"></alm-ali-04-d-03> 
            <alm-ali-04-d-02 ref="AlmAli04D02" @ok="searchOk"> </alm-ali-04-d-02> 
        </a-card>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import AlmAli04D02 from './AlmAli04D02';
import AlmAli04D03 from './AlmAli04D03';

    export default {
        name: "ALMALI04D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            AlmAli04D02,
            AlmAli04D03,
        },
        data() {
            return {
                description: this.$t('app.AlmAli04D01.10001'), // 航空便積込問合せ
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
                        
                        title: this.$t('app.AlmAli01D01.10011'),
                        align: "center",
                        dataIndex: 'fflightno1',
                    },
                    {
                        
                        title: this.$t('app.AlmAli04D01.10002'),
                        align: "center",
                        dataIndex: 'kishu',
                    },
                    
                    {
                        
                        title: this.$t('app.AlmAli01D01.10012') + "~" + this.$t('app.AlmAli01D01.10013'),
                        align: "center",
                        dataIndex: 'hatuchaku'
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
                        fflightno1:"1103",
                        kishu: "AB6",
                        hatuchaku: "07:40 ~ 09:15"
                    },
                    {
                        fflightno1:"1103",
                        kishu: "AB6",
                        hatuchaku: "07:40 ~ 09:15"
                    },{
                        fflightno1:"1103",
                        kishu: "AB6",
                        hatuchaku: "07:40 ~ 09:15"
                    },{
                        fflightno1:"1103",
                        kishu: "AB6",
                        hatuchaku: "07:40 ~ 09:15"
                    },{
                        fflightno1:"1103",
                        kishu: "AB6",
                        hatuchaku: "07:40 ~ 09:15"
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
                this.$refs.AlmAli04D02.edit();
            },
            searchOk(){

            }
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>