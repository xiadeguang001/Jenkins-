<template>
  <!-- 抽屉 -->
  <a-drawer
    :title="$t('app.common.dictSetting')"
    :width="screenWidth"
    @close="onClose"
    :visible="visible"
  >
    <!-- 抽屉内容的border -->
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" :form="form" @keyup.enter.native="searchQuery">
            <a-row :gutter="10">
              <!-- 名称 -->
              <a-col :md="8" :sm="12">
                <a-form-item :label="$t('app.label.itemText')">
                  <a-input style="width: 120px;"  v-model="queryParam.itemText"></a-input>
                </a-form-item>
              </a-col>
              <!-- 状态 -->
              <a-col :md="9" :sm="24">
                <a-form-item :label="$t('app.label.status')" style="width: 170px" :labelCol="labelCol" :wrapperCol="wrapperCol">
                  <a-select v-model="queryParam.status" >
                    <a-select-option value="1">{{this.$t('app.label.normal')}}</a-select-option>
                    <a-select-option value="0">{{this.$t('app.common.disable')}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <!-- 按钮部分 -->
              <a-col :md="7" :sm="24">
              <span style="float: left;" class="table-page-search-submitButtons">
                <!-- 搜索 -->
                <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
                <!-- 重置 -->
                <a-button type="primary" @click="searchReset" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
              </span>
              </a-col>
            </a-row>
            <a-row>
              <!-- 新增 -->
              <a-col :md="2" :sm="24">
                <a-button style="margin-bottom: 10px" type="primary" @click="handleAdd" icon="plus">添加字典明细</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div>
          <a-table
            ref="table"
            bordered
            rowKey="id"
            size="middle"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            @change="handleTableChange"
            :rowClassName="InterlaceDiscoloration"
          >
          <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)"><a-icon type="edit"/>編集</a>
            <a-divider type="vertical"/>
            <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() => handleDelete(record.id)">
              <a > <a-icon type="delete"/>删除</a>
            </a-popconfirm>
          </span>
          </a-table>
        </div>
      </a-form>
    </a-spin>
  <dict-item-modal ref="modalForm" @ok="modalFormOk"></dict-item-modal> <!-- 字典数据 -->
  </a-drawer>
</template>

<script>
  import pick from 'lodash.pick'
  import {filterObj} from '@/utils/util';
  import DictItemModal from './modules/DictItemModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getMsgInfo } from "@/utils/util"

  export default {
    name: "DictItemList",
    mixins: [JeecgListMixin],
    components: {DictItemModal},
    data() {
      return {
        columns: [
          {
            // 名称
            title: this.$t('app.label.itemText'),
            align: "center",
            dataIndex: 'itemText',
          },
          {
            // 数据值
            title: this.$t('app.label.itemValue'),
            align: "center",
            dataIndex: 'itemValue',
          },
          {
            // 操作
            title: this.$t('app.label.action'),
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        queryParam: {
          dictId: "",
          dictName: "",
          itemText: "",
          delFlag: "1",
          status: [],
        },
        title: this.$t('app.label.action'),
        visible: false,
        screenWidth: 800,
        model: {},
        confirmLoading: false,
        dictId: "",
        status: 1,
        labelCol: {
          xs: {span: 5},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 12},
          sm: {span: 12},
        },
        form: this.$form.createForm(this),
        validatorRules: {
          // 名称 必须入力check
          itemText: {rules: [{required: true, message: getMsgInfo(this,'msg0001','itemText') }]},
          // 数据值 必须入力check
          itemValue: {rules: [{required: true, message: getMsgInfo(this,'msg0001','itemValue') }]},
        },
        url: {
          list: "/sys/dictItem/list",
          delete: "/sys/dictItem/delete",
          deleteBatch: "/sys/dictItem/deleteBatch",
        },
      }
    },
    created() {
      // 当页面初始化时,根据屏幕大小来给抽屉设置宽度
      this.resetScreenSize();
    },
    methods: {
      // 新增用
      add(dictId) {
        this.dictId = dictId;
        this.edit({});
      },
      // 编辑用
      edit(record) {
        if (record.id) {
          this.dictId = record.id;
        }
        this.queryParam = {}
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.model.dictId = this.dictId;
        this.model.status = this.status;
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'itemText', 'itemValue'))
        });
        // 当其它模块调用该模块时,调用此方法加载字典数据
        this.loadData();
      },
      // 前画面的传参
      getQueryParams() {
        var param = Object.assign({}, this.queryParam);
        param.dictId = this.dictId;
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },

      // 添加字典数据
      handleAdd() {
        this.$refs.modalForm.add(this.dictId);
        this.$refs.modalForm.title = this.$t('app.common.add');
      },
      showDrawer() {
        this.visible = true
      },
      // 取消/关闭
      onClose() {
        this.visible = false
        this.form.resetFields();
        this.dataSource = [];
      },
      // 抽屉的宽度随着屏幕大小来改变
      resetScreenSize() {
        let screenWidth = document.body.clientWidth;
        if (screenWidth < 600) {
          this.screenWidth = screenWidth;
        } else {
          this.screenWidth = 600;
        }
      },
    }
  }
</script>
<style scoped>
</style>