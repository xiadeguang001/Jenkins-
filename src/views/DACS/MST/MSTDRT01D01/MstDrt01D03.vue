<!--
*   
*   ページ： 発行店選択view
*   説明： 用于発行店選択搜索数据
*
-->

<template>
    <a-modal
        :title="title"
        :width="800"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        :cancelText="$t('app.common.close')">
        <template slot="footer">
            <a-button @click="handleCancel">{{this.$t('app.common.close')}}</a-button>
        </template>

        <div class="table-page-search-wrapper" style="margin-bottom: 15px">
            <a-form layout="inline" @keyup.enter.native="searchQuery">

                <a-row :gutter="24" >
                    <a-col :md="8" :sm="8">
                        <!-- 発行店コード -->
                        <a-form-item :label="$t('app.MstDrt01D01.10003')">
                            <a-input :value="selectCode" style="width: 150px;"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="12" :sm="8">
                        <a-form-item :label="$t('app.MstDrt01D01.10014')"> 
                            <a-input :value="selectDescription" style="width: 150px;"></a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :md="4" :sm="8" class="row-right-model-button">
                        <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
                    </a-col>
                </a-row>
            </a-form>
        </div>

        <!-- table-begin -->
        <div>
            <a-table
                ref="table"
                bordered
                size="middle"
                :rowKey="(record,index)=>{return index}"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :loading="loading"
                :rowClassName="InterlaceDiscoloration"
                @change="handleTableChange">
                <span slot = "selectNumb" slot-scope="text, record" style="cursor:pointer;text-decoration: none;font-family: 'Yu Gothic Medium';font-weight: bold;color: #5D7DA9;"> 
                    <a  @click="selectRow(record)" > ◆</a>
                </span>;
            </a-table>
        </div>
        <!-- table-end -->
    </a-modal>
</template>

<script>
    import pick from 'lodash.pick'
    import {addDictItem, editDictItem} from '@/api/api'
    import { getMsgInfo } from "@/utils/util"
    import {getAction} from '@/api/manage';
    import {frozenBatch} from '@/api/api'
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import JInput from '@/components/jeecg/JInput'

    export default {
        name: "MstDrt01D03",
        mixins: [JeecgListMixin],
        components: {
            JInput,
        },
        data() {
            return {
                title: this.$t('app.MstDrt01D01.10015'),
                visible: false,
                visibleCheck: true,
                selectCode:"",
                selectDescription:"",
                model: {},
                dictId: "",
                status: 1,
                labelCol: {
                    xs: {span: 24},
                    sm: {span: 5},
                },
                wrapperCol: {
                    xs: {span: 24},
                    sm: {span: 16},
                },
                confirmLoading: false,
                form: this.$form.createForm(this),
                validatorRules: {
                    itemText: {rules: [{required: true, message: getMsgInfo(this,'msg0001','itemText') }]},
                    itemValue: {rules: [{required: true, message: getMsgInfo(this,'msg0001','itemValue') }]},
                },
                columns:[
                    {
                        title: 'No',
                        dataIndex: '',
                        key:'rowIndex',
                        width:40,
                        align:"center",
                        customRender:function (t,r,index) {
                            return parseInt(index)+1;
                        }
                    },
                    {
                        title: this.$t('app.common.select'),
                        width:50,
                        align:"center",
                        scopedSlots: {customRender: 'selectNumb'},
                    },
                    {
                        // 発行店コード
                        title: this.$t('app.MstDrt01D01.10003'),
                        align: "center",
                        dataIndex: 'hakoutencd',
                        width:150
                    },
                    {
                        // 発行店名
                        title: this.$t('app.MstDrt01D01.10014'),
                        align: "left",
                        dataIndex: 'hakoutennm'
                    },
                ],
                url: {
                    list: "/dacs/dairitenMaintenance/hakoutenSearch",
                },
            }
        },
        created() {
        },
        methods: {
            
            add(hakoutencd,hakoutennm) {
                this.selectCode = hakoutencd;
                this.selectDescription = hakoutennm;
                this.edit({});
            },
            
            edit(record) {
                if (record.id) {
                    this.dictId = record.dictId;
                    this.visibleCheck = (record.status == 1) ? true : false;
                }
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                
                
            },

            handleOk() {
                this.close();
            },

            handleCancel() {
                this.close();
            },
            close() {
                this.$emit('close');
                this.visible = false;
            },
            onSearch(){

            },
            selectRow(record){
                this.$emit("ok",record.hakoutencd,record.hakoutennm);
                this.close();
            }
        }
    }
</script>