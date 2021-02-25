<template>
  <a-card :bordered="false">

    <!-- 左侧面板 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="12">
          <!-- 字典名称 -->
          <a-col :md="7" :sm="8">
            <a-form-item :label="$t('app.label.dictName')" :labelCol="{span: 6}" :wrapperCol="{span: 14, offset: 1}">
              <j-input v-model="queryParam.dictName"></j-input>
            </a-form-item>
          </a-col>
          <!-- 字典编码 -->
          <a-col :md="7" :sm="8">
            <a-form-item :label="$t('app.label.dictCode')" :labelCol="{span: 6}" :wrapperCol="{span: 14, offset: 1}">
              <j-input v-model="queryParam.dictCode"></j-input>
            </a-form-item>
          </a-col>
          <!-- 按钮 -->
          <a-col :md="7" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <!-- 查询按钮 -->
              <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
              <!-- 重置 -->
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>

      <div class="table-operator" style="border-top: 5px">
        <!-- 新增按钮 -->
        <a-button @click="handleAdd" type="primary" icon="plus">添加字典</a-button>
        <!-- 字典信息按钮 -->
        <!-- <a-button type="primary" icon="download" @click="handleExportXls($t('app.label.dictInformation'))">{{this.$t('app.common.export')}}</a-button> -->
        <!-- 导入按钮 -->
        <!-- <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
          <a-button type="primary" icon="import">{{this.$t('app.common.import')}}</a-button>
        </a-upload> -->
        <!-- 刷新缓存按钮 -->
        <a-button type="primary" icon="sync" @click="refleshCache()">{{this.$t('app.common.refleshCache')}}</a-button>
        <!-- 回收站 -->
        <a-button type="primary" icon="hdd" @click="openDeleteList">{{this.$t('app.common.recycleBin')}}</a-button>
      </div>

      <a-table
        ref="table"
        bordered
        rowKey="id"
        size="middle"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{x:1600}"
        :rowClassName="InterlaceDiscoloration"
        @change="handleTableChange">
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">
              <a-icon type="edit"/>编辑</a>
            
          <a-divider type="vertical"/>

          <a @click="editDictItem(record)"><a-icon type="unordered-list"/>字典列表 </a>

          <a-divider type="vertical"/>
          <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() =>handleDelete(record.id)">
            <a><a-icon type="delete"/>删除</a>
          </a-popconfirm>
        </span>
      </a-table>

    </div>
    <dict-modal ref="modalForm" @ok="modalFormOk"></dict-modal>  <!-- 字典类型 -->
    <dict-item-list ref="dictItemList"></dict-item-list>
    <dict-delete-list ref="dictDeleteList"></dict-delete-list>
  </a-card>
</template>

<script>
  import { filterObj } from '@/utils/util';
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import DictModal from './modules/DictModal'
  import DictItemList from './DictItemList'
  import DictDeleteList from './DictDeleteList'
  import { getAction } from '@/api/manage'
  import JInput from '@/components/jeecg/JInput'

  export default {
    name: "DictList",
    mixins:[JeecgListMixin],
    components: {DictModal, DictItemList,DictDeleteList,JInput},
    data() {
      return {
        description: this.$t('app.label.dictView'),
        visible: false,
        // 查询条件
        queryParam: {
          dictCode: "",
          dictName: "",
        },
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key: 'rowIndex',
          //   width: 40,
          //   fixed:"left",
          //   align: "center",
          //   customRender: function (t, r, index) {
          //     return parseInt(index) + 1;
          //   }
          // },
          {
            // 字典名称
            title: this.$t('app.label.dictName'),
            align: "left",
            width: 280,
            dataIndex: 'dictName',
          },
          {
            // 字典编码
            title: this.$t('app.label.dictCode'),
            align: "left",
            width: 280,
            dataIndex: 'dictCode',
          },
          {
            // 描述
            title: this.$t('app.label.description'),
            align: "left",
            dataIndex: 'description',
          },
          {
            // 操作
            title: this.$t('app.label.action'),
            dataIndex: 'action',
            align: "center",
            width: 260,
            fixed:"right",
            scopedSlots: {customRender: 'action'},
          }
        ],
        dict: "",
        labelCol: {
          xs: {span: 8},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 16},
          sm: {span: 19},
        },
        url: {
          list: "/sys/dict/list",
          delete: "/sys/dict/delete",
          exportXlsUrl: "sys/dict/exportXls",
          importExcelUrl: "sys/dict/importExcel",
          refleshCache: "sys/dict/refleshCache",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      //取消选择
      cancelDict() {
        this.dict = "";
        this.visible = false;
        this.loadData();
      },
      //编辑字典数据
      editDictItem(record) {
        this.$refs.dictItemList.edit(record);
      },
      // 重置字典类型搜索框的内容
      searchReset() {
        var that = this;
        that.queryParam.dictName = "";
        that.queryParam.dictCode = "";
        that.loadData(this.ipagination.current);
      },
      openDeleteList(){
        this.$refs.dictDeleteList.show()
      },
      refleshCache(){
        getAction(this.url.refleshCache).then((res) => {
          if (res.success) {
            this.$message.success(this.$t('app.message.msg0031'));
          }
        }).catch(e=>{
          this.$message.warn(this.$t('app.message.msg0032'));
          console.log(this.$t('app.message.msg0033'),e)
        })
      }
    },
    watch: {
      openKeys(val) {
        console.log('openKeys', val)
      },
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>