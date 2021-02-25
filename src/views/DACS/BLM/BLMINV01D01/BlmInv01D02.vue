<!--
*   
*   ページ： ＢＬ在庫問合せ
*   説明： 　詳細内容表示画面
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

                    <a-form-item :label="$t('app.AlmAli01D01.10035')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <div> {{blno}}</div>
                    </a-form-item>
                </a-form>
                <div> &nbsp; </div>

                <!-- table範囲-begin -->
                <div >
                    
                    <a-table
                        ref="table"
                        bordered
                        size="middle"
                        :rowKey="(record,index)=>{return index}"
                        :columns="columns"
                        :dataSource="dataSource"
                        :pagination="false"
                        :loading="loading"
                        :rowClassName="InterlaceDiscoloration"
                        @change="handleTableChange">

                        <span slot="fflightno1" slot-scope="">
                            {{fflightno1}}
                        </span>

                        <span slot="hatuhms" slot-scope="">
                            {{hatuhms}}
                        </span>

                        <span slot="chakuhms" slot-scope="">
                            {{chakuhms}}
                        </span>

                        
                    </a-table>
                </div>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleCancel"  style="margin-left: 8px">{{this.$t('app.common.cancel')}}</a-button>
        </div>

    </a-drawer>
</template>

<script>
    const renderContent = (value, row, index) => {
        const obj = {
            children: value,
            attrs: {},
        };
        if (index === 5 || index === 2) {
            obj.attrs.colSpan = 0;
        }

        return obj;
    };


    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import moment from 'moment' 

    import {JeecgListMixin} from '@/mixins/JeecgListMixin'

    export default {
        name: "AlmAli03D02",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data () {
        return {
            drawerWidth: 600,
            title:this.$t('app.common.detail'), 
            blCode:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            blno:"",
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
            chakuhms:"",
            hatuhms:"",
            fflightno1:"",
            confirmLoading: false,
            form: this.$form.createForm(this),
            iconChooseVisible: false,
            validateStatus:"",
            columns: [
                    {
                        title: this.$t('app.common.operation'),
                        dataIndex: 'rowName',
                        key:'rowIndex',
                        width:40,
                        align:"center",
                        customRender: (value, row, index) => {
                            const obj = {
                                children: value,
                                attrs: {},
                            };
                            if (index === 1 || index === 4) {
                                obj.attrs.rowSpan = 2;
                            }
                            if (index === 2 || index === 5){
                                obj.children =  <div align="left"> {value}</div>;
                                obj.attrs.colSpan = 2;
                            }
                            return obj;
                        },
                        
                    },
                    {
                        
                        title: this.$t('app.BlmInv01D01.10006'),
                        align: "center",
                        dataIndex: 'payDay',
                        width:80,
                        customRender: renderContent,
                    },
                    
                    {
                    
                        title: this.$t('app.BlmInv01D01.10007'),
                        align: "center",
                        width: 80,
                        dataIndex: 'personInCharge',
                        customRender: renderContent,
                    },
                    
                    
                ],
                dataSource:[
                    {
                        rowName:this.$t('app.BlmInv01D01.10000'),
                        payDay:"2023-01-01",
                        personInCharge:"000431 田口 良治"
                    },
                    {
                        rowName:this.$t('app.BlmInv01D01.10001'),
                        payDay:"2023-01-02",
                        personInCharge:"000431 田口 良治"
                    },{
                        rowName:"東京",
                        payDay:"",
                        personInCharge:"000431 田口 良治"
                    },{
                        rowName:this.$t('app.BlmInv01D01.10002'),
                        payDay:"",
                        personInCharge:""
                    },{
                        rowName:this.$t('app.BlmInv01D01.10003'),
                        payDay:"",
                        personInCharge:""
                    },{
                        rowName:"",
                        payDay:"",
                        personInCharge:""
                    },
                    
                ],
                url:{
                    list:"",
                },
                ipagination: {
                    current: 1,
                    pageSize: 5,
                    pageSizeOptions: ['5', '10', '15'],
                    showTotal: (total, range) => {
                        return range[0] + "-" + range[1] + " 共" + total + "条"
                    },
                    showQuickJumper: false,
                    showSizeChanger: false,
                    total: 0,

                },
                    
        }
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.blno = this.model.blno;
                this.visible = true;
                console.log(record);
            },
            close () {
                this.visible = false;
            },
            handleOk () {
                this.$emit('ok', this.model);
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
                    this.drawerWidth = 600;
                }
            },

            resetClick(){
                this.inquiryNumber = "";
                this.containerNo = "";
                
            },

            // 発行店搜索
            onSearchSendShop(){
                this.$refs.MstDrt01D03.add(this.sendShop,this.sendShopDescription);
            },
            selectSendShopOk(hakoutencd,hakoutennm){
                this.sendShop = hakoutencd;
                this.sendShopDescription = hakoutennm;
                this.hakoutencd = hakoutencd + ":" + hakoutennm;
            },
            sendDayChange(time,timeString){

            },
            changeSetOffTime(time,timeString){

            },
            changeArrivalTime(time,timeString){

            },
            changeArrivalsTime(time,timeString){

            },
            isInquiredNumber(checked){

            },
            isShowNumber(checked){

            },
            handleButtonClick(){

            },
            airportSelect(){

            },
            arrivalAirPortClick(){

            },
            handleBlClick(){
                
            },
            handleTypeClick(){

            }
        }
    }
</script>

<style scoped>
    .ant-table-row {
        height: 100px !important;
    }
    
</style>