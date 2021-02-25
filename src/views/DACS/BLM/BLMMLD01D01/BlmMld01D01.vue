<!--
*   
*   ページ： ＢＬ混載データ作成
*   説明： ＢＬ混載データ作成 　ダウンロード画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.BlmWhi01D01.10016')}}</h1>
        <p class="p-pageSubText">{{$t('app.BlmWhi01D01.10017')}}</p>
        <a-card :bordered="false">
            <div :style="{padding: '10px 16px',background: '#fff',}">
                <a-spin :spinning="confirmLoading">
                
                    <a-form :form="form" class="standard-form">

                        <a-form-item :label="$t('app.AlmAli01D01.10030')"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                                <a-date-picker v-model="nyukoymd" :disabled="isDisabled"  :placeholder="$t('app.AlmAli01D01.10036')" format="YYYY-MM-DD"  @Change="sendDayChange" style="width: 160px" ></a-date-picker>
                        </a-form-item>
                    

                        <a-form-item :label="$t('app.AlmAli01D01.10018')"
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                            
                                <a-select default-value="1" :disabled="isDisabled" style="width: 160px" @click="handleButtonClick">
                                    
                                    <a-select-option value="1">
                                        1
                                    </a-select-option>
                                    <a-select-option value="2">
                                        2
                                    </a-select-option>
                                </a-select>
                                
                                <span style="margin-left: 10px" v-show="isDisabled">日本航空</span>
                        </a-form-item>

                        <div>
                            &nbsp;&nbsp;
                        </div>
                    </a-form>
                </a-spin>
            </div>
            <div class="fill-drawer-bottom"></div>
            <div style="z-index:999 " class="drawer-bootom-button">                          
                <a-button @click="handleCancel" style="margin-left: 8px">{{this.$t('app.OthSdc01D01.10004')}}</a-button>
                <a-button @click="submit" type="primary" :loading="confirmLoading"  >{{this.$t('app.CtmOda01D01.10004')}}</a-button>       
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
        name: "BlmMld01D01",
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
                deliveryDestination:"",
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
                    numberOfSheet:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.BlmWhi01D01.10005') })}]},
                    deliveryDestination:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.BlmWhi01D01.10010') })}]}
                }
            }
        },
        methods: {
        
            resetClick(){
                
            },
            
            sendDayChange(time,timeString){

            },
            handleCancel(){
            },
            submit(){

            },
            handleOk(){
                
            },

            handleButtonClick(){

            },
            
        }

    }
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>