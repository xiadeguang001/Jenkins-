<!--
*   
*   ページ： 【MST-FIN01D01】細目マスタ保　検索用画面
*   説明： 店舗コードと科目コードから情報を検索する
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
                     <!-- 店コード -->
               
                    <a-form-item :label="$t('app.MstFin01D01.10001')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="storecd" style="width:150px"  v-decorator="['storecd',validatorRules.storecd]"/>
                    </a-form-item>

                    <!-- 科目コード -->
                    <a-form-item :label="$t('app.MstFin01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="subjectcd" style="width:150px"  />
                    </a-form-item>

                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="resetClick" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="search">{{this.$t('app.common.search')}}</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    import { getMsgInfo } from "@/utils/util"
    import pick from 'lodash.pick'
    
    export default {
        name: "MstFin01D02",
        components: {
                
        },
        data () {
        return {
            drawerWidth: 600,
            title:this.$t('app.common.search'),
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            storecd:"",
            subjectcd:"",
            subjectnm:"",
            detailcd:"",
            detailnm:"",
            model: {},
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
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
                      storecd: { rules: [{ required: true, message: this.$t('app.MstFin01D01.10006')}]},
                }          
                      
            }
        },
         
        methods: {
            add () {
                this.disabledFlg = false;
               // this.communicationcost = 0;
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
                  //  console.log(record.blcarriercd);
                    this.disabledFlg = true;
                    this.storecd = record.storecd;
                    this.subjectcd=record.subjectcd;
                    this.subjectnm=record.subjectnm;
                    this.detailcd=record.detailcd;
                    this.detailnm=record.detailnm;
                    this.$nextTick(() => {
                        
                        this.model.storecd = record.storecd;
                        this.model.subjectcd=record.subjectcd;
                        this.model.subjectnm=record.subjectnm;
                        this.model.detailcd=record.detailcd;
                        this.model.detailnm=record.detailnm;
                    
                        this.form.setFieldsValue(pick(this.model, 'storecd'))
                        this.form.setFieldsValue(pick(this.model, 'subjectcd'))
                        this.form.setFieldsValue(pick(this.model, 'subjectnm'))
                        this.form.setFieldsValue(pick(this.model, 'detailcd'))
                        this.form.setFieldsValue(pick(this.model, 'detailnm'))
                    })
                
                }
            },
           close () {
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
            handleButtonClick(){
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
               this.chargepersoncd = "";
            },

        }
    }
</script>

<style scoped>

</style>