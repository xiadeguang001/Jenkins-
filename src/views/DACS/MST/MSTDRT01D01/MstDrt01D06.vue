<!--
*   
*   ページ： エージェントを探すview
*   説明： ＢＬキャリアと発行店によって、代理店の情報を検索する
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
                    <!-- ＢＬキャリア -->
                    <a-form-item :label="$t('app.MstDrt01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-button type="primary" style="width: 40px;" icon="search" @click="onSearchBl"/>
                            {{blcarriercd}}
                        </a-form-item>

                    <a-form-item :label="$t('app.MstDrt01D01.10016')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-button type="primary" style="width: 40px;" icon="search" @click="onSearchSendShop"/>
                            {{hakoutencd}}
                        </a-form-item>

                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="resetClick" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="search">{{this.$t('app.common.search')}}</a-button>    
        </div>

        <mst-drt-01-d-02 ref="MstDrt01D02" @ok="selectBlOk"></mst-drt-01-d-02>
        <mst-drt-01-d-03 ref="MstDrt01D03" @ok="selectSendShopOk"></mst-drt-01-d-03>
    </a-drawer>
</template>

<script>
    import MstDrt01D02 from './MstDrt01D02';
    import MstDrt01D03 from './MstDrt01D03';
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    
    export default {
        name: "MstDrt01D06",
        components: {
            MstDrt01D02,
            MstDrt01D03
                
        },
        data () {
        return {
            drawerWidth: 600,
            title:this.$t('app.common.search'),
            blCode:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            hakoutencd: "",
            blcarriercd:"",
            dairitencd:"", 
            dairitennm:"", 
            agencyCode: "",
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
            validateStatus:""
        }
        },
        methods: {
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
            
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 400){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 600;
                }
            },

            resetClick(){
                this.blCode = "";
                this.blName = "";
                this.blcarriercd = "";
                this.sendShop = "";
                this.sendShopDescription = "";
                this.hakoutencd = "";
            },

            // Blキャリア 搜索
            onSearchBl(){
                this.$refs.MstDrt01D02.add(this.blCode,this.blName);
            },

            selectBlOk(selectBlCode, selectblName){
                this.blCode = selectBlCode;
                this.blName = selectblName;
                this.blcarriercd = selectBlCode  + ":"+ selectblName
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
        
        }
    }
</script>

<style scoped>

</style>