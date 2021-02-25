<!--
*   
*   ページ： 项目名選択搜索view
*   説明： 用于项目名選択搜索数据
*
-->

<template>
    <a-modal
        :title="title"
        :width="800"
        :visible="visible"
        :confirmLoading="confirmLoading"
        @cancel="handleCancel"
        :cancelText="$t('app.common.close')">
    <template slot="footer">
        <a-button @click="handleCancel">{{this.$t('app.common.close')}}</a-button>
    </template>
    <!-- クエリエリア -->
    <div class="table-page-search-wrapper" style="margin-bottom: 15px">
        <a-form layout="inline" @keyup.enter.native="searchQuery">
            <a-row :gutter="24" >
                <a-col :md="8" :sm="8">
                    <!-- 项目ID -->
                    <a-form-item :label="$t('app.ProjectList.10001')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
                        <a-input :value="selectPjId" style="width: 150px;"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm="8">
                    <a-form-item :label="$t('app.ProjectList.10002')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">  
                        <a-input :value="selectPjName" style="width: 150px;"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :md="4" :sm="8"  class="row-right-model-button">
                    <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
                </a-col>
            </a-row>
        </a-form>

    </div>
    
    <!-- table-begin -->
    <div >
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

            <span slot = "selectNumb" slot-scope="text, record" style="cursor:pointer;text-decoration: none;font-family:'Yu Gothic Medium';font-weight: bold;color: #5D7DA9;"> 
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
        name: "ProjectListSearchName", // 项目名称選択搜索view
        mixins: [JeecgListMixin],
        components: {
            JInput,
        },
        
        data() {
            return {
                title: this.$t('app.ProjectList.10011'),
                visible: false,
                visibleCheck: true,
                selectPjId:"",
                selectPjName:"",
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

                ipagination: {
                    current: 1,
                    pageSize: 5,
                    pageSizeOptions: ['5', '10', '15'],
                    showTotal: (total, range) => {
                        return range[0] + "-" + range[1] + " 共" + total + "条"
                    },
                    showQuickJumper: false,
                    showSizeChanger: false,
                    total: 0
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
                        // 项目ID
                        title: this.$t('app.ProjectList.10001'),
                        align: "center",
                        dataIndex: 'pjId',
                        width:150
                    },
                    {
                        // 项目名称
                        title: this.$t('app.ProjectList.10002'),
                        align: "left",
                        dataIndex: 'pjName'
                    },
                ],
                url: {
                    list: "/sysp/projectList/list",
                },
            }
        },
        created() {
        },
        methods: {
            
            add(pjId,pjName) {
                this.selectPjId = pjId;
                this.selectPjName = pjName;
                this.edit({});
            },
            
            edit(record) {
                if (record.id) {
                    this.dictId = record.dictId;
                    this.visibleCheck = (record.status == 1) ? true : false;
                }
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.model.dictId = this.dictId;
                this.model.status = this.status;
                this.visible = true;
                
                this.$nextTick(() => {
                    this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue', 'description', 'sortOrder'))
                });
            },
            
            onChose(checked) {
                if (checked) {
                    this.status = 1;
                    this.visibleCheck = true;
                } else {
                    this.status = 0;
                    this.visibleCheck = false;
                }
            },
            // 关闭
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
                this.$emit("ok",record.pjId,record.pjName);
                this.close();
            }
        }
    }
</script>