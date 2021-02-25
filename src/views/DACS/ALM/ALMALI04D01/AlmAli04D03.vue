<!--
*   
*   ページ：  フライト情報マスタ保守新規、編集
*   説明： フライト情報保守新規、編集することができます
*
-->
<template>
    <a-drawer
        :title="title"
        :width="1000"
        :maskClosable="true"
        @close="handleCancel"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">

        <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-calendar @select="onSelect" @panelChange="onPanelChange" >

                    <ul slot="dateCellRender" slot-scope="value" style="margin:0 ; padding:0">
                        <li v-for="item in getListData(value)" :key="item.content" >
                            {{item.description +":" + item.content}}
                        </li>
                    </ul>
                    <!-- <template slot="monthCellRender" slot-scope="value">
                    <div v-if="getMonthData(value)" >
                        <section>{{ getMonthData(value) }}</section>
                        <span></span>
                    </div>
                    </template> -->
                </a-calendar>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="handleCancel"  style="margin-left: 8px">{{this.$t('app.common.cancel')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" >{{this.$t('app.common.confirm')}}</a-button>    
        </div>
        <alm-ali-04-d-04 ref="AlmAli04D04" @ok="timeSelectOk" > </alm-ali-04-d-04>
    </a-drawer>
</template>

<script>
    
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    import moment from 'moment' 
    import AlmAli04D04 from './AlmAli04D04'
    
    
    export default {
        name: "AlmAli04D03",
        components: {
                AlmAli04D04
        },
        data () {
        return {
            drawerWidth: 600,
            title:this.$t('app.common.add'), 
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
            pdtno:"",
            blno:"",
            iconChooseVisible: false,
            validateStatus:"",
            calendarDatas:[],
        }
        },
        methods: {
            add (){
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
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
                    this.drawerWidth = 800;
                }
            },

            resetClick(){
                this.inquiryNumber = "";
                this.containerNo = "";
                
            },
            onSelect(value){
                this.$refs.AlmAli04D04.edit(value);
            },
            onPanelChange(value){

            },
            timeSelectOk(selectDay,goTime,arrivalTime){
                console.log("选择日期");
                console.log(selectDay.format("DD"));
                console.log(goTime);
                console.log(arrivalTime);
                let calendarData = {
                    selectDay:selectDay,
                    goTime:goTime,
                    arrivalTime:arrivalTime
                }

                this.calendarDatas.push(calendarData);
                console.log(this.calendarDatas);
            },
            getListData(value){
                let listData = [];
                for (let item of this.calendarDatas){
                    
                    if (item.selectDay){
                        let intDate = parseInt(item.selectDay.format("DD"));
                        if (intDate == value.date()){
                            let data = {type:'success',content:item.goTime,description: this.$t('app.AlmAli01D01.10012')}

                            listData.push(data);
                            data = {type:'success',content:item.arrivalTime,description: this.$t('app.AlmAli01D01.10013')}
                            listData.push(data);
                            console.log("匹配成功");
                            
                        }
                    }
                    
                    
                }
                return listData || [];
            },
            getMonthData(value) {
            
            }

        
        }
    }
</script>

<style scoped>

</style>