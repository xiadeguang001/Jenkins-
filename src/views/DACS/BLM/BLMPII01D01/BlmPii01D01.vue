<!--
*   
*   ページ： ＢＬ支払情報入力
*   説明： ＢＬ支払情報入力 詳細入力画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.BlmPii01D01.10001')}}</h1>
        <p class="p-pageSubText">{{$t('app.BlmPii01D01.10002')}}</p>
        <a-row :gutter="24" >
            <a-col :md="8" :sm="8">
                <a-card :bordered="false" style="width: 100%">
                    <div :style="{padding: '10px 16px',background: '#fff',}">
                        <a-spin :spinning="confirmLoading">
                        
                            <a-form :form="form" class="standard-form">
                                <a-form-item :label="$t('app.AlmAli01D01.10010')"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-input v-decorator="['blcarriercd', validatorRules.blcarriercd]"  style="width: 20px" ></a-input>
                                        <span style="margin-left: 10px" >ANA 全日本空輸</span>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10000')" 
                                    style="margin-top:-8px" 
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-input v-decorator="['utcarriercd', validatorRules.utcarriercd]"  style="width:20px" ></a-input>                                        
                                        <span style="margin-left: 10px" >ANA 全日本空輸</span>

                                </a-form-item>

                                <a-form-item :label="$t('app.MstDrt01D01.10016')"
                                    style="margin-top:-8px" 
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-input v-decorator="['hakoutencd', validatorRules.hakoutencd]"  style="width:40px" ></a-input>                                        
                                        <span style="margin-left: 10px" >福岡空港</span>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10003')"
                                    style="margin-top:-8px" 
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-date-picker showTime :placeholder="$t('app.AlmAli01D01.10036')"  v-decorator="['hakouhh', validatorRules.hakouhh]" format="YYYY-MM-DD HH:mm" style="width: 160px"  ></a-date-picker>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10004')"
                                    style="margin-top:-8px" 
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-input v-decorator="['hakoutantocd', validatorRules.hakoutantocd]"  style="width: 80px"  ></a-input>
                                        <span style="margin-left: 10px" >佐山　幸司</span>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10005')"
                                    style="margin-top:-8px" 
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-input v-decorator="['utsbt', validatorRules.utsbt]"  style="width: 80px"  ></a-input>
                                        <span style="margin-left: 10px" >一般貨物</span>
                                </a-form-item>

                                <a-form-item :label="$t('app.common.item')"
                                    style="margin-top:-8px" 
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol">
                                        <a-input v-decorator="['hinmkcd', validatorRules.hinmkcd]"  style="width: 80px"  ></a-input>
                                        <span style="margin-left: 10px" >一般雑貨</span>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10006')"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    style="margin-top:-8px" >
                                        <a-input v-decorator="['contcnt', validatorRules.contcnt]"  style="width: 80px"  ></a-input>
                                        
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10007')"
                                    :labelCol="labelCol"
                                    :wrapperCol="wrapperCol"
                                    style="margin-top:-8px" >
                                        <a-input v-decorator="['specialDistinction', validatorRules.specialDistinction]"  style="width: 80px"  ></a-input>
                                        
                                </a-form-item>
                                <div>
                                    &nbsp;&nbsp;
                                </div>
                            </a-form>
                        </a-spin>
                    </div>
                    

                </a-card>
            </a-col>

            <a-col :md="8" :sm="8">
                <a-card :bordered="false" :style="{width:'100%'}">
                    <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
                        <a-spin :spinning="confirmLoading">
                        
                            <a-form :form="form" class="standard-form">

                                <a-form-item :label="$t('app.AlmAli01D01.10009')"
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall">
                                        <a-input v-decorator="['jyuryo', validatorRules.jyuryo]" style="width: 80px" ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10008')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="sjyuryo" style="width: 80px" ></a-input>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10009')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="rjyuryo" style="width: 80px" ></a-input>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10010')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="coolsjyuryo" style="width: 80px" ></a-input>
                                </a-form-item>
                            
                                <a-form-item :label="$t('app.BlmPii01D01.10011')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="coolrjyuryo" style="width: 80px" ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10012')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="ipankonsaijyuryo" style="width: 80px" ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10013')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="konsaikb" style="width: 80px" ></a-input> {{$t('app.BlmPii01D01.10015')}}
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10014')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="choseikb" style="width: 80px" ></a-input>
                                        <div> {{$t('app.BlmPii01D01.10016')}}</div>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10017')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="choseitanka" style="width: 80px" ></a-input> 
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10018')" 
                                    :labelCol="labelColSmall"
                                    :wrapperCol="wrapperColSmall"
                                    style="margin-top:-8px" >
                                        <a-input v-model="choseiritu" style="width: 80px" ></a-input> 
                                </a-form-item>
                                <div>
                                    &nbsp;&nbsp;
                                </div>
                            </a-form>
                        </a-spin>
                    </div>

                </a-card>
            </a-col>

            <a-col :md="8" :sm="8">
                <a-card :bordered="false" :style="{width:'100%'}">
                    <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
                        <a-spin :spinning="confirmLoading">
                        
                            <a-form :form="form" class="standard-form">

                                <a-form-item :label="$t('app.AlmAli01D01.10016')"
                                    :labelCol="labelColMiddle"
                                    :wrapperCol="wrapperColMiddle">
                                        <a-date-picker v-model="hakouymd" :disabled="isDisabled"  :placeholder="$t('app.AlmAli01D01.10036')" format="YYYY-MM-DD"  @Change="sendDayChange" style="width: 160px" ></a-date-picker>
                                        
                                </a-form-item>
                            
                                
                            </a-form>
                            <div>
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

                                    <span slot="fcarrier" slot-scope="">
                                        <a-input style="width:40px" v-model="fcarrier"></a-input> ANA
                                    </span>
                                    <span slot="flight" slot-scope="">
                                        <a-input v-model="flight"></a-input> 
                                    </span>

                                    
                                </a-table>
                            </div>
                            <div>
                                &nbsp;
                            </div>
                            <div align="center">
                                <a-button  type="primary" >
                                    {{$t('app.BlmPii01D01.10022')}}
                                </a-button>
                            </div>
                        </a-spin>
                    </div>
                    

                </a-card>
            </a-col>
        </a-row>
        <a-row :gutter="24" >
            <a-col :md="24" :sm="8">
                <a-card :bordered="false" style="width: 100%">
                    <div :style="{padding: '10px 16px',background: '#fff',}">
                        <a-spin :spinning="confirmLoading">
                        
                            <a-form :form="form" class="standard-form">

                                <a-form-item :label="$t('app.BlmPii01D01.10023')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig">
                                        <a-input v-model="utcarriercd"  ></a-input>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10024')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="jyukaryo"  ></a-input>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10025')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="tusinryo"  ></a-input>
                                </a-form-item>

                                <a-form-item :label="$t('app.BlmPii01D01.10026')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="other"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10027')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="chijyounsoryo"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10028')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="shokei"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10029')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="tax"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10030')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="gokei"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10031')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="choseigak"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10032')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="dairitesuryo"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10033')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="siharaikokuryo"  ></a-input>
                                </a-form-item>
                                <a-form-item :label="$t('app.BlmPii01D01.10034')"
                                    :labelCol="labelColBig"
                                    :wrapperCol="wrapperColBig"
                                    style="margin-top:-8px" >
                                        <a-input v-model="net"  ></a-input>
                                </a-form-item>

                            </a-form>

                        </a-spin>
                    </div>
                    
                    <div align="right">
                        <a-button  type="primary"  >
                            {{$t('app.common.confirm')}}
                        </a-button>
                    </div>

                </a-card>
            </a-col>
            
        </a-row>
    </div>
</template>

<script>

import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'

    export default {
        name: "BLMPii01D01",
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
                    sm: { span: 12 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 12 },
                },
                labelColBig: {
                    xs: { span: 24 },
                    sm: { span: 4 },
                },
                wrapperColBig: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                labelColMiddle: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperColMiddle: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
                labelColSmall: {
                    xs: { span: 24 },
                    sm: { span: 10 },
                },
                wrapperColSmall: {
                    xs: { span: 24 },
                    sm: { span: 14 },
                },
                recycleBinVisible: false,
                
                url: {
                    list: "",
                },
                sjyuryo:"",
                rjyuryo:"",
                coolsjyuryo:"",
                coolrjyuryo:"",
                ipankonsaijyuryo:"",
                konsaikb:"",
                choseikb:"",
                choseitanka:"",
                choseiritu:"",
                hakouymd:null,
                utcarriercd:"",
                jyukaryo:"",
                tusinryo:"",
                other:"",
                chijyounsoryo:"",
                shokei:"",
                tax:"",
                gokei:"",
                choseigak:"",
                dairitesuryo:"",
                siharaikokuryo:"",
                net:"",
                utsbt:"",
                fcarrier:"",
                flight:"",
                isDisabled:false,
                plainOptions:[
                    this.$t('app.BlmWhi01D01.10002'),
                    this.$t('app.BlmWhi01D01.10003'),
                ],
                selectValue:0,
                form: this.$form.createForm(this, { name: 'coordinated' }),
                columns:[
                    { 
                        title: this.$t('app.BlmPii01D01.10019'),
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
                        width: 120,
                        dataIndex: 'fcarrier',
                        
                        scopedSlots: {customRender: 'fcarrier'},
                    },
                    {
                        title: this.$t('app.AlmAli01D01.10011'),
                        align: "center",
                        width:120,
                        dataIndex: 'flight',
                        
                        scopedSlots: {customRender: 'flight'},
                    },
                    {
                        title: this.$t('app.BlmPii01D01.10020'),
                        width:60,
                        align: "center",
                        dataIndex: 'hatukuko',
                        
                        scopedSlots: {customRender: 'hatukuko'},
                    },
                    {
                        title: this.$t('app.BlmPii01D01.10021'),
                        width:60,
                        align: "center",
                        dataIndex: 'chakukuko',
                        
                        scopedSlots: {customRender: 'chakukuko'},
                    },
                ],
                dataSource:[
                    {
                        fcarrier:"02",
                        flight:"0258",
                        hatukuko:"FUK",
                        chakukuko:"HND"
                    },
                    {
                        fcarrier:"02",
                        flight:"0258",
                        hatukuko:"FUK",
                        chakukuko:"HND"
                    },
                ]
            }
        },
        computed: {
            validatorRules:function() {
                return {
                    blcarriercd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.AlmAli01D01.10010')})}]},
                    utcarriercd: { rules: [{ required: true, message:this.$t('app.message.msg0001',{'0': this.$t('app.BlmPii01D01.10000')})}]},
                    hakoutencd: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.MstDrt01D01.10016') })}]},
                    hakouhh: { rules: [{ required: true, message:this.$t('app.message.msg0001',{'0': this.$t('app.BlmPii01D01.10003') })}]},
                    hakoutantocd:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.BlmPii01D01.10004') })}]},
                    utsbt:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.BlmPii01D01.10005') })}]},
                    hinmkcd:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.common.item') })}]},
                    jyuryo:{ rules: [{ required: true, message: this.$t('app.message.msg0001',{'0':this.$t('app.AlmAli01D01.10009') })}]},
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