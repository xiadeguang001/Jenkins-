<!--
*   【BLMDCS01D01】
*   ページ： ＢＬ明細データ作成
*   説明： 　ダウンロード画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.BlmDcs01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.BlmDdc01D01.10007')}}</p>
        <a-card :bordered="false">
            <div :style="{padding: '10px 16px',background: '#fff',}">
                <a-spin :spinning="confirmLoading">
                        <!-- ＢＬキャリア -->
                    <a-form :form="form" class="standard-form">
                        <a-form-item :label="$t('app.BlmDdc01D01.10001')"
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol"> 
                            
                            <a-select   style="width: 160px" @click="handleButtonClick">
                                <a-select-option value="01">
                                    01
                                </a-select-option>
                                <a-select-option value="02">
                                    02
                                </a-select-option>
                                <a-select-option value="03">
                                    03
                                </a-select-option>
                                <a-select-option value="04">
                                    04
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                            <!-- 発行日付 -->
                            <a-form-item :label="$t('app.BlmDdc01D01.10002')" 
                                :labelCol="labelCol"
                                :wrapperCol="wrapperCol">
                                <a-range-picker style="width: 300px" :placeholder="[$t('app.OthImp01D01.10008'), $t('app.OthImp01D01.10009')]" @change="onChange" />
                            </a-form-item>
                            <!-- 発行店 -->
                             <a-form-item
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol"
                            :help="flightHelp"
                            :validateStatus="flightValidateStatus"
                            :label="$t('app.BlmDdc01D01.10003')">
                                <a-input v-model="firstflightnofrom"
                                style="width:160px" 
                                @change="flightChange" />
                                <span style="margin-top: 18px;margin-left: 15px;">{{$t('app.MstCap01D01.10014')}}</span>
                                <a-input  v-model="firstflightnoto" 
                                @change="flightChange" 
                                style="margin-left:15px;width:160px"  />
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
                                    {{  this.$t('app.BlmDdc01D01.10004') }}
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


    export default {
        name: "BlmDdc01D01",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                disableSubmit:false,
                fileList: [],
                blcarrier:"",
                data:"",
                flightHelp:"",
                flightValidateStatus:"",
                firstflightnofrom:"",
                firstflightnoto:"",
                queryParam: {
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 3},
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 6 },
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
                      
                }          
                      
            }
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                console.log(record);
                this.flightHelp = "";
                this.flightValidateStatus = "";

                this.$nextTick(() => {
                    this.model.firstflightnofrom = record.firstflightnofrom;
                    this.model.firstflightnoto = record.firstflightnoto;

                    this.form.setFieldsValue(pick(this.model, 'firstflightnofrom'))
                    this.form.setFieldsValue(pick(this.model, 'firstflightnoto'))

                })
            },
             onChange(date, dateString) {
             console.log(date, dateString);
                 },
            handleButtonClick(){
            },
            resetClick(){
            },
            handleOk(){
                this.$emit('ok', this.model);
                this.flightChange();
                this.form.validateFields((err, values) => {
                    if(!err && this.flightHelp == ""){
                        this.close();
                    }
                });
            },
            handleCancel () {
                this.close();
            },
            close () {
                this.visible = false;
            },

            sendDayChange(time,timeString){
            },

            flightChange(){
            if (!/^[0-9]*$/.test(this.firstflightnofrom)){
                this.flightHelp = this.$t("app.BlmDdc01D01.10005");
                this.flightValidateStatus = "error";
            } else if (!/^[0-9]*$/.test(this.firstflightnoto)){
                this.flightHelp = this.$t("app.BlmDdc01D01.10006");
                this.flightValidateStatus = "error";
            }else{
                this.flightHelp = "";
                this.flightValidateStatus = "";
            }
        },

    }
}
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>