<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :maskClosable="false"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >
    <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item :label="$t('app.label.menuType')" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group @change="onChangeMenuType" v-decorator="['menuType',{'initialValue':localMenuType}]">
            <a-radio :value="0">{{this.$t('app.label.firstMenu')}}</a-radio>
            <a-radio :value="1">{{this.$t('app.label.submenu')}}</a-radio>
            <a-radio :value="2">{{this.$t('app.label.buttonAuthority')}}</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 菜单名称 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="menuLabel"
          hasFeedback >
          <a-input  v-decorator="[ 'name', validatorRules.name]" :readOnly="disableSubmit"/>
        </a-form-item>

        <!-- 上级菜单 -->
        <a-form-item
          v-show="localMenuType!=0"
          :label="$t('app.label.parentMenu')"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :validate-status="validateStatus"
          :hasFeedback="true"
          :required="true">
          <span slot="help">{{ validateStatus=='error'?$t('app.message.msg0042') + $t('app.label.parentMenu'):'&nbsp;&nbsp;' }}</span>
          <a-tree-select
            style="width:100%"
            :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
            :treeData="treeData"
            v-model="model.parentId"
            :disabled="disableSubmit"
            @change="handleParentIdChange">
          </a-tree-select>
        </a-form-item>

        <!-- 菜单路径 -->
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.menuPath')">
          <a-input v-decorator="[ 'url',validatorRules.url]" :readOnly="disableSubmit"/>
        </a-form-item>

        <!-- 前端组件 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.frontEndComponents')">
          <a-input v-decorator="[ 'component',validatorRules.component]" :readOnly="disableSubmit"/>
        </a-form-item>

        <!-- 默认跳转地址 -->
        <a-form-item
          v-show="localMenuType==0"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.defaultAddress')">
          <a-input v-decorator="[ 'redirect',{}]" :readOnly="disableSubmit"/>
        </a-form-item>

        <!-- 授权标识 -->
        <a-form-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.authorizationMark')">
          <a-input v-decorator="[ 'perms', {}]" :readOnly="disableSubmit"/>
        </a-form-item>

        <!-- 授权策略 -->
        <a-form-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.authorizationPolicy')">
          <j-dict-select-tag  v-decorator="['permsType', {}]" :type="'radio'" :triggerChange="true" dictCode="global_perms_type"/>


        <!-- 状态 -->
        </a-form-item>
        <a-form-item
          v-show="!show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.status')">
          <j-dict-select-tag  v-decorator="['status', {}]" :type="'radio'" :triggerChange="true" dictCode="valid_status"/>
        </a-form-item>

        <!-- 菜单图标 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.menuIcon')">
          <a-input v-model="model.icon" :readOnly="disableSubmit">
            <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
          </a-input>
        </a-form-item>

        <!-- 排序 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.common.sort')">
          <a-input-number style="width: 200px" v-decorator="[ 'sortNo',validatorRules.sortNo]" :readOnly="disableSubmit"/>
        </a-form-item>

        <!-- 是否路由菜单 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.routeMenu')">
          <a-switch :checkedChildren="$t('app.common.yes')" :unCheckedChildren="$t('app.common.no')" v-model="routeSwitch"/>
        </a-form-item>

        <!-- 隐藏路由 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.hideRoute')">
          <a-switch :checkedChildren="$t('app.common.yes')" :unCheckedChildren="$t('app.common.no')" v-model="menuHidden"/>
        </a-form-item>

        <!-- 是否缓存路由 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.cacheRoute')">
          <a-switch :checkedChildren="$t('app.common.yes')" :unCheckedChildren="$t('app.common.no')" v-model="isKeepalive"/>
        </a-form-item>

        <!-- 聚合路由 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.aggregateRoute')">
          <a-switch :checkedChildren="$t('app.common.yes')" :unCheckedChildren="$t('app.common.no')" v-model="alwaysShow"/>
        </a-form-item>

        <!--update_begin author:wuxianquan date:20190908 for:增加组件，外链打开方式可选 -->
        <!-- 打开方式 -->
        <a-form-item
          v-show="show"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          :label="$t('app.label.openWith')">
          <a-switch :checkedChildren="$t('app.common.outside')" :unCheckedChildren="$t('app.common.inside')" v-model="internalOrExternal"/>
        </a-form-item>
        <!--update_end author:wuxianquan date:20190908 for:增加组件，外链打开方式可选 -->

      </a-form>

      <!-- 选择图标 -->
      <icons @choose="handleIconChoose" @close="handleIconCancel" :iconChooseVisible="iconChooseVisible"></icons>
    </a-spin>
    </div>

    <div class="fill-drawer-bottom"></div>
    <div style="z-index:999 " class="drawer-bootom-button">
      <a-popconfirm title="編集を中止してもよろしいですか？" @confirm="handleCancel" okText="確認" cancelText="キャンセル">
        <a-button style="margin-right: .8rem">キャンセル</a-button>
      </a-popconfirm>

      <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit">{{this.$t('app.common.confirm')}}</a-button>
    </div>

  </a-drawer>
</template>

<script>
  import {addPermission,editPermission,queryTreeList} from '@/api/api'
  import Icons from './icon/Icons'
  import pick from 'lodash.pick'
  import { getMsgInfo } from "@/utils/util"


  export default {
    name: "PermissionModal",
    components: {Icons},
    data () {
      return {
        drawerWidth:700,
        treeData:[],
        treeValue: '0-0-4',
        title:this.$t('app.label.action'),
        addTitle: 'メニューを追加',
        editTitle: '編集メニュー',
        visible: false,
        disableSubmit:false,
        model: {},
        localMenuType:0,
        alwaysShow:false,//表单元素-聚合路由
        menuHidden:false,//表单元素-隐藏路由
        routeSwitch:true, //是否路由菜单
        /*update_begin author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        internalOrExternal:false,//菜单打开方式
        /*update_end author:wuxianquan date:20190908 for:定义变量，初始值代表内部打开*/
        isKeepalive:true, //是否缓存路由
        show:true,//根据菜单类型，动态显示隐藏表单元素
        menuLabel:this.$t('app.label.menuName'),
        isRequrie:true,  // 是否需要验证
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 19 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),

        iconChooseVisible: false,
        validateStatus:""
      }
    },
    computed:{
      validatorRules:function() {
        return {
          name:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','menuTitile') }]},
          component:{rules: [{ required: this.show, message: getMsgInfo(this,'msg0001','frontEndComponents') }]},
          url:{rules: [{ required: this.show, message: getMsgInfo(this,'msg0001','menuPath') }]},
          permsType:{rules: [{ required: true, message: getMsgInfo(this,'msg0001','authorizationPolicy') }]},
          sortNo:{initialValue:1.0},
        }
      }
    },
    created () {
      this.initDictConfig();
    },
    methods: {
      loadTree(){
        var that = this;
        queryTreeList().then((res)=>{
          if(res.success){
            console.log('----queryTreeList---')
            console.log(res)
            that.treeData = [];
            let treeList = res.result.treeList
            for(let a=0;a<treeList.length;a++){
              let temp = treeList[a];
              temp.isLeaf = temp.leaf;
              that.treeData.push(temp);
            }
          }
        });
      },
      add () {
        // 默认值
        this.edit({status:'1',permsType:'1',route:true});
      },
      edit (record) {
        this.resetScreenSize(); // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
        this.form.resetFields();
        this.model = Object.assign({}, record);
        //--------------------------------------------------------------------------------------------------
        //根据菜单类型，动态展示页面字段
        console.log(record)
        this.alwaysShow = !record.alwaysShow?false:true;
        this.menuHidden = !record.hidden?false:true;

        if(record.route!=null){
          this.routeSwitch = record.route?true:false;
        }

        if(record.keepAlive!=null){
          this.isKeepalive = record.keepAlive?true:false;
        }else{
          this.isKeepalive = false; // 升级兼容 如果没有（后台没有传过来、或者是新建）默认为false
        }

        /*update_begin author:wuxianquan date:20190908 for:编辑初始化数据*/
        if(record.internalOrExternal!=null){
          this.internalOrExternal = record.internalOrExternal?true:false;
        }else{
          this.internalOrExternal = false;
        }
        /*update_end author:wuxianquan date:20190908 for:编辑初始化数据*/


        //console.log('record.menuType', record.menuType);
        this.show = record.menuType==2?false:true;
        this.menuLabel = record.menuType==2?this.$t('app.label.buttonAuthority'):this.$t('app.label.menuName');

        if(this.model.parentId){
          this.localMenuType = 1;
        }else{
          this.localMenuType = 0;
        }
        //----------------------------------------------------------------------------------------------

        this.visible = true;
        this.loadTree();
        let fieldsVal = pick(this.model,'name','perms','permsType','component','url','sortNo','menuType','status');
        this.$nextTick(() => {
          this.form.setFieldsValue(fieldsVal)
        });
      },
      close () {
        this.$emit('close');
        this.disableSubmit = false;
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            this.model.alwaysShow = this.alwaysShow;
            this.model.hidden = this.menuHidden;
            this.model.route = this.routeSwitch;
            this.model.keepAlive = this.isKeepalive;
            /*update_begin author:wuxianquan date:20190908 for:获取值*/
            this.model.internalOrExternal = this.internalOrExternal;
            /*update_end author:wuxianquan date:20190908 for:获取值*/

            let formData = Object.assign(this.model, values);
            if ((formData.menuType == 1 || formData.menuType == 2) && !formData.parentId) {
              that.validateStatus = 'error';
              that.$message.error(this.$t('app.message.msg0040'));
              return;
            } else {
              that.validateStatus = 'success';
            }
            that.confirmLoading = true;
            console.log(formData);
            let obj;
            if (!this.model.id) {
              obj = addPermission(formData);
            } else {
              obj = editPermission(formData);
            }
            obj.then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            });
          }
        })
      },
      handleCancel () {
        this.close()
      },
      validateNumber(rule, value, callback){
        if(!value || new RegExp(/^[0-9]*[1-9][0-9]*$/).test(value)){
          callback();
        }else{
          callback(getMsgInfo(this,'msg0001','positiveInt'));
        }
      },
      onChangeMenuType(e) {
        //console.log('localMenuType checked', e.target.value)
        this.localMenuType=e.target.value
        if(e.target.value == 2){
          this.show = false;
          this.menuLabel = this.$t('app.label.buttonAuthority');
        }else{
          this.show = true;
          this.menuLabel = this.$t('app.label.menuName');
        }
        this.$nextTick(() => {
          this.form.validateFields(['url','component'], { force: true });
        });
      },
      selectIcons(){
        this.iconChooseVisible = true
      },
      handleIconCancel () {
        this.iconChooseVisible = false
      },
      handleIconChoose (value) {
        console.log(value)
        this.model.icon = value
        this.form.icon = value
        this.iconChooseVisible = false
      },
      // 根据屏幕变化,设置抽屉尺寸
      resetScreenSize(){
        let screenWidth = document.body.clientWidth;
        if(screenWidth < 500){
          this.drawerWidth = screenWidth;
        }else{
          this.drawerWidth = 700;
        }
      },
      initDictConfig() {
      },
      handleParentIdChange(value){
        if(!value){
          this.validateStatus="error"
        }else{
          this.validateStatus="success"
        }
      }
    }
  }
</script>

<style scoped>

</style>