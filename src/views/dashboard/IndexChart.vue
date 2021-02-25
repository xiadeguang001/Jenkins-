<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24" v-has="'indexChart:sales'">
      <a-col :sm="24" :md="12" :xl="6" >
        <chart-card :loading="loading" title="本年度销售额" :total="salesInfo.yearSum | NumberFormat">
          <a-tooltip title="单位：元" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="salesInfo.yearMark" style="margin-right: 16px;">
              <span slot="term">同比</span>
              {{salesInfo.yearAdd | NumberFormat }}&nbsp;&nbsp;&nbsp;({{salesInfo.yearRatio }}%)
            </trend>
          </div>
          <template slot="footer">日均销售额&nbsp;&nbsp;<span> {{salesInfo.dayOfYearSum | NumberFormat }}</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6" >
        <chart-card :loading="loading" title="本季度销售额" :total="salesInfo.quarterSum | NumberFormat">
          <a-tooltip title="单位：元" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="salesInfo.quarterMark" style="margin-right: 16px;">
              <span slot="term">环比</span>
              {{salesInfo.quarterAdd | NumberFormat }}&nbsp;&nbsp;&nbsp;({{salesInfo.quarterRatio }}%)
            </trend>
            <trend :flag="salesInfo.quarterMark2" style="margin-right: 16px;">
              <span slot="term">同比</span>
              {{salesInfo.quarterAdd2 | NumberFormat }}&nbsp;&nbsp;&nbsp;({{salesInfo.quarterRatio2 }}%)
            </trend>
          </div>
          <template slot="footer">日均销售额&nbsp;&nbsp;<span> {{salesInfo.dayOfQuarterSum | NumberFormat }}</span></template>
        </chart-card>
      </a-col>

      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="本月销售额" :total="salesInfo.monthSum | NumberFormat">
          <a-tooltip title="单位：元" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="salesInfo.monthMark" style="margin-right: 16px;">
              <span slot="term">环比</span>
              {{salesInfo.monthAdd | NumberFormat }}&nbsp;&nbsp;&nbsp;({{salesInfo.monthRatio }}%)
            </trend>
            <trend :flag="salesInfo.monthMark2" style="margin-right: 16px;">
              <span slot="term">同比</span>
              {{salesInfo.monthAdd2 | NumberFormat }}&nbsp;&nbsp;&nbsp;({{salesInfo.monthRatio2 }}%)
            </trend>
          </div>
          <template slot="footer">日均销售额&nbsp;&nbsp;<span> {{salesInfo.dayOfMonthSum | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6">
        <chart-card :loading="loading" title="本周销售额" :total="salesInfo.weekSum | NumberFormat">
          <a-tooltip title="单位：元" slot="action">
            <a-icon type="info-circle-o" />
          </a-tooltip>
          <div>
            <trend :flag="salesInfo.monthMark" style="margin-right: 16px;">
              <span slot="term">环比</span>
              {{salesInfo.weekAdd | NumberFormat }}&nbsp;&nbsp;&nbsp;({{salesInfo.weekRatio }}%)
            </trend>
          </div>
          <template slot="footer">日均销售额&nbsp;&nbsp;<span> {{salesInfo.dayOfWeekSum | NumberFormat }}</span></template>
        </chart-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{padding: '0'}" v-has="'indexChart:sales'">
      <div class="salesCard">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a @click="handleDetail(1)">本年</a>
              <a @click="handleDetail(2)">本月</a>
              <a @click="handleDetail(3)">本周</a>
              <a @click="handleDetail(4)">今日</a>
            </div>
            <div class="extra-item" style="width:230px"></div>
          </div>
          <a-tab-pane loading="true" tab="销售・开票・付款" key="1">
            <a-row>
              <a-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar-multid :sourceData="jhjgData" :fields="jhjgFields" title="最近12个月(单位：万元)"></bar-multid>
              </a-col>
              <a-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list :title="customerTitle" :list="customerSalesList"/>
              </a-col>
            </a-row>
          </a-tab-pane>

        </a-tabs>
      </div>
    </a-card>
    <a-row>
      <a-col :span="24">
        <a-card :loading="loading" :bordered="false" title="最近一周系统访问量统计">
          <a-row>
            <a-col :span="6">
              <head-info title="今日IP" :content="loginfo.todayIp"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="environment" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="今日访问" :content="loginfo.todayVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="team" style="font-size: 24px"  />
              </a-spin>
            </a-col>
            <a-col :span="6">
              <head-info title="总访问量" :content="loginfo.totalVisitCount"></head-info>
            </a-col>
            <a-col :span="2">
              <a-spin class='circle-cust'>
                <a-icon slot="indicator" type="rise" style="font-size: 24px"  />
              </a-spin>
            </a-col>
          </a-row>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo"></line-chart-multid>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import ChartCard from '@/components/ChartCard'
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import MiniArea from '@/components/chart/MiniArea'
  import MiniBar from '@/components/chart/MiniBar'
  import MiniProgress from '@/components/chart/MiniProgress'
  import RankList from '@/components/chart/RankList'
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import HeadInfo from '@/components/tools/HeadInfo.vue'
  import BarMultid from '@/components/chart/BarMultid'
  import Trend from '@/components/Trend'
  import { getLoginfo,getVisitInfo } from '@/api/api'
  import { httpAction,getAction } from '@/api/manage'


  export default {
    name: "IndexChart",
    components: {
      ATooltip,
      ACol,
      ChartCard,
      MiniArea,
      MiniBar,
      MiniProgress,
      RankList,
      Bar,
      Trend,
      LineChartMultid,
      HeadInfo,
      BarMultid
    },
    data() {
      return {
        loading: true,
        center: null,
        customerTitle:"",
        rankList:[],
        barData:[],
        loginfo:{},
        visitFields:['ip','visit'],
        visitInfo:[],
        salesInfo:{},
        jhjgFields:[],
        jhjgData:[],
        customerSalesList:[],
        indicator: <a-icon type="loading" style="font-size: 24px" spin />,
        url: {
          // 本年度销售额
          salesAmountSum: "/indexChart/salesAmountSum",
          // 月销售额排行
          salesForMonth: "/indexChart/salesForMonth",
          //客户销售排行榜
          customerSalesList:"/indexChart/customerSalesList",
        },
      }
    },
    created() {
      setTimeout(() => {
        this.loading = !this.loading
      }, 1000)
      this.initLogInfo();
    },
    methods: {
      // 初始化
      initLogInfo () {
        const that = this;
        getLoginfo(null).then((res)=>{
          if(res.success){
            Object.keys(res.result).forEach(key=>{
              res.result[key] =res.result[key]+""
            })
            that.loginfo = res.result;
          }
        })
        getVisitInfo().then(res=>{
          if(res.success){
             that.visitInfo = res.result;
           }
         })
        // 销售额合计取得
        let params = {}
        getAction(that.url.salesAmountSum,params).then((res)=>{
          if(res.success){
            that.salesInfo = res.result;
            that.barData = res.result.monthList;
          }
        })
         // 月销售额排行
        params = {}
        params = {"name1": '开票',"name2":'销售',"name3":'付款'}
        getAction(that.url.salesForMonth,params).then((res)=>{
          if(res.success){
            that.jhjgData = res.result.monthList;
            that.jhjgFields=res.result.month;
          }
        })
        that.handleDetail(1);
      },
      //客户销售排行榜
      handleDetail(cycle){
        if(cycle == 1){
          this.customerTitle = "本年客户销售额排行榜"
        } else if (cycle == 2){
          this.customerTitle = "本月客户销售额排行榜"
        } else if (cycle == 3){
          this.customerTitle = "本周客户销售额排行榜"
        } else if (cycle == 4){
          this.customerTitle = "今日客户销售额排行榜"
        }
        const that = this;
        let params = {"cycle":cycle}
        getAction(that.url.customerSalesList,params).then((res)=>{
          if(res.success){
            that.customerSalesList = res.result.monthList;
            that.$forceUpdate()
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .circle-cust{
    position: relative;
    top: 28px;
    left: -100%;
  }
  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }
    p {
      line-height: 42px;
      margin: 0;
      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>