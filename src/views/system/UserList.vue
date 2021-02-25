<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">

          <!-- 用户账号 -->
          <a-col :md="5" :sm="8">
            <a-form-item :label="$t('app.label.user.accountNumber')">
              <a-input  v-model="queryParam.username"></a-input>
            </a-form-item>
          </a-col>

          <!-- 性别 -->
          <a-col :md="5" :sm="8">
            <a-form-item :label="$t('app.label.user.sex')" >
              <j-dict-select-tag dictCode="sex" :triggerChange="false" v-model="queryParam.sex"/>
            </a-form-item>
          </a-col>
          <!-- 用户状态 -->
          <a-col :md="5" :sm="8">
            <a-form-item :label="$t('app.label.user.status')">
              <j-dict-select-tag dictCode="status" :triggerChange="false" v-model="queryParam.status"/>
            </a-form-item>
          </a-col>

          <!-- 按钮部分 -->
          <a-col :md="6" :sm="8">
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
    <div class="table-operator" style="border-top: 5px">
      <a-button @click="handleAdd" type="primary" icon="plus">{{this.$t('app.common.addUser')}}</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay" @click="handleMenuClick">
          <a-menu-item key="1">
            <a-icon type="delete" @click="batchDel"/>
            {{this.$t('app.common.delete')}}
          </a-menu-item>
          <a-menu-item key="2">
            <a-icon type="lock" @click="batchFrozen('2')"/>
            {{this.$t('app.common.frozen')}}
          </a-menu-item>
          <a-menu-item key="3">
            <a-icon type="unlock" @click="batchFrozen('1')"/>
            {{this.$t('app.common.thaw')}}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          {{this.$t('app.common.batchOperation')}}
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>{{this.$t('app.common.selected')}}&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a>{{this.$t('app.common.item')}}&nbsp;&nbsp;
        <a style="margin-left: 24px" @click="onClearSelected">{{this.$t('app.common.clear')}}</a>
      </div>

      <a-table
        ref="table"
        bordered
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{x:1600}"
        :rowSelection="{fixed:true,selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :rowClassName="InterlaceDiscoloration"
        @change="handleTableChange">

        <template slot="avatarslot" slot-scope="text, record">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(record.avatar)" icon="user"/>
          </div>
        </template>

        <span slot="action" slot-scope="text, record">
            <a @click="handleEdit(record)" >
            <a-icon type="edit"/>{{$t('app.common.edit')}}</a>

          <a-divider type="vertical"/>

          <a-dropdown>
            <a class="ant-dropdown-link" v-html="$t('app.common.more')">
               <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">

              <a-menu-item>
                <a href="javascript:;" @click="handleChangePassword(record.username)" v-html="$t('app.common.password')"></a>
              </a-menu-item>

              <a-menu-item>
                <a-popconfirm :title="$t('app.message. msg0018')" @confirm="() => handleDelete(record.id)">
                  <a v-html="$t('app.common.delete')"></a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==1">
                <a-popconfirm :title="$t('app.message.msg0019')" @confirm="() => handleFrozen(record.id,2,record.username)">
                  <a v-html="$t('app.common.frozen')"></a>
                </a-popconfirm>
              </a-menu-item>

              <a-menu-item v-if="record.status==2">
                <a-popconfirm :title="$t('app.message.msg0020')" @confirm="() => handleFrozen(record.id,1,record.username)">
                  <a v-html="$t('app.common.thaw')"></a>
                </a-popconfirm>
              </a-menu-item>

<!--               <a-menu-item>
                <a href="javascript:;" @click="handleAgentSettings(record.username)" v-html="$t('app.common.agent')"></a>
              </a-menu-item> -->

            </a-menu>
          </a-dropdown>
        </span>


      </a-table>
    </div>
    <!-- table区域-end -->

    <user-modal ref="modalForm" @ok="modalFormOk"></user-modal>

    <password-modal ref="passwordmodal" @ok="passwordModalOk"></password-modal>

    <sys-user-agent-modal ref="sysUserAgentModal"></sys-user-agent-modal>

    <!-- 用户回收站 -->
    <user-recycle-bin-modal :visible.sync="recycleBinVisible" @ok="modalFormOk"/>

  </a-card>
</template>

<script>
  import UserModal from './modules/UserModal'
  import PasswordModal from './modules/PasswordModal'
  import {putAction,getFileAccessHttpUrl} from '@/api/manage';
  import {frozenBatch} from '@/api/api'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import SysUserAgentModal from "./modules/SysUserAgentModal";
  import JInput from '@/components/jeecg/JInput'
  import UserRecycleBinModal from './modules/UserRecycleBinModal'

  export default {
    name: "UserList",
    mixins: [JeecgListMixin],
    components: {
      SysUserAgentModal,
      UserModal,
      PasswordModal,
      JInput,
      UserRecycleBinModal
    },
    data() {
      return {
        description: this.$t('app.label.user.view'),
        queryParam: {
          status : "1",
          sex:'',
          username:''
        
        },
        recycleBinVisible: false,
        columns: [
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key:'rowIndex',
          //   width:40,
          //   align:"center",
          //   fixed:"left",
          //   customRender:function (t,r,index) {
          //     return parseInt(index)+1;
          //   }
          // },
          {
            // 用户账号
            title: this.$t('app.label.user.userName'),
            align: "left",
            dataIndex: 'username',
            width: 330
          },
          {
            // 用户姓名
            title: this.$t('app.label.user.userRealName'),
            align: "left",
            width: 220,
            dataIndex: 'realname',
          },
          {
            // 头像
            title: this.$t('app.label.user.avatar'),
            align: "center",
            width: 140,
            dataIndex: 'avatar',
            scopedSlots: {customRender: "avatarslot"}
          },

          {
            // 性别
            title: this.$t('app.label.user.sex'),
            align: "left",
            width: 100,
            dataIndex: 'sex_dictText',
            sorter: true
          },
          {
            // 生日
            title: this.$t('app.label.user.birthday'),
            align: "left",
            width: 140,
            dataIndex: 'birthday'
          },
          {
            // 手机号码
            title: this.$t('app.label.user.phoneNumber'),
            align: "left",
            width: 160,
            dataIndex: 'phone'
          },
          {
            // 状态
            title: this.$t('app.label.user.status'),
            align: "left",
            width: 360,
            dataIndex: 'status_dictText'
          },
          {
            // 操作
            title: this.$t('app.common.operation'),
            dataIndex: 'action',
            scopedSlots: {customRender: 'action'},
            align: "center",
            width: 140,
            fixed:"right",
          }

        ],
        url: {
          imgerver: window._CONFIG['staticDomainURL'],
          syncUser: "/process/extActProcess/doSyncUser",
          list: "/sys/user/list",
          delete: "/sys/user/delete",
          deleteBatch: "/sys/user/deleteBatch",
          exportXlsUrl: "/sys/user/exportXls",
          importExcelUrl: "sys/user/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getAvatarView: function (avatar) {
        return getFileAccessHttpUrl(avatar,this.url.imgerver,"http")
      },

      batchFrozen: function (status) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.warning(this.$t('app.message.msg0021'));
          return false;
        } else {
          let ids = "";
          let that = this;
          let isAdmin = false;
          that.selectionRows.forEach(function (row) {
            if (row.username == 'admin') {
              isAdmin = true;
            }
          });
          if (isAdmin) {
            that.$message.warning(this.$t('app.message.msg0022'));
            return;
          }
          that.selectedRowKeys.forEach(function (val) {
            ids += val + ",";
          });
          that.$confirm({
            title: this.$t('app.common.confirm'),
            content: this.$t('app.message.msg0305',{'0': status == 1 ? this.$t('app.common.thaw') : this.$t('app.common.frozen')}),
            onOk: function () {
              frozenBatch({ids: ids, status: status}).then((res) => {
                if (res.success) {
                  that.$message.success(res.message);
                  that.loadData();
                  that.onClearSelected();
                } else {
                  that.$message.warning(res.message);
                }
              });
            }
          });
        }
      },
      handleMenuClick(e) {
        if (e.key == 1) {
          this.batchDel();
        } else if (e.key == 2) {
          this.batchFrozen(2);
        } else if (e.key == 3) {
          this.batchFrozen(1);
        }
      },
      handleFrozen: function (id, status, username) {
        let that = this;
        //TODO 后台校验管理员角色
        if ('admin' == username) {
          that.$message.warning(this.$t('app.message.msg0023'));
          return;
        }
        frozenBatch({ids: id, status: status}).then((res) => {
          if (res.success) {
            that.$message.success(res.message);
            that.loadData();
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      handleChangePassword(username) {
        this.$refs.passwordmodal.show(username);
      },
      // handleAgentSettings(username){
      //   this.$refs.sysUserAgentModal.agentSettings(username);
      //   this.$refs.sysUserAgentModal.title = this.$t('app.label.user.sysUserAgent');
      // },
      handleSyncUser() {
      },
      passwordModalOk() {
        //TODO 密码修改完成 不需要刷新页面，可以把datasource中的数据更新一下
      }
    }

  }
</script>
<style scoped>
  @import '~@assets/less/common.less'
</style>