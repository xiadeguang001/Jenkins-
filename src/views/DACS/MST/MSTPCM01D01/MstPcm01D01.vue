<!--
*   
*   ページ： 【MST-PCM01D01】担当者マスタ保守画面
*   説明： 担当者マスタ保守（一覧画面）
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.MstPcm01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.MstPcm01D01.10001')}}</p>

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
        
        <mst-Pcm-01-d-03 ref="modalForm" @ok="modalFormOk"></mst-Pcm-01-d-03>
        <mst-Pcm-01-d-02 ref="MstPcm01D02" @ok="searchOk"></mst-Pcm-01-d-02>
    </a-card>  
    </div>
</template>


<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import MstPcm01D03 from './MstPcm01D03'; 
import MstPcm01D02 from './MstPcm01D02';
    export default {
        name: "MstPcm01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            MstPcm01D03,
            MstPcm01D02
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
                        // 担当者コード
                        title: this.$t('app.MstPcm01D01.10003'),
                        align: "center",
                        dataIndex: 'chargepersoncd',
                        width:150,
                    },
                    {
                        //担当者名
                        title: this.$t('app.MstPcm01D01.10004'),
                        align: "left",
                        dataIndex: 'chargepersonnm'
                    },
                    {
                        // パスワード
                        title: this.$t('app.MstPcm01D01.10005'),
                        align: "center",
                        dataIndex: 'password',
                    },
                    {
                        // 権限コード
                        title: this.$t('app.MstPcm01D01.10006'),
                        align: "center",
                        dataIndex: 'authority',
                    },
                    {
                        // 所属店
                        title: this.$t('app.MstPcm01D01.10007'),
                        align: "left",
                        dataIndex: 'affiliationstore',
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
                        chargepersoncd: "00000000",
                        chargepersonnm: "田中　馬場",
                        password: "014asd",
                        authority: "02",
                        affiliationstore: "0010 福岡",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000000",
                        chargepersonnm: "田中　馬場",
                        password: "014asd",
                        authority: "02",
                        affiliationstore: "0010 福岡",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000000",
                        chargepersonnm: "田中　馬場",
                        password: "014asd",
                        authority: "02",
                        affiliationstore: "0010 福岡",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    {
                        chargepersoncd: "00000000",
                        chargepersonnm: "田中　馬場",
                        password: "014asd",
                        authority: "02",
                        affiliationstore: "0010 福岡",
                    },
                    {
                        chargepersoncd: "00000123",
                        chargepersonnm: "鈴木　愛知",
                        password: "014aswqed",
                        authority: "12",
                        affiliationstore: "0014 東京",
                    },
                    {
                        chargepersoncd: "02310123",
                        chargepersonnm: "菊池　菜々子",
                        password: "014aswqed",
                        authority: "92",
                        affiliationstore: "0023 品川",
                    },
                    
                    
                ],
            }
        },
        computed: {
            
        },
        methods: {

            resetClick(){
                this.chargepersoncd = "";
                this.chargepersonnm = "";
                this.password = "";
                this.authority = "";
                this.affiliationstore = "";
            },
            onSearchModel(){
                this.$refs.MstPcm01D02.edit(this.queryParam);
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