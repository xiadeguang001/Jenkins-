<!--
*   
*   页面： 「コンテナ在庫問合せ」明細入力画面
*
-->
<template>
    <a-drawer
        :title="title"
        :width="drawerWidth"
        :maskClosable="true"
        @close="handleCancel"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">

        <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    
                    <a-form-item 
                        :label="this.$t('app.CtmChc01D01.10000')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        {{container}}
                    </a-form-item>
                </a-form>
                <div>&nbsp;</div>
                <!-- table区域-begin -->
                <div >
                    <a-table
                        ref="table"
                        bordered
                        size="middle"
                        :rowKey="(record,index)=>{return index}"
                        :columns="columns"
                        :dataSource="dataSource"
                        :pagination="ipagination"
                        :loading="loading"
                        :scroll="{x:900}"
                        :rowClassName="InterlaceDiscoloration"
                        @change="handleTableChange">

                    </a-table>
                </div>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleOk" :loading="confirmLoading" :disabled="disableSubmit" icon="close-square">閉じる</a-button>
        </div>

    </a-drawer>
</template>

<script>
    
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import moment from 'moment' 

    import {JeecgListMixin} from '@/mixins/JeecgListMixin'

    export default {
        name: "CtmCvi01D02",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data () {
        return {
            drawerWidth: 1000,
            title:this.$t('app.common.search'),
            container:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
            confirmLoading: false,
            form: this.$form.createForm(this),
            iconChooseVisible: false,
            validateStatus:"",
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
                        // フライト日
                        title: this.$t('app.CtmChc01D01.10001'),
                        align: "center",
                        dataIndex: 'flightday',
                        width: 60,
                        scopedSlots: {customRender: 'flightday'},
                    },
                    {
                        // 出発
                        title: this.$t('app.CtmChc01D01.10002'),
                        align: "center",
                        children: [
                            {
                                // Fキャリア
                                title: this.$t('app.CtmChc01D01.10004'),
                                dataIndex: 'carriercd1',
                                align: 'center',
                            },
                            {
                                // フライト
                                title: this.$t('app.CtmChc01D01.10005'),
                                dataIndex: 'flight1',
                                align: 'center',
                            },
                            {
                                // 空港
                                title: this.$t('app.CtmChc01D01.10006'),
                                dataIndex: 'airport1',
                                align: 'center',
                            }
                        ]
                    },
                    {
                        // 到着
                        title: this.$t('app.CtmChc01D01.10003'),
                        align: "center",
                        children: [
                            {
                                // Fキャリア
                                title: this.$t('app.CtmChc01D01.10004'),
                                dataIndex: 'carriercd2',
                                align: 'center',
                            },
                            {
                                // フライト
                                title: this.$t('app.CtmChc01D01.10005'),
                                dataIndex: 'flight2',
                                align: 'center',
                            },
                            {
                                // 空港
                                title: this.$t('app.CtmChc01D01.10006'),
                                dataIndex: 'airport2',
                                align: 'center',
                            }
                        ]
                    }
                    
                ],
                dataSource:[{
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/29",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0001",
                        flight2: "0002",
                        airport1: "KUA",
                        airport2: "CTS",
                        flightday:"2021/01/28",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0003",
                        flight2: "0003",
                        airport1: "HND",
                        airport2: "MMY",
                        flightday:"2021/01/27",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0004",
                        flight2: "0004",
                        airport1: "HND",
                        airport2: "MMY",
                        flightday:"2021/01/26",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0005",
                        flight2: "0005",
                        airport1: "HND",
                        airport2: "MMY",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0006",
                        flight2: "0006",
                        airport1: "KUA",
                        airport2: "MMY",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },
                    {
                        carriercd1: "JAL",
                        carriercd2: "AKJ",
                        flight1: "0000",
                        flight2: "0000",
                        airport1: "",
                        airport2: "",
                        flightday:"2021/01/25",
                    },],
                url:{
                    list:"",
                },
                ipagination: {
                    current: 1,
                    pageSize: 15,
                    pageSizeOptions: ['5', '10', '15'],
                },   
        }
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.container = this.model.container;
                this.visible = true;
                console.log(record);
            },
            close () {
                this.visible = false;
            },
            handleOk () {
                this.close();
            },
            handleCancel () {
                this.close();
            },
            // 根据屏幕变化,设置抽屉尺寸
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 400){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 1000;
                }
            }
        }
    }
</script>

<style scoped>

</style>