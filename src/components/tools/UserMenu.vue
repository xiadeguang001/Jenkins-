<template>
  <div class="user-wrapper" :class="theme">
    <a-dropdown>
      <span class="action action-full ant-dropdown-link user-dropdown-menu">
        <a-icon type="user"/>
        <span v-if="isDesktop()">&nbsp;ようこそ、{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
        <!-- <a-menu-item key="1"  @click="systemSetting">
            <a-icon type="tool"/>
            <span>System Settings</span>
        </a-menu-item>  -->
        <a-menu-item key="2" @click="updatePassword">
          <a-icon type="safety-certificate"/>
          <span>{{this.$t('app.label.user.changePassword')}}</span>
        </a-menu-item>
        <a-menu-item key="3" @click="handleLogout">
          <a-icon type="api" theme="twoTone" two-tone-color="blue"/>
          <span style="color:blue">{{this.$t("app.common.logout")}}</span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <user-password ref="userPassword"></user-password>
    <depart-select ref="departSelect" :closable="true" title="部门切换"></depart-select>
    <setting-drawer ref="settingDrawer" :closable="true" title="System Settings"></setting-drawer>
  </div>
</template>

<script>
  import HeaderNotice from './HeaderNotice'
  import UserPassword from './UserPassword'
  import SettingDrawer from "@/components/setting/SettingDrawer";
  import DepartSelect from './DepartSelect'
  import { mapActions, mapGetters,mapState } from 'vuex'
  import { mixinDevice } from '@/utils/mixin.js'

  export default {
    name: "UserMenu",
    mixins: [mixinDevice],
    data(){
      return{
        //菜单搜索
        search:[],
        shows:false
      }
    },
    components: {
      HeaderNotice,
      UserPassword,
      DepartSelect,
      SettingDrawer
    },
    props: {
      theme: {
        type: String,
        required: false,
        default: 'dark'
      }
    },
    /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    created() {
      let lists = []
      console.log("permissionMenuList: ",this.permissionMenuList)
      this.searchMenus(lists,this.permissionMenuList)
      this.search=[...lists]
      console.log(this.search)
    },
    computed: {
      ...mapState({
        // 后台菜单
        permissionMenuList: state => state.user.permissionList

      })
    },
    /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    methods: {
      /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
      showClick(){
        this.shows = !this.shows
      },
      hiddenClick(){
        this.shows = false
      },
      /* update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
      ...mapActions(["Logout"]),
      ...mapGetters(["nickname", "avatar","userInfo"]),
      getAvatar(){
        console.log('url = '+ window._CONFIG['imgDomainURL']+"/"+this.avatar())
        return window._CONFIG['imgDomainURL']+"/"+this.avatar()
      },
      handleLogout() {
        const that = this

        this.$confirm({
          title: 'プロンプト',
          content: 'ログアウトしてもよろしいですか？',
          onOk() {
            return that.Logout({}).then(() => {
                window.location.href="/";
              //window.location.reload()
            }).catch(err => {
              that.$message.error({
                title: 'エラー',
                description: err.message
              })
            })
          },
          onCancel() {
          },
        });
      },
      updatePassword(){
        let username = this.userInfo().username
        this.$refs.userPassword.show(username)
      },
      updateCurrentDepart(){
        this.$refs.departSelect.show()
      },
      systemSetting(){
        this.$refs.settingDrawer.showDrawer()
      },
      /* update_begin author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
      searchMenus(arr,menus){
        for(let i of menus){
          if(!i.hidden && "layouts/RouteView"!==i.component){
           arr.push(i)
          }
          if(i.children&& i.children.length>0){
            this.searchMenus(arr,i.children)
          }
        }
      },
      filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      searchMethods(value){
        let jump = this.search.filter(item=>item.id==value)
        this.$router.push({ path:jump[0].path})
      }
      /*update_end author:zhaoxin date:20191129 for: 做头部菜单栏导航*/
    }
  }
</script>

<style lang="scss" scoped>
  /* update_begin author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
  /* update-begin author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
  .user-wrapper .search-input {
    width: 180px;
    color: white;

    /deep/ {
      .ant-select-selection {
        background-color: inherit;
        border: 0;
        border-bottom: 1px solid white;
      }

      .ant-select-selection__placeholder,
      .ant-select-search__field__placeholder {
        color: inherit;
      }
    }
  }
  /* update-end author:sunjianlei date:20191220 for: 解决全局样式冲突问题 */
  /* update_end author:zhaoxin date:20191129 for: 让搜索框颜色能随主题颜色变换*/
</style>

<style scoped>
  .logout_title {
    color: inherit;
    text-decoration: none;
  }
</style>