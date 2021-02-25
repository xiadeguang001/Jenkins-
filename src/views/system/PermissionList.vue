<template>
  <a-card :bordered="false">

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">{{this.$t('app.common.addition') + this.$t('app.label.menu')}}</a-button>
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="primary"
        icon="delete">{{this.$t('app.common.bulkDelete')}}
      </a-button>
    </div>

    <!-- table区域-begin -->
    <div>

      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>{{this.$t('app.common.selected')}}&nbsp;<a style="font-weight: 600">{{
        selectedRowKeys.length }}</a>{{this.$t('app.common.item')}}&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">{{this.$t('app.common.clear')}}</a>
      </div>

      <a-table
        :columns="columns"
        size="middle"
        bordered
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        :scroll="{x:1500}"
        :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :rowClassName="InterlaceDiscoloration"
        @expandedRowsChange="handleExpandedRowsChange">

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)"> <a-icon type="edit"/>編集</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link" v-html="$t('app.common.more')">
               <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <!-- 详情 -->
              <a-menu-item>
                <a href="javascript:;" @click="handleDetail(record)" v-html="$t('app.common.detail')"></a>
              </a-menu-item>
              <!-- 添加子菜单 -->
              <a-menu-item>
                <a href="javascript:;" @click="handleAddSub(record)" v-html="$t('app.common.addSubmenu')"></a>
              </a-menu-item>
              <!-- 数据规则 -->
              <a-menu-item>
                <a href="javascript:;" @click="handleDataRule(record)" v-html="$t('app.common.dataRules')"></a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() => handleDelete(record.id)">
                  <a v-html="$t('app.common.delete')"></a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
        <!-- 字符串超长截取省略号显示 -->
        <span slot="url" slot-scope="text">
          <j-ellipsis :value="text" :length="25"/>
        </span>
        <!-- 字符串超长截取省略号显示-->
        <span slot="component" slot-scope="text">
          <j-ellipsis :value="text"/>
        </span>
      </a-table>

    </div>
    <!-- table区域-end -->

    <permission-modal ref="modalForm" @ok="modalFormOk"></permission-modal>
    <permission-data-rule-list ref="PermissionDataRuleList" @ok="modalFormOk"></permission-data-rule-list>

  </a-card>
</template>

<script>
  import PermissionModal from './modules/PermissionModal'
  import { getPermissionList } from '@/api/api'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import PermissionDataRuleList from './PermissionDataRuleList'
  import JEllipsis from '@/components/jeecg/JEllipsis'

  export default {
    name: 'PermissionList',
    mixins: [JeecgListMixin],
    components: {
      PermissionDataRuleList,
      PermissionModal,
      JEllipsis
    },
    data() {
      return {
        description: this.$t('app.label.menuManagement'),
        // 表头
        columns : [
        {
          // 菜单名称
          title: this.$t('app.label.menuName'),
          dataIndex: 'name',
          width: 230,
          key: 'name'
        },{
          // 菜单类型
          title: this.$t('app.label.menuType'),
          dataIndex: 'menuType',
          width: 181,
          key: 'menuType',
          customRender: function(text) {
            if (text == 0) {
              return '菜单'
            } else if (text == 1) {
              return '菜单'
            } else if (text == 2) {
              return '按钮/权限'
            } else {
              return text
            }
          }
        },/*{
          title: '权限编码',
          dataIndex: 'perms',
          key: 'permissionCode',
        },*/{
          title: 'アイコン',
          dataIndex: 'icon',
          width: 181,
          key: 'icon'
        },
        {
          // 组件
          title: this.$t('app.label.component'),
          dataIndex: 'component',
          key: 'component',
          width: 248,
          scopedSlots: { customRender: 'component' }
        },
        {
          // 路径
          title: this.$t('app.label.url'),
          dataIndex: 'url',
          key: 'url',
          width: 250,
          scopedSlots: { customRender: 'url' }
        },
        {
          // 排序
          title: this.$t('app.common.sort'),
          dataIndex: 'sortNo',
          width: 250,
          key: 'sortNo'
        },
        {
          title: this.$t('app.label.action'),
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 250,
          fixed: "right"
        }
      ],
        loading: false,
        // 展开的行，受控属性
        expandedRowKeys: [],
        url: {
          list: '/sys/permission/list',
          delete: '/sys/permission/delete',
          deleteBatch: '/sys/permission/deleteBatch'
        }
      }
    },
    methods: {
      loadData() {
        this.dataSource = []
        getPermissionList().then((res) => {
          if (res.success) {
            console.log(res.result)
            this.dataSource = res.result
          }
        })
      },
      // 打开数据规则编辑
      handleDataRule(record) {
        this.$refs.PermissionDataRuleList.edit(record)
      },
      handleAddSub(record) {
        this.$refs.modalForm.title = this.$t('app.label.addSubmenu');
        this.$refs.modalForm.localMenuType = 1;
        this.$refs.modalForm.disableSubmit = false;
        this.$refs.modalForm.edit({status:'1',permsType:'1',route:true,'parentId':record.id});
      },
      handleExpandedRowsChange(expandedRows) {
        this.expandedRowKeys = expandedRows
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>