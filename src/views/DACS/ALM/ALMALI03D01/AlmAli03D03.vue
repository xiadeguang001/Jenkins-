<!--
*   
*   ページ： 航空便种修正編集
*   説明： 航空便种修正編集
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
                    
                    <a-form-item label="No" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            1
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-date-picker v-model="hasouhms" :placeholder="$t('app.AlmAli01D01.10036')" format="YYYY-MM-DD HH:mm" show-time @Change="sendDayChange" style="width: 160px" >

                            </a-date-picker>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10015')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            {{queno}}
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10005')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
                        <a-select v-model="kokubs" style="width: 160px" @click="handleTypeClick">
                            
                            <a-select-option value="1">
                                1
                            </a-select-option>
                            <a-select-option value="2">
                                2
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10009')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="jyuryo" ></a-input>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10014')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="contno" ></a-input>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10035')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="blno" ></a-input>
                    </a-form-item>

                    <a-form-item :label="$t('app.AlmAli01D01.10034')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            {{pdtno}}
                    </a-form-item>
                    

                </a-form>
                <div>&nbsp;</div>
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

                        <span slot="blcarriercd" >
                            <a-select v-model="blcarriercd" style="width: 80px" @click="handleTypeClick">
                            
                                <a-select-option value="1">
                                    1
                                </a-select-option>
                                <a-select-option value="2">
                                    2
                                </a-select-option>
                            </a-select>
                        </span>
                        <span slot="fflightno1" slot-scope="">
                            <a-input v-model="fflightno1" ></a-input>
                        </span>

                        <span slot="hatuhms" slot-scope="">
                            <a-time-picker v-model="hatuhms" :placeholder="$t('app.AlmAli01D01.10019')" format="HH:mm" style="width: 80px" @change="changeSetOffTime" />
                        </span>

                        <span slot="chakuhms" slot-scope="">
                            <a-time-picker v-model="chakuhms" :placeholder="$t('app.AlmAli01D01.10019')" format="HH:mm" style="width: 80px" @change="changeArrivalTime" />
                        </span>

                        <span slot="describe" slot-scope="">
                            <a-input v-model="describe" ></a-input>
                        </span>
                    </a-table>
                </div>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleCancel"  style="margin-left: 8px">{{this.$t('app.common.cancel')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" >{{this.$t('app.common.confirm')}}</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    
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
            drawerWidth: 1000,
            title:this.$t('app.common.search'), // 航空便种修正检索model
            blCode:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            queno:"",//お問合せ番号
            contno:"",//コンテナNo.
            jyuryo:"",
            kokubs:"",
            blcarriercd:"",
            fflightno1:"",
            describe:"",
            hasouhms:"",
            hatuhms:"",
            chakuhms:"",
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
            pdtno:"",
            blno:"",
            iconChooseVisible: false,
            validateStatus:"",
            columns: [
                    {
                        title: this.$t('app.AlmAli01D01.10037'),
                        dataIndex: '',
                        key:'rowIndex',
                        width:60,
                        align:"center",
                        customRender:function (text, record, index) {
                            return parseInt(index)+1;
                        }
                    },
                    {
                        
                        title: this.$t('app.AlmAli01D01.10010'),
                        align: "center",
                        dataIndex: 'blcarriercd',
                        width:80,
                        scopedSlots: { customRender: 'blcarriercd' },
                    },
                    
                    {
                        // フライト
                        title: this.$t('app.AlmAli01D01.10011'),
                        align: "center",
                        width: 80,
                        dataIndex: 'fflightno1',
                        scopedSlots: { customRender: 'fflightno1' },
                    },
                    {
                        // 出発
                        title: this.$t('app.AlmAli01D01.10012'),
                        align: "center",
                        width: 80,
                        dataIndex: 'hatuhms',
                        scopedSlots: { customRender: 'hatuhms' }
                    },
                    {
                        // 到着
                        title: this.$t('app.AlmAli01D01.10013'),
                        align: "center",
                        width: 80,
                        dataIndex: 'chakuhms',
                        scopedSlots: { customRender: 'chakuhms' }
                    },
                    {
                        // コンテナ
                        title: this.$t('app.AlmAli01D01.10026'),
                        align: "center",
                        
                        dataIndex: 'describe',
                        scopedSlots: { customRender: 'describe' }
                    }
                    
                ],
                dataSource:[
                    {
                        blcarriercd:"JAL",
                        fflightno1:"0001"
                    },
                    {
                        blcarriercd:"JAL",
                        fflightno1:"0001"
                    },{
                        blcarriercd:"JAL",
                        fflightno1:"0001"
                    },{
                        blcarriercd:"JAL",
                        fflightno1:"0001"
                    },{
                        blcarriercd:"JAL",
                        fflightno1:"0001"
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
                this.queno = this.model.queno;
                this.contno = this.model.contno;
                this.jyuryo = this.model.jyuryo;
                this.kokubs = this.model.kokubs;
                this.blcarriercd = this.model.blcarriercd;
                this.fflightno1 = this.model.fflightno1;
                this.describe = this.model.describe;
                this.blno = this.model.blno;
                this.pdtno = this.model.pdtno;
                this.hasouhms = this.model.hasouhms ? moment(this.model.hasouhms,"YYYY-MM-DD") : moment("2021-1-1","YYYY-MM-DD");
                this.hatuhms = this.model.hatuhms ? moment(this.model.hatuhms,"HH:mm") : moment("00:00","HH:mm");
                this.chakuhms = this.model.chakuhms ? moment(this.model.chakuhms,"HH:mm") : moment("00:00","HH:mm");
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
                    this.drawerWidth = 1000;
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

</style>