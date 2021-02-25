<!--
*   
*   ページ： 航空便積込修正せlist
*   説明： 要約データを表示するために使用されます
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.AlmAli01D01.10024')}}</h1>
        <p class="p-pageSubText">{{$t('app.AlmAli01D01.10025')}}</p>
        <a-card :bordered="false">
            <!-- クエリエリア -->
            <div class="table-page-search-wrapper">
                <a-form layout="inline" @keyup.enter.native="searchQuery">
                    <!-- 检索 -->
                    
                    <div class="table-operator">
                        <a-row :gutter="24" >
                            <a-col :md="12" :sm="8" >
                                <a-dropdown v-if="selectedRowKeys.length > 0">
                                    <a-menu slot="overlay">
                                    <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>{{$t('app.common.bulkDelete')}}</a-menu-item>
                                    <a-menu-item key="2" @click="batchEdit"><a-icon type="edit"/>{{$t('app.common.bulkEdit')}}</a-menu-item>
                                    </a-menu>
                                    <a-button style="margin-left: 8px"> {{$t('app.common.batchOperation')}} <a-icon type="down" /></a-button>
                                </a-dropdown>
                            </a-col>
                            <a-col :md="12" :sm="8" class="row-right-button">
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
                    :rowSelection="{columnWidth: 40, selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
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
            <alm-ali-03-d-03 ref="modalForm" @ok="modalFormOk"></alm-ali-03-d-03>
            <alm-ali-03-d-02 ref="AlmAli03D02" @ok="searchOk"> </alm-ali-03-d-02>
        </a-card>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import AlmAli03D02 from './AlmAli03D02';
import AlmAli03D03 from './AlmAli03D03';

    export default {
        name: "ALMALI05D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            AlmAli03D02,
            AlmAli03D03,
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
                        dataIndex: '',
                        key:'rowIndex',
                        width:40,
                        align:"center",
                        customRender:function (text, record, index) {
                            return parseInt(index)+1;
                        }
                    },
                    {
                        // 発送日時
                        title: this.$t('app.AlmAli01D01.10002'),
                        align: "center",
                        dataIndex: 'hasouhms',
                        width: 100
                    },
                    {
                        // お問合せ番号
                        title: this.$t('app.AlmAli01D01.10003'),
                        align: "center",
                        dataIndex: 'queno',
                        width: 200,
                    },
                    
                    {
                        // 便種
                        title: this.$t('app.AlmAli01D01.10005'),
                        width: 100,
                        align: "center",
                        dataIndex: 'kokubs'
                    },
                    
                    {
                        //着空港
                        title: this.$t('app.AlmAli01D01.10007'),
                        width: 60,
                        align: "center",
                        dataIndex: 'chakukuko'
                    },
                    {
                        // 個数
                        title: this.$t('app.AlmAli01D01.10008'),
                        align: "center",
                        width: 80,
                        dataIndex: 'receiveNumb'
                    },
                    {
                        // 重量
                        title: this.$t('app.AlmAli01D01.10009'),
                        align: "right",
                        width: 80,
                        dataIndex: 'jyuryo'
                    },
                    {
                        // Fキャリア
                        title: this.$t('app.AlmAli01D01.10010'),
                        align: "center",
                        width: 80,
                        dataIndex: 'blcarriercd'
                    },
                    {
                        // フライト
                        title: this.$t('app.AlmAli01D01.10011'),
                        align: "center",
                        width: 80,
                        dataIndex: 'fflightno1'
                    },
                    {
                        // 出発
                        title: this.$t('app.AlmAli01D01.10012'),
                        align: "center",
                        width: 80,
                        dataIndex: 'hatuhms'
                    },
                    {
                        // 到着
                        title: this.$t('app.AlmAli01D01.10013'),
                        align: "center",
                        width: 80,
                        dataIndex: 'chakuhms'
                    },
                    {
                        // コンテナ
                        title: this.$t('app.AlmAli01D01.10014'),
                        align: "center",
                        width: 80,
                        dataIndex: 'contno'
                    },
                    {
                        // blno
                        title: this.$t('app.AlmAli01D01.10035'),
                        align: "center",
                        width: 80,
                        dataIndex: 'blno'
                    },
                    {
                        // PDTNo.
                        title: this.$t('app.AlmAli01D01.10034'),
                        align: "center",
                        width: 80,
                        dataIndex: 'pdtno'
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
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
                    },{
                        hasouhms:"2021/01/29",
                        queno:"0000291890223",
                        sendShop:"羽田",
                        kokubs:"s便",
                        receiveShop:"北見",
                        chakukuko:"千歳",
                        receiveNumb:"1/2",
                        jyuryo:"20",
                        blcarriercd:"ANA",
                        fflightno1:"0059",
                        hatuhms:"10:00",
                        chakuhms:"20:00",
                        contno:"43735",
                        blno:"000069024362",
                        pdtno:"700398765"
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
                this.$refs.AlmAli03D02.edit();
            },
            searchOk(){

            },
            batchEdit(){

            }
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>