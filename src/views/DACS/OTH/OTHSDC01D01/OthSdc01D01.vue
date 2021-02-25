<!--
*   [OTH-SDC01D01]
*   ページ： 送信データ作成
*   説明： 実行画面
*
-->

<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.OthSdc01D01.10000')}}</h1>
         <a-card :bordered="false">
         <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    <div id="app">
                            <a-radio-group  v-model="value" @change="onChange">
                                <a-radio :style="radioStyle" :value="1">
                                {{$t('app.OthSdc01D01.10001')}}
                                </a-radio><br>
                                <a-radio :style="radioStyle" :value="2">
                                {{$t('app.OthSdc01D01.10002')}}
                                </a-radio><br>
                                <a-radio :style="radioStyle" :value="3">
                                {{$t('app.OthSdc01D01.10003')}}
                                </a-radio>
                            </a-radio-group>
                        </div>
                </a-form>
            </a-spin>

             <div>
                 &nbsp;&nbsp;
             </div>

            <div class="fill-drawer-bottom"></div>
            <div style="z-index:999 " class="drawer-bootom-button">
                <a-button  @click="handleOk" type="primary" :loading="confirmLoading"  >{{this.$t('app.OthImp01D01.10006')}}</a-button> 
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
        name: "OthSdc01D01",
        mixins: [JeecgListMixin],

        components: {
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                picked :"",
                form:{},
                disableSubmit:false,
                value: 1,
                radioStyle: {
                display: 'block',
                height: '30px',
                lineHeight: '30px',
                },
                queryParam: {
                },
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 8 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 },
                },
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
        },
        methods: {
            handleButtonClick(){
            },
            resetClick(){
            },
            handleOk(){
                 this.$emit('ok', this.model);
                this.close();
            },
            edit (record) {
                this.form.resetFields();
                console.log(record);
            },
           onChange(e) {
           console.log('radio checked', e.target.value);
            },
           close () {
                this.visible = false;
            },

        }

    }
    
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>