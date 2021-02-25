<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <!-- 职务编号 -->
          <a-col :md="6" :sm="8">
            <a-form-item :label="$t('app.label.positionCode')">
              <a-input  v-model="queryParam.code"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <!-- 职务名称 -->
            <a-form-item :label="$t('app.label.positionName')">
              <a-input   v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <!-- 添加 -->
      <a-button @click="handleAdd" type="primary" icon="plus">添加职位</a-button>
       <!-- 批量删除 -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            {{this.$t('app.common.delete')}}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">{{this.$t('app.common.bulkDelete')}} 
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> {{this.$t('app.common.selected')}}<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>{{this.$t('app.common.item')}}
        <a style="margin-left: 24px" @click="onClearSelected">{{this.$t('app.common.clear')}} </a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{x:1600}"
        :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :rowClassName="InterlaceDiscoloration"
        @change="handleTableChange">

        <span slot="action" slot-scope="text, record">
          <!-- 编辑 -->
          <a @click="handleEdit(record)">
              <a-icon type="edit"/>编辑</a>

          <a-divider type="vertical"/>

          <!-- 删除 -->
          <a-popconfirm :title="$t('app.message.msg0018')" @confirm="() => handleDelete(record.id)">
            <a ><a-icon type="delete"/>删除</a>
          </a-popconfirm>

          <!-- <a-dropdown>
          <a class="ant-dropdown-link" v-html="$t('app.common.more')">
            <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
              </a-menu-item>
            </a-menu>
          </a-dropdown> -->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sys-position-modal ref="modalForm" @ok="modalFormOk"></sys-position-modal>
  </a-card>
</template>

<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import SysPositionModal from './modules/SysPositionModal'
  export default {
    name: 'PositionList',
    mixins: [JeecgListMixin],
    components: {
      SysPositionModal
    },
    data() {
      return {
        description: this.$t('app.label.positionviwe'), 
        // 表头
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key: 'rowIndex',
          //   width: 40,
          //   fixed:"left",
          //   align: 'center',
          //   customRender: function (t, r, index) {
          //     return parseInt(index) + 1
          //   }
          // },
          {
            //职务编码
            title: this.$t('app.label.positionCode'),
            align: 'left',
            width:300,
            dataIndex: 'code'
          },
          {
            //职务名称
            title: this.$t('app.label.positionName'),
            align: 'left',
            width:300,
            dataIndex: 'name'
          },
          {
            //职务职级
            title: this.$t('app.label.positionPostRank'),
            align: 'left',
            width:900,
            dataIndex: 'postRank_dictText'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width:140,
            fixed:"right",
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          //查询
          list: '/sys/position/list',
          //删除
          delete: "/sys/position/delete",
          //批量删除
          deleteBatch: "/sys/position/deleteBatch",
        },
      }
    },
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>