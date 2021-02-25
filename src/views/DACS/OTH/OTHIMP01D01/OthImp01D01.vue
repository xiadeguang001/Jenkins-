<!--
*   
*   ページ： フライト情報取込
*   説明： 実行画面
*
-->
<template>
    <div>
        <h1 class="p-pageTitle">{{$t('app.OthImp01D01.10000')}}</h1>
        <a-card :bordered="false">
         <div :style="{padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
            <!-- Ｆキャリア -->
                <a-form :form="form" class="standard-form">
                    <a-form-item :label="$t('app.OthImp01D01.10002')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"> 
                           
                        <a-select  v-decorator="['Fcarrier',validatorRules.Fcarrier]" style="width: 170px" @click="handleButtonClick">
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
             <!-- 処理日 -->
                        <a-form-item :label="$t('app.OthImp01D01.10003')" 
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                            <a-range-picker v-decorator="['date',validatorRules.date]" style="width: 300px" :placeholder="[$t('app.OthImp01D01.10008'), $t('app.OthImp01D01.10009')]" @change="onChange" />
                        </a-form-item>
            <!-- 取込ファイル -->
                        <a-form-item :label="$t('app.OthImp01D01.10004')" 
                            :labelCol="labelCol"
                            :wrapperCol="wrapperCol">
                            <template>
                                <div class="clearfix">
                                <a-upload :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload" v-decorator="['upload',validatorRules.upload]">
                                <a-button style="width: 170px"> <a-icon type="upload" />{{this.$t('app.OthImp01D01.100012')}}</a-button>
                                </a-upload>
                                    
                                </div>
                            </template>
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
                                :loading="uploading"
                                @click="handleUpload"
                                >
                                 {{ uploading ? 'Uploading' : this.$t('app.OthImp01D01.10006') }}
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
        name: "OthSdc02D01",
        mixins: [JeecgListMixin],
        components: {
            
        },
        data() {
            return {
                description: this.$t('app.label.user.view'), // 航空便積込問合せ
                disableSubmit:false,
                hakoutencd: "",
                fileList: [],
                uploading: false,
                Fcarrier:"",
                data:"",
                upload:"",
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
                      Fcarrier: { rules: [{ required: true, message: this.$t('app.OthImp01D01.10005')}]},

                      date:{ rules: [{ required: true, message: this.$t('app.OthImp01D01.10007')}]},

                      upload:{ rules: [{ required: true, message: this.$t('app.OthImp01D01.100013')}]}
                }          
                      
            }
        },
        methods: {
             onChange(date, dateString) {
             console.log(date, dateString);
                 },
            handleButtonClick(){
            },
            resetClick(){
            },
            // handleOk(){
            //      const that = this;
            //     this.form.validateFields((err, values) => {
            //         if(!err){
            //             this.close();
            //         }
            //     });
            // },
            handleCancel () {
                this.close();
            },
            close () {
                this.visible = false;
            },

            sendDayChange(time,timeString){
            },

            edit (record) {
                this.form.resetFields();
                console.log(record);
                this.model = Object.assign({}, record);
                this.visible = true;
                console.log(record);
                   if (record.status != '1') {
                    console.log(1);
                    console.log(record.blcarriercd);
                    this.disabledFlg = true;
                    this.Fcarrier = record.Fcarrier;
                    this.$nextTick(() => {
                        this.model.Fcarrier = record.Fcarrier;
                        this.form.setFieldsValue(pick(this.model, 'Fcarrier'))
                    })
                
                }
            },
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList;
            },
            beforeUpload(file) {
                this.fileList = [...this.fileList, file];
                return false;
            },
            handleUpload() {
                this.form.validateFields((err, values) => {
                    if(!err){
                        this.close();
                    }
                });
            
                console.log(this.fileList)
                if(this.fileList.length === 0){
                this.$message.error(this.$t('app.OthImp01D01.100011'));
                }else{
                    const { fileList } = this;
                    const formData = new FormData();
                    fileList.forEach(file => {
                        formData.append('files[]', file);
                    });
                    this.uploading = true;
                    reqwest({
                        // url: '',
                        // method: 'post',
                        // processData: false,
                        // data: formData,
                        success: () => {
                        this.fileList = [];
                        this.uploading = false;
                        this.$message.success(this.$t('app.OthImp01D01.100010'));
                        },
                        error: () => {
                        this.uploading = false;
                        this.$message.error(thisl.$t('app.OthImp01D01.100011'));
                        },
                    });

                }
            
            }

    }
}
 </script>
<style scoped>
     @import '~@assets/less/common.less'
 </style>