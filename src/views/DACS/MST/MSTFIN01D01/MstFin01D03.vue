<!--
*   
*   ページ： 【MST-FIN01D01】細目マスタ保　新規画面
*   説明： キャリアデータの追加と編集に使用
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
                
                    <!-- 店コード-->
                    <a-form-item :label="$t('app.MstFin01D01.10001')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-input v-decorator="['storecd',validatorRules.storecd]" style="width:150px" :disabled="disabledFlg"    placeholder="0010"/>
                    </a-form-item>
                    

                    <!-- 科目コード -->
                    <a-form-item :label="$t('app.MstFin01D01.10002')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-input v-decorator="['subjectcd',validatorRules.subjectcd]" style="width:150px" :disabled="disabledFlg" />
                    </a-form-item>
<br />

                      <!-- 細目コード -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstFin01D01.10004')">
                        <a-input v-decorator="['detailcd',validatorRules.detailcd]" style="width:150px"  :disabled="disabledFlg"/>
                    </a-form-item>
                   
                    <!-- 細目名称 -->
                     <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="$t('app.MstFin01D01.10005')" >
                        <a-input v-decorator="['detailnm',validatorRules.detailnm]"  style=""   />
                    </a-form-item>

                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-popconfirm :title="$t('app.message.msg0311')" @confirm="handleCancel" :okText="$t('app.common.confirm')" :cancelText="$t('app.common.cancel')">
                <a-button style="margin-right: .8rem" icon="close-square">{{$t('app.common.cancel')}}</a-button>
            </a-popconfirm>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="form">{{$t('app.common.save')}}</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    import { getMsgInfo } from "@/utils/util"
      import moment from 'moment' 
    import pick from 'lodash.pick'

    export default {
        name: "MstFin01D03",
        components: {
        
        },
        data () {
        return {
            drawerWidth:700,
            title:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            disabledFlg:false,
            model: {},
            storecd:"",
            subjustcd:"",
            subjustnm:"",
            detailcd:"",
            detailnm:"",
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
                   
                      storecd: { rules: [{ required: true, message: this.$t('app.MstFin01D01.10007')},
                              {pattern: '^[0-9]{1,6}$', message: this.$t('app.MstFin01D01.10007')}]},

                    subjectcd: { rules: [{ required: true, message: this.$t('app.MstFin01D01.10008')},
                             {pattern: '^[0-9]{1,5}$', message: this.$t('app.MstFin01D01.10008')}]},

                    detailcd: { rules: [{ required: true, message: this.$t('app.MstFin01D01.10009')},
                             {pattern: '^[0-9]{1,3}$', message: this.$t('app.MstFin01D01.10009')}]},
                    
                    detailnm:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFin01D01.10005')})},
                          {pattern: '^\.{1,60}$', message: this.$t('app.MstFin01D01.10010')}]},

                }          
                      
            }
        },
        created () {
            this.initDictConfig();
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
                    console.log(record.blcarriercd);
                    this.disabledFlg = true;
                    this.storecd = record.storecd;
                    this.subjectcd =  record.subjectcd;
                    this.subjectnm = record.subjectnm;
                    this.detailcd = record.detailcd;
                    this.detailnm= record.detailnm;

                    this.$nextTick(() => {
                        this.model.blcarriercd = record.blcarriercd;
                        this.storecd =  record.storecd;
                        this.subjustcd = record.subjectcd;
                        this.subjectnm=record.subjectnm;
                        this.detailcd= record.detailcd;
                        this.detailnm = record.detailnm;
                       

                        this.form.setFieldsValue(pick(this.model, 'storecd'))
                        this.form.setFieldsValue(pick(this.model, 'subjectcd'))
                        this.form.setFieldsValue(pick(this.model, 'subjectnm'))
                        this.form.setFieldsValue(pick(this.model, 'detailcd'))
                        this.form.setFieldsValue(pick(this.model, 'detailnm'))

                    })
                
                }
            },
            close () {
                this.$emit('close');
                this.storecd = "";
                this.storenm = "";
                this.area = "";
                this.prefectures = "";
                this.accountstorecd = "";
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
            handleButtonClick(){
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
           
        }
    }
</script>

