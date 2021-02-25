<!--
*   
*   ページ： ＢＬ入庫入力
*   説明： ＢＬ入庫入力 入力画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.BlmWhi01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.BlmWhi01D01.10001')}}</p>
        <a-card :bordered="false">
            <div :style="{padding: '10px 16px',background: '#fff',}">
                <a-spin :spinning="confirmLoading">
                
                    <a-form :form="form"  class="standard-form">

                        <a-form-item :label="$t('app.BlmWhi01D01.10006')"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-date-picker v-decorator="['nyukoymd', validatorRules.nyukoymdRule]" :disabled="isDisabled"  :placeholder="$t('app.AlmAli01D01.10036')" format="YYYY-MM-DD"  @Change="sendDayChange" style="width: 160px" ></a-date-picker>
                                <div >
                                    <a-radio-group :disabled="isDisabled" :options="plainOptions" :default-value="plainOptions[0]" @change="selectType" />
                                </div>
                        </a-form-item>
                    
                        <div>
                            &nbsp;
                        </div>
                        <a-form-item :label="$t('app.BlmWhi01D01.10004')" 
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-input v-if="selectValue == 0" v-decorator="['nyukotanto', validatorRules.nyukotanto]"  :disabled="isDisabled" style="width:160px" ></a-input> 
                                <a-input v-if="selectValue == 1" v-model="nyukotanto" :disabled="isDisabled" style="width:160px" ></a-input> 
                                <span style="margin-left: 10px" v-show="isDisabled">村上春樹</span>

                        </a-form-item>

                        <a-form-item :label="$t('app.AlmAli01D01.10018')"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                
                                <a-select v-decorator="['bltype', validatorRules.bltype]"  default-value="1" :disabled="isDisabled" style="width: 160px;" @click="handleButtonClick">
                                    
                                    <a-select-option value="1">
                                        1
                                    </a-select-option>
                                    <a-select-option value="2">
                                        2
                                    </a-select-option>
                                </a-select>
                            
                                <span style="margin-left: 10px" v-show="isDisabled">日本航空</span>
                        </a-form-item>

                        <a-form-item :label="$t('app.AlmAli01D01.10035')"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-input  v-decorator="['blno', validatorRules.blno]" :disabled="isDisabled" style="width: 160px"  ></a-input>
                        </a-form-item>

                        <a-form-item :label="$t('app.BlmWhi01D01.10005')"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-input v-decorator="['numberOfSheet', validatorRules.numberOfSheet]" :disabled="isDisabled" style="width: 160px"  ></a-input>
                        </a-form-item>

                        <div>
                            &nbsp;&nbsp;
                        </div>
                    </a-form>
                </a-spin>
            </div>
            <div class="fill-drawer-bottom"></div>
            <div style="z-index:999 " class="drawer-bootom-button">

                <a-button v-show="!isDisabled" @click="handleOk" type="primary" :loading="confirmLoading"  >{{this.$t('app.OthImp01D01.10006')}}</a-button> 
                <a-button v-show="isDisabled" @click="handleCancel"  style="margin-left: 8px">{{this.$t('app.common.canceled')}}</a-button>

                <a-button v-show="isDisabled" @click="submit" type="primary" :loading="confirmLoading"  >{{this.$t('app.common.confirm')}}</a-button>       
            </div>

            
        </a-card>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

    export default {
        name: "BLMWHI01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
        
        },
        data() {
            return {
                
                description: this.$t('app.label.user.view'), 
                confirmLoading: false,
                queryParam: {
                
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                recycleBinVisible: false,
                
                url: {
                    list: "",
                },
                nyukoymd:null,
                nyukotanto:"",
                blno:"",
                numberOfSheet:"",
                isDisabled:false,
                plainOptions:[
                    this.$t('app.BlmWhi01D01.10002'),
                    this.$t('app.BlmWhi01D01.10003'),
                ],
                selectValue:0,
                form: this.$form.createForm(this, { name: 'coordinated' }),
            }
        },
        computed: {
            validatorRules:function() {
                return {
                    nyukoymdRule: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.BlmWhi01D01.10011')})}]},
                    nyukotanto: { rules: [{ required: true, message:this.$t('app.message.msg0001',{'0': this.$t('app.BlmWhi01D01.10004')})}]},
                    bltype: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.AlmAli01D01.10018') })}]},
                    blno: { rules: [{ required: true, message:this.$t('app.message.msg0001',{'0': this.$t('app.AlmAli01D01.10035') })}]},
                    numberOfSheet:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.BlmWhi01D01.10005') })}]}
                }
            }
        },
        methods: {
        
            resetClick(){
                this.blCode = "";
                this.blName = "";
                this.blcarriercd = "";
                this.sendShop = "";
                this.sendShopDescription = "";
                this.hakoutencd = "";
            },
            onSearchModel(){
                this.$refs.AlmAli01D02.edit();
            },
            sendDayChange(time,timeString){

            },
            handleCancel(){
                this.isDisabled = false;
            },
            submit(){

            },
            handleOk(){
                this.isDisabled = true;
            },
            selectType(e){
                if (e.target.value == this.$t('app.BlmWhi01D01.10002')){
                    this.selectValue = 0;
                }else{
                    this.selectValue = 1;
                }
            },
            handleButtonClick(){

            },
            
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>