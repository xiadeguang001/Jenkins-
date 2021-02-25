<template>
  <div class="logo">
      <img v-if="navTheme === 'dark'" src="~@/assets/logo-top.png" alt="logo">
      <img v-else src="~@/assets/logo-top.png" alt="logo">
      <h1 v-if="showTitle">{{ title }}</h1>
  </div>
</template>

<script>
  import { mixin } from '@/utils/mixin.js'

  export default {
    name: 'Logo',
    mixins: [mixin],
    props: {
      title: {
        type: String,
        default: '国内航空貨物システム（DACS）',
        required: false
      },
      showTitle: {
        type: Boolean,
        default: true,
        required: false
      }
    }
  }
</script>
<style lang="less" scoped>
  /*缩小首页布 局顶部的高度*/
  @height: 50px;

  .sider {
    box-shadow: none !important;
    .logo {
      height: @height !important;
      line-height: @height !important;
      box-shadow: none !important;
      transition: background 300ms;
      background-color: white;
      padding-left: 3px;

      a {
        color: white;
        &:hover {
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }

    &.light .logo {
      background-color: @primary-color;
    }
  }
</style>

<style>
  .ant-card {
      border-top: 3px solid #3c8dbc;
      border-radius: 0px !important;
      margin-bottom: 12px !important;
      margin-top: 0.5em !important;
  }

  /* .ant-card-head {
  } */
  .ant-layout-sider,
  .ant-menu-dark,
  .ant-menu-dark .ant-menu-sub {
   background-color: #02273a !important;
  }
  .ant-menu-dark .ant-menu-inline.ant-menu-sub {
    background: #000c17 !important;
  }
  .ant-card-head, .ant-modal-content, .ant-input-number,.ant-alert,.ant-select-selection, .ant-layout, textarea, input, .ant-btn {
    border-radius: 0px !important;
  }

  .ant-layout {
    background-color: #ececec !important;
  }

  .ant-layout-footer {
    background: #ececec !important;
}

  .ant-card-wider-padding .ant-card-head  {
    padding: 0 13px !important;
  }

  .ant-card-head-title {
    padding: 8px 0 !important;
  }

  .table-operator {
    margin-bottom: 10px !important;
  }

  .ant-card-wider-padding .ant-card-body {
    padding: 10px 15px !important;
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item, .ant-form-item {
    margin-bottom: 0px !important;
  }

  .table-page-search-wrapper {
    margin-bottom: 5px !important;
  }

  .loginCard .ant-form-item {
    margin-bottom: 24px !important;
  }
  .table-page-search-wrapper .ant-form-inline .ant-form-item>.ant-form-item-label {
    padding-right: 0px !important;
  }

  .ant-drawer-body {
    padding: 16px !important;
  }

  .ant-tabs.ant-tabs-card .ant-tabs-tab {
    padding: 0 16px!important;
  }
  .ant-table {
    line-height: 1 !important;
  }
  .ant-table,.ant-menu-item,.ant-table-body, label,.ant-btn,.ant-menu-submenu-title {
    font-size: small !important;
  }

  .ant-row .ant-form-item {
    margin-bottom: 8px !important;
  }

  .ant-table-row {
    height:35px;
  }
  .ant-drawer-close {
    line-height: 43px !important;
    height: 43px !important;
    margin-top: 3px !important;
  }

  .ant-modal-close-x {
    line-height: 43px !important;
    height: 43px !important;
    margin-top: 3px !important;
  }

  .index-container-ty .ant-card-head-wrapper, .index-container-ty .ant-card-head {
    background-color: #3c8dbc !important;
  }
  .ant-table-pagination.ant-pagination {
    float: right !important;
    margin: 5px 0 !important;
  }
  .ant-table-fixed-left, .ant-table-fixed-right {
    z-index: 8 !important;
  }

  .ant-drawer-body .ant-card {
    border-left: 0px;
  }
  
  .sider .logo img {
    margin-left: 30px;
    height: 40px !important;
    width: 190px !important;
  }
  
  .fill-drawer-bottom {
    height: 40px;
  }

  .drawer-bootom-button {
    position: absolute;
    bottom: 0px;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 5px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }

  /* .ant-form-item-control {
    height: 32px !important;
  } */

  .memoform .ant-form-item-control {
    height: auto !important;
  }

  .ant-modal-header, .ant-modal-footer, .ant-drawer-header, .drawer-bootom-button {
    background-color: #f0f4f7 !important;
    font-weight: bold !important;
  }

  .ant-modal-header, .ant-drawer-header {
      padding: 10px 15px !important;
  }
  .ant-modal-footer {
      padding: 5px 16px !important;
  }
  .loginCard {
    width: 300px !important;
  }

  .ant-table-thead > tr > th {
    color: #fff !important;
    background: #3c8dbc !important;
}

  .ant-table-tbody > tr > td {
    padding: 10px 8px !important;
  }

  
  .ant-table-thead > tr > th {
    padding: 12px 8px !important;
  }

  .drawer-bootom-button button {
    margin-left: 5px;
  }

  .small-search-button{
    width:32px; 
    margin-left:7px
  }
  .small-search-text{
    width:82% !important;
  }

  .cancel-button-right {
    margin-right: .8rem;
    float:left;
  }

  .ant-drawer.drawer-sider .ant-drawer-body {
    padding: 0 !important;
  }

  .header.dark {
    box-shadow: 6px 0 4px rgba(0,0,0,.2) !important;
  }

  .ant-form-item-required::before {
    display: none !important;
}

  .standard-form .ant-form-item-required::after {
    display: inline-block;
    margin-left: 5px !important;
    color: #ffffff !important;
    line-height: 1;
    font-size: 11px !important;
    content: '必須' !important;
    background-color: #dd4b39;
    padding: 2px 3px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
}

.ant-drawer-title {
  font-weight: bold !important;
  margin-top: 3px !important;
}

 .standard-form .ant-form-item-label label:not(.ant-form-item-required)::after {
  display: none !important;
}

body {
  font-family: 游ゴシック体, YuGothic, "Yu Gothic M", "游ゴシック Medium", "Yu Gothic Medium", "ヒラギノ角ゴ ProN W3", "Hiragino Kaku Gothic ProN W3", HiraKakuProN-W3, "ヒラギノ角ゴ ProN", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ Pro", "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, Osaka, "ＭＳ Ｐゴシック", "MS PGothic", "Helvetica Neue", HelveticaNeue, Helvetica, Arial, "Segoe UI", sans-serif !important;
}

.standard-form .ant-form-item-label {
  padding-left: 5px;
  text-align: left !important;
  background: #f9f9f9;
  border: 1px solid #e8e8e8;
  border-left: 3px solid #3c8dbc;
  height:inherit;
  vertical-align: 50%;
  margin-right:-1px;
  margin-bottom:-1px;
  font-weight: bold;
}

.standard-form .ant-form-item {
  display:flex;
}

.ant-modal-body  {
  padding: 10px 16px !important;
}

.standard-form .ant-form-item-control-wrapper {
  border: 1px solid #e8e8e8;
  height:inherit;
  padding-left: 5px;
  padding-right: 5px;
  margin-right:-1px;
  margin-bottom:-1px;
}

.ant-form-explain {
    font-size: smaller !important;
    margin-top: -5px !important;
    z-index: 1;
    padding-left: 5px;
    min-height: 18px !important;
}
.ant-row .row-right-button {
  padding-left: 12px !important;
  padding-right: 7px !important;
  text-align: right !important;
}
.ant-row .row-right-model-button {
  padding-left: 12px !important;
  padding-right: 13px !important;
  text-align: right !important;
}
.p-pageTitle {
    font-size: 18px !important;
    font-weight: bold;
    margin-bottom: 0.1em;
}
.p-pageSubText {
    font-size: 14px !important;
    margin-bottom: 0em;
}
.ant-modal-title {
  margin-top: 3px !important;
  font-weight: bold !important;
}
.p-msg {
    margin-bottom: 5px;
}
/* .ant-modal-body .ant-input {
  height: 24px !important;
}

.ant-modal-body .ant-select-selection__rendered {
  line-height: 22px !important;
}

.ant-modal-body .ant-select-selection--single {
  height: 24px !important;
} */
.ant-select-disabled .ant-select-selection {
  color:rgba(0, 0, 0, 0.25) !important;
  background-color: #f5f5f5 !important;
}

</style>