<!--
*   
*   ページ： ＢＬ在庫問合せlist
*   説明： ＢＬ在庫問合せ　一覧表示画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.BlmInv01D01.10004')}}</h1>
        <p class="p-pageSubText">{{$t('app.BlmInv01D01.10005')}}</p>
    <a-card :bordered="false">
        <!-- クエリエリア -->
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <!-- 新規 -->
                <div class="table-operator">
                    <a-row :gutter="24" >
                        <a-col :md="24" :sm="8" class="row-right-button">
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

                <span slot="blno" slot-scope="text, record">
                    <a @click="manageShopEdit(record)" > {{text}}</a>                
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
        
        <blm-inv-01-d-02 ref="BlmInv01D01" ></blm-inv-01-d-02>
        <blm-inv-01-d-03 ref="BlmInv01D03" ></blm-inv-01-d-03>
    </a-card>  
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import BlmInv01D02 from './BlmInv01D02';
import BlmInv01D03 from './BlmInv01D03';

    export default {
        name: "BlmInv01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            BlmInv01D02,
            BlmInv01D03,

        },
        data() {
            return {
                description: this.$t('app.label.user.view'),

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
                    
                        title: this.$t('app.AlmAli01D01.10035'),
                        align: "center",
                        dataIndex: 'blno',
                        width: 250,
                        scopedSlots: {customRender: 'blno'},
                    },
                    {
                        
                        title: this.$t('app.BlmInv01D01.10000'),
                        align: "center",
                        dataIndex: 'nyukoy',
                        width: 100,
                        
                    },
                    {
                
                        title: this.$t('app.BlmInv01D01.10001'),
                        align: "center",
                        width: 100,
                        dataIndex: 'shukoy',
                        
                    },
                    {
                        
                        title: this.$t('app.BlmInv01D01.10002'),
                        align: "left",
                        dataIndex: 'siyoy',
                        width: 100,
                
                    },
                    {
                        
                        title: this.$t('app.BlmInv01D01.10003'),
                        width: 100,
                        align: "center",
                        dataIndex: 'voidy'
                    },
                    {
                        
                        title: this.$t('app.BlmWhi01D01.10010'),
                        align: "left",
                        dataIndex: 'shukosaki'
                    },
                ],
                url: {
                    list: "",
                },
                dataSource1:[
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },

                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },

                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },

                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },

                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },

                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },

                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    {
                        blno:"000000002341",
                        nyukoy:"2020/03/08",
                        shukoy:"2021/01/09",
                        siyoy:"2021/01/29",
                        voidy:"",
                        shukosaki:"22312"
                    },
                    
                ]
            }
        },
        computed: {
            
        },
        methods: {

        
            manageShopEdit(record){
                this.$refs.BlmInv01D01.edit(record);
            },
            managementFormOk(){

            },
            resetClick(){
            
            },
            onSearchModel(){
                this.$refs.BlmInv01D03.edit();
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