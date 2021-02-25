<!--
*   
*   ページ： 【MST-STM01D01】店マスタ保守画面
*   説明： 店マスタ保守（一覧画面）
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstStm01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.MstStm01D01.10001')}}</p>

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
        
        <mst-Stm-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-Stm-01-d-03>
        <mst-Stm-01-d-02 ref="MstStm01D02" @ok="searchOk"></mst-Stm-01-d-02>
    </a-card>  
    </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstStm01D03 from './MstStm01D03'; 
import MstStm01D02 from './MstStm01D02';
    export default {
        name: "MstStm01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstStm01D03,
            MstStm01D02
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
                        // 店コード
                        title: this.$t('app.MstStm01D01.10003'),
                        align: "center",
                        dataIndex: 'storecd',
                        width:150,
                    },
                    {
                        //店名称
                        title: this.$t('app.MstStm01D01.10004'),
                        align: "left",
                        dataIndex: 'storenm'
                    },
                    {
                        // 地帯
                        title: this.$t('app.MstStm01D01.10005'),
                        align: "center",
                        dataIndex: 'area',
                    },
                    {
                        // 都道府県
                        title: this.$t('app.MstStm01D01.10006'),
                        align: "center",
                        dataIndex: 'prefectures',
                    },
                    {
                        // 計上店コード
                        title: this.$t('app.MstStm01D01.10007'),
                        align: "center",
                        dataIndex: 'accountstorecd',
                        width:150,
                    },
                    {
                        // 計上店名称
                        title: this.$t('app.MstStm01D01.10008'),
                        align: "left",
                        dataIndex: 'accountstorenm',
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
                        storecd: "0010",
                        storenm: "福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0010",
                        accountstorenm: "福岡",
                    },
                    {
                        storecd: "0011",
                        storenm: "北九州",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0011",
                        accountstorenm: "北九州",
                    },
                    {
                        storecd: "0012",
                        storenm: "東福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0012",
                        accountstorenm: "東福岡",
                    },
                    {
                        storecd: "0013",
                        storenm: "八代",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0013",
                        accountstorenm: "八代",
                    },
                    {
                        storecd: "0010",
                        storenm: "福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0010",
                        accountstorenm: "福岡",
                    },
                    {
                        storecd: "0011",
                        storenm: "北九州",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0011",
                        accountstorenm: "北九州",
                    },
                    {
                        storecd: "0012",
                        storenm: "東福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0012",
                        accountstorenm: "東福岡",
                    },
                    {
                        storecd: "0013",
                        storenm: "八代",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0013",
                        accountstorenm: "八代",
                    },
                    {
                        storecd: "0010",
                        storenm: "福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0010",
                        accountstorenm: "福岡",
                    },
                    {
                        storecd: "0011",
                        storenm: "北九州",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0011",
                        accountstorenm: "北九州",
                    },
                    {
                        storecd: "0012",
                        storenm: "東福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0012",
                        accountstorenm: "東福岡",
                    },
                    {
                        storecd: "0013",
                        storenm: "八代",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0013",
                        accountstorenm: "八代",
                    },
                    {
                        storecd: "0010",
                        storenm: "福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0010",
                        accountstorenm: "福岡",
                    },
                    {
                        storecd: "0011",
                        storenm: "北九州",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0011",
                        accountstorenm: "北九州",
                    },
                    {
                        storecd: "0012",
                        storenm: "東福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0012",
                        accountstorenm: "東福岡",
                    },
                    {
                        storecd: "0013",
                        storenm: "八代",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0013",
                        accountstorenm: "八代",
                    },
                    {
                        storecd: "0010",
                        storenm: "福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0010",
                        accountstorenm: "福岡",
                    },
                    {
                        storecd: "0011",
                        storenm: "北九州",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0011",
                        accountstorenm: "北九州",
                    },
                    {
                        storecd: "0012",
                        storenm: "東福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0012",
                        accountstorenm: "東福岡",
                    },
                    {
                        storecd: "0013",
                        storenm: "八代",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0013",
                        accountstorenm: "八代",
                    },
                    {
                        storecd: "0010",
                        storenm: "福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0010",
                        accountstorenm: "福岡",
                    },
                    {
                        storecd: "0011",
                        storenm: "北九州",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0011",
                        accountstorenm: "北九州",
                    },
                    {
                        storecd: "0012",
                        storenm: "東福岡",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0012",
                        accountstorenm: "東福岡",
                    },
                    {
                        storecd: "0013",
                        storenm: "八代",
                        area: "北九州",
                        prefectures: "福岡県",
                        accountstorecd: "0013",
                        accountstorenm: "八代",
                    },
                    
                ],
            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){
                this.storecd = "";
                this.storenm = "";
                this.area = "";
                this.prefectures = "";
                this.accountstorecd = "";
                this.accountstorenm = "";
            },
            onSearchModel(){
                this.$refs.MstStm01D02.edit(this.queryParam);
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