<!--
*   
*   ページ： 【MST-ITM01D01】品目マスタ保守　検索用画面
*   説明：   品種コードと品種名から、情報を検索する
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
                 <a-form-item :label="$t('app.MstItm01D01.10001')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"> 
                           
                       <a-select v-decorator="['blcarriercd',validatorRules.blcarriercd]"  style="width: 150px" @click="handleButtonClick">
                                <a-select-option value="JAL">
                                    JAL
                                </a-select-option>
                                <a-select-option value="ANA">
                                    ANA
                                </a-select-option>
                                <a-select-option value="JTA">
                                    JTA
                                </a-select-option>
                            </a-select>
                    </a-form-item>

                    <!-- 品目コード -->
                    <a-form-item :label="$t('app.MstItm01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                            <a-input v-model="chargepersoncd" style="width: 150px"  />
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
        name: "MstFtm01D02",
        components: {
                
        },
        data () {
        return {
            drawerWidth: 600,
            title:this.$t('app.common.search'),
            chargepersoncd:"",
            addTitle: this.$t('app.common.add'),
            editTitle: this.$t('app.common.edit'),
            visible: false,
            disableSubmit:false,
            blcarriercd:"", 
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
                      blcarriercd: { rules: [{ required: true, message: this.$t('app.MstFtm01D01.10008')}]},
                }          
                      
            }
        },
         
        methods: {
            add () {
                this.disabledFlg = false;
               
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
                    this.blcarriercd = record.blcarriercd;
                    this.$nextTick(() => {
                        this.model.blcarriercd = record.blcarriercd;
                    
                        this.form.setFieldsValue(pick(this.model, 'blcarriercd'))
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