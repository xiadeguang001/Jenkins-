<!--
*   
*   ページ： コンテナ棚卸表問合せ画面
*   説明： 要約データを表示するために使用されます
*
-->
<template>
    <div>
    <h1 class="p-pageTitle">{{$t('app.CtmCit01D01.10000')}}</h1>
    <p class="p-pageSubText">{{$t('app.CtmCit01D01.10001')}}</p>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline" @keyup.enter.native="searchQuery">
                <div class="table-operator">
                    <a-row :gutter="24" >
                        <a-col :md="20" :sm="8">
                            
                        </a-col>
                        <a-col :md="4" :sm="8" class="row-right-button">
                            <a-button style="" icon="printer" @click="searchQuery" />
                            <a-button style="" icon="zoom-in" @click="onSearchModel" />
                        </a-col>
                    </a-row>
                </div>
            </a-form>
        </div>
        
        <!-- table区域-begin -->
        <div>
            <a-table
                ref="table"
                bordered
                size="middle"
                :rowKey="(record,index)=>{return index}"
                :columns="columns"
                :dataSource="dataSource1"
                :pagination="ipagination"
                :loading="loading"
                :scroll="{x:1200}"
                :rowClassName="InterlaceDiscoloration"
                :show-header="false"
                @change="handleTableChange">

                
            </a-table>
        </div>
        <!-- table区域-end -->
        <ctm-cit-01-d-02 ref="CtmCit01D02" @ok="searchOk"></ctm-cit-01-d-02>
    </a-card>  
    </div>
</template>

<script>
import {getAction} from '@/api/manage';
import {frozenBatch} from '@/api/api'
import {JeecgListMixin} from '@/mixins/JeecgListMixin'
import JInput from '@/components/jeecg/JInput'
import CtmCit01D02 from './CtmCit01D02'; // 明細画面
export default {
        name: "CtmCit01D01",
        mixins: [JeecgListMixin],
        components: {
            JInput,
            CtmCit01D02
        },
        data() {
            return {
                description: this.$t('app.label.user.view'),
                storageLocation:"",
                column1:"",
                column2:"",
                column3:"",
                column4:"",
                column5:"",
                column6:"",
                column7:"",
                column8:"",
                column9:"",
                column10:"",
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
                recycleBinVisible: false,
                columns: [
                    {
                        dataIndex: '',
                        key:'rowIndex',
                        width:40,
                        align:"center",
                        customRender:function (text, record, index) {
                            return parseInt(index)+1;
                        }
                    },
                    {
                        // 
                        align: "center",
                        dataIndex: 'column1',
                        width: 80,
                    },
                    {
                        // 
                        align: "center",
                        dataIndex: 'column2',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column3',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column4',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column5',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column6',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column7',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column8',
                        width: 80,
                    }
                    ,
                    {
                        // 
                        align: "center",
                        dataIndex: 'column9',
                        width: 80,
                    },
                    {
                        // 
                        align: "center",
                        dataIndex: 'column10',
                        width: 80,
                    }
                    
                ],
                url: {
                    
                },
                dataSource1:[{
                        column1:"87001",
                        column2:"87002",
                        column3:"87003",
                        column4:"87004",
                        column5:"87005",
                        column6:"87006",
                        column7:"87007",
                        column8:"87008",
                        column9:"87009",
                        column10:"87010",
                    },
                    {
                        column1:"87101",
                        column2:"87102",
                        column3:"87103",
                        column4:"87104",
                        column5:"87105",
                        column6:"87106",
                        column7:"87107",
                        column8:"87108",
                        column9:"87109",
                        column10:"87110",
                    },
                    {
                        column1:"87201",
                        column2:"87202",
                        column3:"87203",
                        column4:"87204",
                        column5:"87205",
                        column6:"87206",
                        column7:"87207",
                        column8:"87208",
                        column9:"87209",
                        column10:"87210",
                    },
                    {
                        column1:"87301",
                        column2:"87302",
                        column3:"87303",
                        column4:"87304",
                        column5:"87305",
                        column6:"87306",
                        column7:"87307",
                        column8:"87308",
                        column9:"87309",
                        column10:"87310",
                    },
                    {
                        column1:"87401",
                        column2:"87402",
                        column3:"87403",
                        column4:"87404",
                        column5:"87405",
                        column6:"87406",
                        column7:"87407",
                        column8:"87408",
                        column9:"87409",
                        column10:"87410",
                    },
                    {
                        column1:"87501",
                        column2:"87502",
                        column3:"87503",
                        column4:"87504",
                        column5:"87505",
                        column6:"87506",
                        column7:"87507",
                        column8:"87508",
                        column9:"87509",
                        column10:"87510",
                    }],
            }
        },
        computed: {
            
        },
        methods: {
            onSearchModel(){
                this.$refs.CtmCit01D02.edit(this.queryParam);
            },
            searchOk(params) {
                this.queryParam = params;
                this.loadData();
            }
        }

    }
</script>
<style scoped>
    @import '~@assets/less/common.less'
</style>
