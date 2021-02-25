<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
    </div>
  </a-locale-provider>
</template>
<script>
  import Vue from 'vue'
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import enUS from 'ant-design-vue/lib/locale-provider/en_US'
  import jaJP from 'ant-design-vue/lib/locale-provider/ja_JP'
  import enquireScreen from '@/utils/device'

  export default {
    data () {
      return {
        locale: Vue.ls.get('DEFAULT_LANGUAGE'),
      }
    },
    created () {
      console.log(Vue.ls.get('DEFAULT_LANGUAGE'));
      let that = this
      if (Vue.ls.get('DEFAULT_LANGUAGE') === 'zhCN') {
        that.locale = zhCN
        that.$i18n.locale = 'zhCN'
        Vue.ls.set("DEFAULT_LANGUAGE", 'zhCN', 365 * 24 * 60 * 60 * 1000);
      } else {
        that.locale = jaJP
        that.$i18n.locale = 'jaJP'
        Vue.ls.set("DEFAULT_LANGUAGE", 'jaJP', 365 * 24 * 60 * 60 * 1000);
      }
      enquireScreen(deviceType => {
        // tablet
        if (deviceType === 0) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        // mobile
        else if (deviceType === 1) {
          that.$store.commit('TOGGLE_DEVICE', 'mobile')
          that.$store.dispatch('setSidebar', false)
        }
        else {
          that.$store.commit('TOGGLE_DEVICE', 'desktop')
          that.$store.dispatch('setSidebar', true)
        }
        
      })
    }
  }
</script>
<style>
  #app {
    height: 100%;
  }
</style>