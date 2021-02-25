<!--
*   
*   ページ： 編集機関を追加view
*   説明： 代理店データの追加と編集に使用
*
-->

<template>
    <a-drawer
        :title="title"
        :width="drawerWidth"
        :maskClosable="false"
        @close="handleCancel"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">

        <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    <!-- ＢＬキャリア -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10002')">
                        <div v-decorator="['blcarriercd', validatorRules.blcarriercd]"> 
                            <a-button style="width: 40px;" type="primary" icon="search" @click="onSearchBl"/> {{blcarriercd}}
                        </div>
                    </a-form-item>

                    <!-- <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="ＢＬキャリア名">
                        {{blCode}}
                    </a-form-item> -->

                    <!-- 代理店 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10019')">
                        <a-button type="primary" style="width: 40px;" icon="search" @click="onSearchSendShop"/> {{dairitencd}}
                    </a-form-item>

                    <!-- <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    label="代理店名">
                        {{agencyCode}}
                    </a-form-item> -->

                    <!-- 代理店手数料率 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstDrt01D01.10020')"
                    hasFeedback >
                        <a-input-number :min="0" style="width: 80px;" v-model="agencyCommisionRate" :readOnly="disableSubmit" @change="changeRate"/> %
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-popconfirm :title="$t('app.MstDrt01D01.10021')" @confirm="handleCancel" :okText="$t('app.common.confirm')" :cancelText="$t('app.common.cancel')">
                <a-button style="margin-right: .8rem" icon="close-square">キャンセル</a-button>
            </a-popconfirm>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="form">保存</a-button>    
        </div>

        <mst-drt-01-d-02 ref="MstDrt01D02" @ok="selectBlOk"></mst-drt-01-d-02>
        <mst-drt-01-d-03 ref="MstDrt01D03" @ok="selectSendShopOk"></mst-drt-01-d-03>
    </a-drawer>
</template>

<script>
    import MstDrt01D02 from './MstDrt01D02'; // ＢＬキャリア選択搜索view
    import MstDrt01D03 from './MstDrt01D03'; // 発行店選択
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'

    export default {
        name: "MstDrt01D05",
        components: {
            MstDrt01D02,
            MstDrt01D03
        
        },
        data () {
        return {
            drawerWidth:700,
            title:this.$t('app.label.action'),
            blCode:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            model: {},
            blcarriercd:"",
            dairitencd:"", // 代理店
            dairitennm:"", 
            agencyCode: "", 
            agencyCommisionRate: "", 
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
        computed:{
            validatorRules:function() {
                return {
                    blcarriercd: { rules: [{ required: true, message: this.$t('app.MstDrt01D01.10022') }]},
                }
            }
        },
        created () {
            this.initDictConfig();
        },
        methods: {
            add () {
                
                this.agencyCommisionRate = 0;
                this.edit({status:'1',permsType:'1',route:true});
            },
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                
                console.log(record);
                if (record.status != '1') {
                    console.log(1);
                    this.blCode = record.blcarriercd
                    this.dairitencd = record.dairitencd + ":" + record.dairitennm;
                    this.dairitennm = record.dairitennm;
                    this.agencyCode = record.dairitennm;
                    this.blcarriercd = "1123:" + this.blCode;
                    this.agencyCommisionRate = record.tesuryoritsu.substr(0, record.tesuryoritsu.length - 1);
                    this.$nextTick(() => {
                        this.model.blcarriercd = '1123';
                        this.form.setFieldsValue(pick(this.model, 'blcarriercd'))
                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.agencyCode = "";
                this.agencyCommisionRate = "";
                this.blCode = "";
                this.dairitencd = "";
                this.disableSubmit = false;
                this.visible = false;
            },
            handleOk () {
                const that = this;
                this.form.validateFields((err, values) => {
                    if(!err){
                        this.close();
                    }
                });
            },
            handleCancel () {
                this.close();
            },
            
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 500){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 700;
                }
            },
            initDictConfig() {
            },
            changeRate(value) {
                this.agencyCommisionRate = value;
            },
            onSearchBl(){
                this.$refs.MstDrt01D02.add();
            },

            selectBlOk(selectBlCode, selectblName){
                this.blCode = selectblName;
                this.blcarriercd =  selectBlCode + ":" + selectblName;
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this, 'blcarriercd'))
                })
            },
            // 発行店搜索
            onSearchSendShop(){
                this.$refs.MstDrt01D03.add();
            },
            selectSendShopOk(hakoutencd,hakoutennm){
                this.dairitencd = hakoutencd + ":" + hakoutennm;
                this.dairitennm = hakoutennm;
                this.agencyCode = hakoutennm;
            },
        
        }
    }
</script>

<style scoped>

</style>