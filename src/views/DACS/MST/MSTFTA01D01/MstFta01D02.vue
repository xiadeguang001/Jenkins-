<!--
*   
*   ページ： 【MST-FTA01D01】運賃種別適用マスタ保守画面　検索用画面
*   説明： 運賃種別適用マスタ保守（検索画面）
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
                    <!-- キャリア -->
                    <a-form-item :label="$t('app.MstFta01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-select 
                            v-decorator="['carriercd', validatorRules.carriercd]"
                            style="width: 150px" 
                            @click="handleButtonClick">
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

                    <!-- 運賃種別 -->
                    <a-form-item :label="$t('app.MstFta01D01.10003')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-select 
                            style="width: 150px" 
                            @click="handleButtonClick"
                        >
                            <a-select-option value="一般">
                                一般
                            </a-select-option>
                            <a-select-option value="特定品目">
                                特定品目
                            </a-select-option>
                            <a-select-option value="品目分類">
                                品目分類
                            </a-select-option>
                            <a-select-option value="引越商品">
                                引越商品
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <!-- 適用開始日 -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.MstFta01D01.10004')">
                        <a-date-picker style="width: 150px" />
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
        name: "MstFta01D02",
        components: {
                
        },
        data () {
            return {
                drawerWidth: 600,
                title:this.$t('app.common.search'),
                carriercd:"",
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
                validateStatus:""
            }
        },
        computed:{
            validatorRules:function() {
                return {
                    carriercd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.MstFta01D01.10002')})}]},
                }
            }
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;

            },
            close () {
                this.$nextTick(() => {
                    this.model.carriercd = this.model.carriercd;
                    this.form.setFieldsValue(pick(this.model, 'carriercd'))
                })
                this.visible = false;
                
            },
            handleOk () {
                this.$emit('ok', this.model);
                this.close();
            },
            handleCancel () {
                this.close();
            },
            handleButtonClick () {

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
                // this.carriercd = "";
            },

        }
    }
</script>

<style scoped>

</style>