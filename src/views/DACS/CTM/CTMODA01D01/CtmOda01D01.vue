<!--
*   
*   ページ： コンテナ稼動データ集計画面作成
*   説明： 実行画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.CtmOda01D01.10000')}}</h1>
        <p class="p-pageSubText">{{$t('app.CtmOda01D01.10001')}}</p>
        <a-card :bordered="false">
        <div :style="{padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">    
                <!-- 発注日 -->
                    <a-form-item :label="$t('app.CtmOda01D01.10002')" 
                        :labelCol="labelCol"
                        :wrapperCol="wrapperCol">
                        <a-date-picker v-decorator="['date',validatorRules.date]" style="width: 160px" />
                    </a-form-item>
                <!-- Ｆキャリア -->
                    <a-form-item :label="$t('app.CtmOda01D01.10003')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"> 
                        
                        <a-select style="width: 160px" @click="handleButtonClick">
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
                                {{this.$t('app.CtmOda01D01.10004') }}
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
        name: "CtmOda01D01",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                disableSubmit:false,
                orderDate:"",
                Fcarrier:"",
                data:"",
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
                    date: { rules: [{ required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.CtmOda01D01.10002')})}]}
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
                this.visible = false;
            }

    }
}
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>