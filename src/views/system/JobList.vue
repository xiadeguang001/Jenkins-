<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="10">
            <!-- <a-form-item :label="$t('app.label.quartzJob.jobTaskName')">
              <a-input :placeholder="$t('app.Login.10008')" v-model="queryParam.jobClassName"></a-input>
            </a-form-item>-->
            <a-form-item :label="$t('app.label.Job.denpyoShurui')">
              <j-dict-select-tag v-model="queryParam.denpyoShurui" dictCode="denpyoShurui" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item :label="$t('app.label.Job.status')">
              <j-dict-select-tag dictCode="jotai" v-model="queryParam.jotai" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="10">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button
                type="primary"
                @click="searchQuery"
                icon="search"
              >{{$t('app.common.search')}}</a-button>
              <a-button
                type="primary"
                @click="searchReset"
                icon="reload"
                style="margin-left: 8px"
              >{{$t('app.common.reload')}}</a-button>
              <a-button
                type="primary"
              
                @click="openOutList(queryParam)"
                style="margin-left: 8px"
                v-has="'job:output'"
              >{{$t('app.common.output')}}</a-button>
                          

          
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button
        @click="handleAdd"
        type="primary"
        icon="plus"
        v-has="'job:add'"
      >{{$t('app.common.add')}}</a-button>

      <a-button @click="motoData(queryParam)" type="primary" v-has="'job:add'">{{$t('app.label.Job.zip')}}</a-button>

      <a-button
        type="primary"
        icon="download"
        @click="handleExportXls($t('app.label.quartzJob.jobTaskInfo'))"
        v-show="false"
      >{{$t('app.common.export')}}</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import" v-show="false">{{$t('app.common.import')}}</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            {{$t('app.common.delete')}}
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          {{$t('app.common.batchOperation')}}
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i>
        {{$t('app.common.selected')}}
        <a
          style="font-weight: 600"
        >{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">{{$t('app.common.clear')}}</a>
        &nbsp;&nbsp;&nbsp;
        <a-checkbox
          :checked="this.autoFlashFlg ==true "
          @change="autoFlash"
        >{{$t('app.common.update')}}</a-checkbox>
      </div>

      <template v-if="isIE() == false">
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :rowClassName="InterlaceDiscoloration"
          @change="handleTableChange"
        >
          <span
            slot="num"
            slot-scope="text, record, index"
          >{{(ipagination.current-1)*ipagination.pageSize+parseInt(index)+1}}</span>

          <span slot="genFileName" slot-scope="text, record">
            <!-- 元データ -->
            <a @click="downloadGenFile(record)" style="text-decoration:underline;">
              <j-ellipsis :value="record.genFileName" />
            </a>
          </span>

          <span slot="outputFileName" slot-scope="text, record">
            <!-- 出力ファイル -->
            <a @click="downloadOutputFile(record)" style="text-decoration:underline;">
              <j-ellipsis :value="record.outputFileName" />
            </a>
          </span>

          <span slot="log" slot-scope="text, record">
            <!-- ログ -->
            <a @click="openLogList(record)" style="text-decoration:underline;">
              <label>{{$t('app.label.Job.log')}}</label>
            </a>
          </span>

          <!-- 操作 -->
          <span slot="action" slot-scope="text, record" v-if="record.jotai==1">
            <a-popconfirm
              :title="$t('app.message.msg0007')"
              @confirm="() => handleDelete(record.id)"
            >
              <a style="text-decoration:underline;">{{$t('app.common.delete')}}</a>
            </a-popconfirm>
          </span>

          <!-- 字符串超长截取省略号显示-->
          <span slot="description" slot-scope="text">
            <j-ellipsis :value="text" :length="15" />
          </span>
          <span slot="biko" slot-scope="text">
            <j-ellipsis :value="text" :length="15" />
          </span>
        </a-table>
      </template>

      <template v-if="isIE() == true">
        <a-table
          ref="table"
          size="default"
          bordered
          rowKey="id"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="ipagination"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          :rowClassName="InterlaceDiscoloration"
          @change="handleTableChange"
        >
          <span
            slot="num"
            slot-scope="text, record, index"
          >{{(ipagination.current-1)*ipagination.pageSize+parseInt(index)+1}}</span>

          <span slot="genFileName" slot-scope="text, record">
            <!-- 元データ -->
            <a @click="downloadGenFile(record)" style="text-decoration:underline;">
              <j-ellipsis :value="record.genFileName" />
            </a>
          </span>

          <span slot="outputFileName" slot-scope="text, record">
            <!-- 出力ファイル -->
            <a @click="downloadOutputFile(record)" style="text-decoration:underline;">
              <j-ellipsis :value="record.outputFileName" />
            </a>
          </span>

          <span slot="log" slot-scope="text, record">
            <!-- ログ -->
            <a @click="openLogList(record)" style="text-decoration:underline;">
              <label>{{$t('app.label.Job.log')}}</label>
            </a>
          </span>

          <!-- 操作 -->
          <span slot="action" slot-scope="text, record" v-if="record.jotai==1">
            <a-popconfirm
              :title="$t('app.message.msg0007')"
              @confirm="() => handleDelete(record.id)"
            >
              <a style="text-decoration:underline;">{{$t('app.common.delete')}}</a>
            </a-popconfirm>
          </span>

          <!-- 字符串超长截取省略号显示-->
          <span slot="description" slot-scope="text">
            <j-ellipsis :value="text" :length="15" />
          </span>
          <span slot="biko" slot-scope="text">
            <j-ellipsis :value="text" :length="15" />
          </span>
        </a-table>
      </template>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <Job-modal ref="modalForm" @ok="modalFormOk"></Job-modal>
    <Job-Log-modal ref="logModalForm"></Job-Log-modal>
    <Job-Out-modal ref="outModalForm"></Job-Out-modal>
    <Job-MotoData-modal ref="motoDataModalForm"></Job-MotoData-modal>
  </a-card>
</template>

<script>
import JobModal from './modules/JobModal'
import JobLogModal from './modules/JobLogModal'
import JobOutModal from './modules/JobOutModal'
import JobMotoDataModal from './modules/JobMotoDataModal'
import { getAction, postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { axios } from '@/utils/request'
import { download,getFileName, outputdownload } from '@/api/api'
import { getMsgInfo } from '@/utils/util'

export default {
  name: 'JobList',
  mixins: [JeecgListMixin],
  components: {
    JobModal,
    JobLogModal,
    JobOutModal,
    JEllipsis,
    JobMotoDataModal
  },
  data() {
    return {
      description: this.$t('app.message.msg0304'),
      // 查询条件
      queryParam: {},
      autoFlashFlg: false,
      stopTimer: false,
      fileName: '',
      // 表头
      columns: [
        {
          title: 'NO',
          dataIndex: '',
          key: 'rowIndex',
          width: 50,
          align: 'center',
          scopedSlots: { customRender: 'num' },
        },
        {
          title: this.$t('app.label.Job.denpyoShurui'),
          align: 'left',
          width: 100,
          dataIndex: 'denpyoShuruiDict',
        },
        {
          title: this.$t('app.label.Job.startDateForJob'),
          align: 'center',
          width: 150,
          dataIndex: 'kaishiJikan',
        },
        {
          title: this.$t('app.label.Job.endDateForJob'),
          align: 'center',
          width: 150,
          dataIndex: 'shuryoJikan',
        },
        {
          title: this.$t('app.label.Job.status'),
          align: 'left',
          width: 80,
          dataIndex: 'jotaiDict',
        },
        {
          title: this.$t('app.label.Job.originalData'),
          dataIndex: 'genFileName',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'genFileName' },
        },
        {
          title: this.$t('app.label.Job.outputFile'),
          dataIndex: 'outputFileName',
          align: 'left',
          width: 150,
          scopedSlots: { customRender: 'outputFileName' },
        },
        {
          title: this.$t('app.label.Job.log'),
          align: 'left',
          dataIndex: 'log',
          width: 50,
          scopedSlots: { customRender: 'log' },
        },
        {
          title: this.$t('app.label.Job.remark'),
          align: 'left',
          width: 250,
          dataIndex: 'biko',
          scopedSlots: { customRender: 'biko' },
        },
        {
          title: this.$t('app.label.Job.kosinusr'),
          align: 'left',
          width: 100,
          dataIndex: 'kosinusr',
          scopedSlots: { customRender: 'kosinusr' },
        },
        {
          title: this.$t('app.label.Job.kosindate'),
          align: 'center',
          width: 150,
          dataIndex: 'kosindate',
          scopedSlots: { customRender: 'kosindate' },
        },
        {
          title: this.$t('app.common.operation'),
          dataIndex: 'action',
          width: 50,
          align: 'center',
          scopedSlots: { customRender: 'action' },
        },
      ],
      url: {
        list: '/sys/job/list',
        delete: '/sys/job/delete',
        deleteBatch: '/sys/job/deleteBatch',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  mounted() {
    this.timerFun()
  },

  methods: {
    //元データ
    downloadGenFile: function (record) {
      record.downloadType = 1
      record.outputFileId = ''
      download(record).then((response) => {
        const blob = new Blob([response])
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE
          navigator.msSaveBlob(blob, record.genFileName)
        } else {
          let url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', record.genFileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    //出力ファイル
    downloadOutputFile: function (record) {
      console.log(record)
      record.downloadType = 2
      download(record).then((response) => {
        const blob = new Blob([response])
        if (window.navigator.msSaveOrOpenBlob) {
          // 兼容IE
          navigator.msSaveBlob(blob, record.outputFileName)
        } else {
          let url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.ms-excel' }))
          console.log(url)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', record.outputFileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
    //ログ 帳票ログ一覧
    openLogList(record) {
      this.$refs.logModalForm.show(record)
    },
    openOutList(record) {
      this.$refs.outModalForm.show(record)
    },
    motoData(record) {
      this.$refs.motoDataModalForm.show(record)
    },
    // 出力
    // outputFile: function (queryParam) {
    //   var that = this
    //   // if (!queryParam.denpyoShurui) {
    //   //   that.$message.warning(getMsgInfo(this, 'msg0002', 'Job.denpyoShurui'))
    //   // } else {
    //     //  this.loading = true
    //     // let urls = window._CONFIG['domianURL'] + '/sys/job/outputFile2?denpyoShurui=' + queryParam.denpyoShurui
    //     // //window.location.href = urls // 本窗口打开下载
    //     // window.open(urls, '_blank') // 新开窗口下载
    //     //  this.loading = false

    //   // }
    //  //var that = this
    //   console.log(queryParam.denpyoShurui)
    //   if (!queryParam.denpyoShurui) {
    //     that.$message.warning(getMsgInfo(this, 'msg0002', 'Job.denpyoShurui'))
    //   } else {
    //     this.loading = true
    //     output2(queryParam).then((response) => {
    //       let yy = new Date().getFullYear() + ''
    //       let mm = new Date().getMonth() + 1
    //       let dd = new Date().getDate()
    //       let hh = new Date().getHours()
    //       let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
    //       let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
    //       let fileName = yy + mm + dd + hh + mf + ss
    //       if (queryParam.denpyoShurui == '1') {
    //         fileName = 'output_999_' + fileName
    //       } else if (queryParam.denpyoShurui == '2') {
    //         fileName = 'output_FP1_' + fileName
    //       } else if (queryParam.denpyoShurui == '3') {
    //         fileName = 'output_iO_' + fileName
    //       } else if (queryParam.denpyoShurui == '4') {
    //         fileName = 'output_SDスマホ_' + fileName
    //       } else if (queryParam.denpyoShurui == '5') {
    //         fileName = 'output_スマプリ_' + fileName
    //       } else if (queryParam.denpyoShurui == '6') {
    //         fileName = 'output_決済端末【G7】_' + fileName
    //       } else if (queryParam.denpyoShurui == '7') {
    //         fileName = 'output_宅配メイト用簡易PDT_' + fileName
    //       }
    //       console.log(fileName)
    //       const blob = new Blob([response])
    //       if (window.navigator.msSaveOrOpenBlob) {
    //         // 兼容IE
    //         fileName = fileName +'.zip'
    //         navigator.msSaveBlob(blob, fileName)
    //       } else {
    //         fileName = fileName +'.zip'

    //         let url = window.URL.createObjectURL(new Blob([response], { type: 'application/zip' }))
    //         console.log(url)
    //         let link = document.createElement('a')
    //         link.style.display = 'none'
    //         link.href = url
    //         link.setAttribute('download', fileName)
    //         document.body.appendChild(link)
    //         link.click()
    //         document.body.removeChild(link) //下载完成移除元素
    //         window.URL.revokeObjectURL(url) //释放掉blob对象
    //       }

    //       this.loading = false
    //     })
    //   }
             // this.loading = false
   // },
    autoFlash(record) {
      const that = this
      console.log(record.target.checked)
      if (record.target.checked === true) {
        this.autoFlashFlg = true
        this.timerFun()
      } else {
        this.autoFlashFlg = false
        this.stopTimer = true
      }
    },
    timerFun() {
      console.log(this.autoFlashFlg)
      this.stopTimer = false
      if (this.autoFlashFlg) {
        let myTimer = setInterval(() => {
          // 停止定时器
          if (this.stopTimer == true) {
            clearInterval(myTimer)
            return
          }
          this.searchQuery()
        }, 5000)
      }
    },
    isIE() {
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>