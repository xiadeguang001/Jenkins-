<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <!-- 检索部 标题 -->
          <a-col :span="6">
            <a-form-item :label="$t('app.label.titile')">
              <a-input v-model="queryParam.titile"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :span="6">
            <a-form-item label="内容">
              <a-input placeholder="请输入内容" v-model="queryParam.msgContent"></a-input>
            </a-form-item>
          </a-col>-->

          <!-- 按钮部分  -->
          <a-col :span="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <!-- 查询 -->
              <a-button type="primary" @click="searchQuery" icon="search">{{this.$t('app.common.search')}}</a-button>
              <!-- 重置 -->
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加通告</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls($t('app.label.systemAnnouncement'))">{{this.$t('app.common.export')}}</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">{{this.$t('app.common.import')}}</a-button>
      </a-upload> -->
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            {{this.$t('app.common.delete')}}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> {{this.$t('app.common.batchOperation')}}
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> {{this.$t('app.common.selected')}} <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">{{this.$t('app.common.clear')}}</a>
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
          
          <a  v-if="record.sendStatus == 0" @click="handleEdit(record)" >
              <a-icon type="edit"/>编辑</a>

          <a-divider type="vertical" v-if="record.sendStatus == 0"/>
          <a-dropdown>
            <a class="ant-dropdown-link" v-html="$t('app.common.more')"> <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <!--  删除 -->
              <a-menu-item v-if="record.sendStatus != 1">
                <a-popconfirm :title="$t('app.message. msg0018')" @confirm="() => handleDelete(record.id)">
                  <a v-html="$t('app.common.delete')"></a>
                </a-popconfirm>
              </a-menu-item>
              <!-- 发布 -->
              <a-menu-item v-if="record.sendStatus == 0">
                <a-popconfirm :title="$t('app.message.msg0037')" @confirm="() => releaseData(record.id)">
                  <a v-html="$t('app.common.release')"></a>
                </a-popconfirm>
              </a-menu-item>
              <!-- 撤销 -->
              <a-menu-item v-if="record.sendStatus == 1">
                <a-popconfirm :title="$t('app.message.msg0036')" @confirm="() => reovkeData(record.id)">
                  <a v-html="$t('app.common.revoke')"></a>
                </a-popconfirm>
              </a-menu-item>
              <!-- 查看 -->
              <a-menu-item>
                  <a @click="handleDetail(record)" v-html="$t('app.common.see')"></a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <sysAnnouncement-modal ref="modalForm" @ok="modalFormOk"></sysAnnouncement-modal>
  </a-card>
</template>

<script>
  import SysAnnouncementModal from './modules/SysAnnouncementModal'
  import {doReleaseData, doReovkeData} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'

  export default {
    name: "SysAnnouncementList",
    mixins: [JeecgListMixin],
    components: {
      SysAnnouncementModal
    },
    data() {
      return {
        description: this.$t('app.label.view'),
        // 查询条件
        queryParam: {},
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
            // 标题
            title: this.$t('app.label.titile'),
            align: "left",
            dataIndex: 'titile'
          },
          {
            // 消息类型
            title: this.$t('app.label.msgCategory'),
            align: "left",
            dataIndex: 'msgCategory',
            customRender:(text) =>{
              if (text == '1') {
                return this.$t('app.label.notice');
              } else if (text == "2") {
                return this.$t('app.label.message');
              } else {
                return text;
              }
            }
          },
          /*{
            title: '开始时间',
            align: "center",
            dataIndex: 'startTime'
          },
          {
            title: '结束时间',
            align: "center",
            dataIndex: 'endTime'
          },*/
          {
            // 发布人
            title: this.$t('app.label.releasePeople'),
            align: "left",
            dataIndex: 'sender'
          },
          {
            // 优先级
            title: this.$t('app.label.priority'),
            align: "left",
            dataIndex: 'priority',
            customRender:(text)=> {
              if (text == 'L') {
                return this.$t('app.label.low');
              } else if (text == "M") {
                return this.$t('app.label.in');
              } else if (text == "H") {
                return this.$t('app.label.high');
              } else {
                return text;
              }
            }
          },
          {
            // 通告对象
            title: this.$t('app.label.notificationObject'),
            align: "left",
            dataIndex: 'msgType',
            customRender:(text)=> {
              if (text == 'USER') {
                return this.$t('app.label.specifyUsers');
              } else if (text == "ALL") {
                return this.$t('app.label.allUsers');
              } else {
                return text;
              }
            }
          },
          {
            // 发布状态
            title: this.$t('app.label.releaseStatus'),
            align: "left",
            dataIndex: 'sendStatus',
            customRender: (text)=> {
              if (text == 0) {
                return this.$t('app.label.unpublished');
              } else if (text == 1) {
                return this.$t('app.label.published');
              } else if (text == 2) {
                return this.$t('app.label.rescinded');
              } else {
                return text;
              }
            }
          },
          {
            // 发布时间
            title: this.$t('app.label.releaseTime'),
            align: "left",
            dataIndex: 'sendTime'
          },
          {
            // 撤销时间
            title: this.$t('app.label.revokeTime'),
            align: "left",
            dataIndex: 'cancelTime'
          },
          /*{
                title: '删除状态（0，正常，1已删除）',
                align:"center",
                dataIndex: 'delFlag'
              },*/
          {
            // 操作
            title: this.$t('app.label.action'),
            dataIndex: 'action',
            align: "center",
            fixed:"right",
            width:155,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/sys/annountCement/list",
          delete: "/sys/annountCement/delete",
          deleteBatch: "/sys/annountCement/deleteBatch",
          releaseDataUrl: "/sys/annountCement/doReleaseData",
          reovkeDataUrl: "sys/annountCement/doReovkeData",
          exportXlsUrl: "sys/annountCement/exportXls",
          importExcelUrl: "sys/annountCement/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      //执行发布操作
      releaseData: function (id) {
        console.log(id);
        var that = this;
        doReleaseData({id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData(1);
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //执行撤销操作
      reovkeData: function (id) {
        var that = this;
        doReovkeData({id: id}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData(1);
          } else {
            that.$message.warning(res.message);
          }
        });
      },
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>