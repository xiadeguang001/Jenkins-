<!--
*   
*   ページ： ＢＬキャリア選択搜索view
*   説明： 用于ＢＬキャリア選択搜索数据
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
                    <!-- ＢＬキャリア -->
                    <a-form-item :label="$t('app.ProjectMemberList.10003')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">
                        <a-input v-model="queryParam.id" style="width: 150px;"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm="8">
                    <a-form-item :label="$t('app.ProjectMemberList.10002')"
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol">  
                        <a-input v-model="queryParam.username" style="width: 150px;"></a-input>
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
    import {JeecgListMixin} from '@/mixins/JeecgListMixin'
    import JInput from '@/components/jeecg/JInput'

    export default {
        name: "ProjectMemberSearch", // ＢＬキャリア選択搜索view
        mixins: [JeecgListMixin],
        components: {
            JInput,
        },
        
        data() {
            return {
                title: this.$t('app.ProjectMemberList.10008'),
                visible: false,
                visibleCheck: true,
                queryParam: {
                    id:"",
                    username:"",
                },
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
                        // 项目人员ID
                        title: this.$t('app.ProjectMemberList.10003'),
                        align: "center",
                        dataIndex: 'id',
                        width:150
                    },
                    {
                        // 项目人员名称
                        title: this.$t('app.ProjectMemberList.10002'),
                        align: "left",
                        dataIndex: 'username'
                    },
                ],
                url: {
                    list: "pro/projectMember/userList",
                },
            }
        },
        methods: {
            show() {
                this.form.resetFields();
                this.visible = true;
            },
            handleCancel() {
                this.close();
            },
            close() {
                this.$emit('close');
                this.visible = false;
            },
            selectRow(record){
                this.$emit("ok",record.id,record.username);
                this.close();
            }
        }
    }
</script>