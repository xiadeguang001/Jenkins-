<!--
*   
*   ページ： コンテナ在庫表データ作成画面
*   説明： 実行画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.CtmCtd01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.CtmCtd01D01.10009')}}</p>
        <a-card :bordered="false">
        <div :style="{padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">    
                    <!-- 処理年月-->
                    <a-form-item :label="$t('app.CtmCtd01D01.10001')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-month-picker v-decorator="['date',validatorRules.date]" style="width: 160px" format="YYYY/MM" placeholder=""/>
                    </a-form-item>
                    <!-- コンテナ -->
                    <a-form-item :label="$t('app.CtmCtd01D01.10002')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"> 
                        <a-input maxLength="5"  style="width:80px"  /> 
                        <span style="margin-top: 18px;margin-left: 15px;">{{$t('app.MstCap01D01.10014')}}</span>
                        <a-input maxLength="5"  style="margin-left:20px;width:80px;"  />    
                    </a-form-item>
                    <br/>
                    <!-- 日別 -->
                    <a-form-item :label="$t('app.CtmCtd01D01.10008')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"> 
                        <a-radio-group  v-model="kuBunValue" @change="selectKubun" :default-value="1">
                            <a-radio :style="radioStyle" :value="1">
                                {{$t('app.CtmCtd01D01.10003')}}
                            </a-radio>
                            <a-radio :style="radioStyle" :value="2">
                                {{$t('app.CtmCtd01D01.10004')}}
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                    <a-form-item :label="$t('app.CtmCtd01D01.10004')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    v-show="airPortVisible"> 
                        <a-radio-group  v-model="airPortValue">
                            <a-radio :style="radioStyle" :value="3">
                                {{$t('app.CtmCtd01D01.10005')}}
                            </a-radio>
                            <a-radio :style="radioStyle" :value="4">
                                {{$t('app.CtmCtd01D01.10006')}}
                            </a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form >
            </a-spin>
                        <div>
                            &nbsp;&nbsp;
                        </div>

                    <div class="fill-drawer-bottom"></div>
                        <div style="z-index:999 " class="drawer-bootom-button">
                            <a-button
                                type="primary"
                                @click="handleOk"
                                >
                                {{this.$t('app.CtmCtd01D01.10007') }}
                            </a-button>
                        </div>
        </div>
        </a-card>
    </div>
</template>


<script>
import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import reqwest from 'reqwest';

    export default {
        name: "CtmCtm01D01",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                disableSubmit:false,
                airPortVisible:false,
                orderDate:"",
                Fcarrier:"",
                data:"",
                kuBunValue: 1,
                airPortValue:3,
                radioStyle: {
                display: 'inline-block',
                height: '30px',
                lineHeight: '30px',
                },
                queryParam: {
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 3},
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                confirmLoading: false,
                form: this.$form.createForm(this),

                confirmLoading: false,
                recycleBinVisible: false,
                columns: [],
                url: {
                    list: "",
                },
                dataSource1:[]
            }
        },
        computed: {
            validatorRules:function() {
                return {
                    date: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.CtmCtd01D01.10001')})}]}
                }          
            }
        },
        methods: {
            handleButtonClick(){
            },
            resetClick(){
            },
            handleOk(){
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
            close () {
                //this.visible = false;
            },
            selectKubun(e) {
                if(e.target.value == '2'){
                    this.airPortVisible = true;
                }else{
                    this.airPortVisible = false;
                }
                
                //console.log('radio checked', e.target.value);
            }

    }
}
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>