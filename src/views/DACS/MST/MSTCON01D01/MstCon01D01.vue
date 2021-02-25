<!--
*   
*   ページ： 【MST-CON01D01】コンテナタイプマスタ保守画面
*   説明： 　明細一覧表示画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstFtm01D01.10000')}}</h1>
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
        
        <mst-con-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-con-01-d-03> 
        <mst-con-01-d-02 ref="MstCon01D02" @ok="searchOk"></mst-con-01-d-02> 
    </a-card>  
    </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstCon01D03 from './MstCon01D03'; 
import MstCon01D02 from './MstCon01D02';
    export default {
        name: "MstCon01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstCon01D02,
            MstCon01D03
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
                        title: this.$t('app.MstCon01D01.10000'),
                        align: "center",
                        dataIndex: 'blcarriercd',
                    },
                    {
                        // 運賃種別
                        title: this.$t('app.MstCon01D01.10001'),
                        align: "center",
                      
                        dataIndex: 'goodscode',
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
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "02",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "03",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "04",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "05",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "06",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "07",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
                    },
                    {
                        blcarriercd: "JAL",
                        goodscode: "01",
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
                this.$refs.MstCon01D02.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            },

            manageGoodsEdit(record){
                this.$refs.MstCon01D01.edit(record);
            },

        }

    }

</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>