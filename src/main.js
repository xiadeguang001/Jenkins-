import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'
require('promise.prototype.finally').shim()
import { VueAxios } from "@/utils/request"

import 'font-awesome/scss/font-awesome.scss'
import Antd from 'ant-design-vue'
import VueI18n from 'vue-i18n'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import Print from 'vue-print-nb-jeecg'
/*import '@babel/polyfill'*/
import VueApexCharts from 'vue-apexcharts'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import "@jeecg/antd-online-re"
import '@jeecg/antd-online-re/dist/OnlineForm.css'


import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'

import JDictSelectTag from './components/dict/index.js'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus';
import JeecgComponents from '@/components/jeecg/index'
// import { message } from 'ant-design-vue/es';

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(hasPermission)
Vue.use(JDictSelectTag)
Vue.use(Print)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(preview)
Vue.use(vueBus)
Vue.use(JeecgComponents)
Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'jaJP',    // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zhCN': require('./i18n/lang/zh-CN'),   // 中文语言包
    'enUS': require('./i18n/lang/en-US'),    // 英文语言包
    'jaJP': require('./i18n/lang/ja-JP')    // 日文语言包
  }
})

Vue.prototype.NumberAdd = function(arg1, arg2) {
  var r1, r2, m, n;
  try {
      r1 = arg1.toString().split(".")[1].length
  } catch (e) {
      r1 = 0
  }
  try {
      r2 = arg2.toString().split(".")[1].length
  } catch (e) { 
      r2 = 0 
  } 
  m = Math.pow(10, Math.max(r1, r2))
  n = (r1 >= r2) ? r1 : r2;
  return parseFloat(((arg1 * m + arg2 * m) / m).toFixed(n));
}

Vue.prototype.NumberSub = function(arg1, arg2) {
  var re1, re2, m, n;
  try {
      re1 = arg1.toString().split(".")[1].length;
  } catch (e) {
  re1 = 0;
  }
  try {
      re2 = arg2.toString().split(".")[1].length;
  } catch (e) {
      re2 = 0;
  }
  m = Math.pow(10, Math.max(re1, re2)); 
  n = (re1 >= re2) ? re1 : re2;
  return parseFloat(((arg1 * m - arg2 * m) / m).toFixed(n));
}

Vue.prototype.NumberMul = function(arg1, arg2) {
  var m = 0;
  var s1 = arg1.toString();
  var s2 = arg2.toString();
  try {
      m += s1.split(".")[1].length;
  } catch (e) {}
  try {
      m += s2.split(".")[1].length;
  } catch (e) {}

  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

Vue.prototype.NumberDiv = function (arg1,arg2,digit){
  var t1=0,t2=0,r1,r2;
  try{t1=arg1.toString().split(".")[1].length}catch(e){}
  try{t2=arg2.toString().split(".")[1].length}catch(e){}
  r1=Number(arg1.toString().replace(".",""))
  r2=Number(arg2.toString().replace(".",""))
  //获取小数点后的计算值
 var result= ((r1/r2)*Math.pow(10,t2-t1)).toString()
  var result2=result.split(".")[1];
  result2=result2.substring(0,digit>result2.length?result2.length:digit);

  return Number(result.split(".")[0]+"."+result2);
}

// this.$message.warning 的重写
Vue.prototype.$message.warning = function (msg) {
  if(msg.indexOf("HandlerExcelcntException")>-1){
    // TODO 暂时没法使用国际化
    msg = "数据已被更新，请刷新一览后重新进行修改！";
  }
  this.open({ content: msg, type: "warning", onClose: false })
}

new Vue({
  router,
  store,
  i18n,
  mounted () {
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    store.commit('SET_MULTI_PAGE', Vue.ls.get(DEFAULT_MULTI_PAGE,config.multipage))
  },
  render: h => h(App)
}).$mount('#app')

