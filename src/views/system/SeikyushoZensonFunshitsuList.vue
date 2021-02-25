<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
       <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
            <a-col :md="6" :sm="10">
              <a-form-item :label="$t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui')">
                <j-dict-select-tag v-model="queryParam.seikyushoShurui" dictCode="zensonFunshitsuShurui"  :triggerChange="true" @change="onSelectChangeSer"/>
              </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
             <a-form-item :label="$t('app.label.SeikyushoZensonFunshitsu.serialNo')">
              <a-input  v-model="queryParam.serialNo"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="10">
            <a-form-item :label="$t('app.label.SeikyushoZensonFunshitsu.kubun')">
              <j-dict-select-tag dictCode="kubun" v-model="queryParam.kubun" />
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
            </span>
          </a-col>
        </a-row>
      </a-form> 
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus" v-has="'job:add'">{{$t('app.common.add')}}</a-button>
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
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :rowClassName="InterlaceDiscoloration"
        @change="handleTableChange"
      >
        <span
          slot="num"
          slot-scope="text, record, index"
        >{{(ipagination.current-1)*ipagination.pageSize+parseInt(index)+1}}</span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">
          <a-icon type="edit"/>{{$t('app.common.edit')}}</a>
        </span>
        <span slot="fileName" slot-scope="text, record">
          <!-- 元データ -->
          <a @click="downloadPdfFile(record)" style="text-decoration:underline;">
            <j-ellipsis :value="record.fileName" />
          </a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <SeikyushoZensonFunshitsu-modal ref="modalForm" @ok="modalFormOk"></SeikyushoZensonFunshitsu-modal>
    <!-- <SeikyushoZensonFunshitsu-Log-modal ref="logModalForm"></SeikyushoZensonFunshitsu-Log-modal> -->
  </a-card>
</template>

<script>
import SeikyushoZensonFunshitsuModal from './modules/SeikyushoZensonFunshitsuModal'
import { getAction, postAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { axios } from '@/utils/request'
import { downloadPdf, output } from '@/api/api'
import { getMsgInfo } from '@/utils/util'

export default {
  name: 'SeikyushoZensonFunshitsuList',
  mixins: [JeecgListMixin],
  components: {
    SeikyushoZensonFunshitsuModal,
    JEllipsis,
  },
  data() {
    return {
      description: this.$t('app.message.msg0304'),
      // 查询条件
      queryParam: {},
      // 表头
      columns: [
        {
          title: 'NO',
          dataIndex: 'no',
          //key: 'rowIndex',
         // width: 50,
          align: 'center',
          //scopedSlots: { customRender: 'num' },
        },
        {
          // 請求書種類
          title: this.$t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui'),
          align: 'left',
          //width: 100,
          dataIndex: 'seikyushoDict',
        },
        {
          // シリアル№
          title: this.$t('app.label.SeikyushoZensonFunshitsu.serialNo'),
          align: 'left',
          //width: 100,
          dataIndex: 'serialNo',
        },
        {
          // エリア
          title: this.$t('app.label.SeikyushoZensonFunshitsu.area'),
          align: 'left',
          //width: 100,
          dataIndex: 'area',
        },
        {
          // 支店
          title: this.$t('app.label.SeikyushoZensonFunshitsu.shiten'),
          align: 'left',
          //width: 100,
          dataIndex: 'shiten',
        },
        {
          // 店名
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tenMei'),
          align: 'center',
         // width: 150,
          dataIndex: 'tenMei',
        },
        {
          // 店コード
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tenCode'),
          align: 'left',
          //width: 100,
          dataIndex: 'tenCode',
        },
        // {
        //   // 受付日
        //   title: this.$t('app.label.SeikyushoZensonFunshitsu.uketsukebiDate'),
        //   align: 'center',
        //   //width: 150,
        //   dataIndex: 'uketsukebiDate',
        // },
        {
          // 区分
          title: this.$t('app.label.SeikyushoZensonFunshitsu.kubun'),
          align: 'left',
          //width: 80,
          dataIndex: 'kubunDict',
        },
        {
          // 電話番号
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tel'),
          align: 'left',
          //width: 100,
          dataIndex: 'tel',
        },
        {
          // 月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.gatsudo'),
          align: 'center',
          //width: 150,
          dataIndex: 'gatsudo',
        },
        {
          // SGS受付日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.sgsUketsukeBi'),
          align: 'center',
          //width: 150,
          dataIndex: 'sgsUketsukeBi',
        },
        {
          // 入力②請求月基準日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.nyuryoku2SeikyuTsukiKijunbi'),
          align: 'center',
          //width: 150,
          dataIndex: 'nyuryoku2SeikyuTsukiKijunbi',
        },
        {
          // 解約年月
          title: this.$t('app.label.SeikyushoZensonFunshitsu.kaiyakuYearMonth'),
          align: 'center',
          //width: 150,
          dataIndex: 'kaiyakuYearMonth',
        },
        {
          // 契約番号
          title: this.$t('app.label.SeikyushoZensonFunshitsu.keiyakuBango'),
          align: 'left',
          //width: 80,
          dataIndex: 'keiyakuBango',
        },
        {
          // 入力日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.fpnyuyokubi'),
          align: 'center',
          //width: 80,
          dataIndex: 'fpnyuyokubi',
        },
        {
          // 発生月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.hasseiGatsudo'),
          align: 'center',
          //width: 80,
          dataIndex: 'hasseiGatsudo',
        },
        {
          // 請求月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.seikyuGatsudo'),
          align: 'center',
          //width: 80,
          dataIndex: 'seikyuGatsudo',
        },
        // {
        //   // vlookOne
        //   title: this.$t('app.label.SeikyushoZensonFunshitsu.vlookOne'),
        //   align: 'left',
        //   //width: 80,
        //   dataIndex: 'vlookOne',
        // },
        // {
        //   // vlookTwo
        //   title: this.$t('app.label.SeikyushoZensonFunshitsu.vlookTwo'),
        //   align: 'left',
        //   //width: 80,
        //   dataIndex: 'vlookTwo',
        // },
        // {
        //   // vlookThree
        //   title: this.$t('app.label.SeikyushoZensonFunshitsu.vlookThree'),
        //   align: 'left',
        //   //width: 80,
        //   dataIndex: 'vlookThree',
        // },
        {
          title: this.$t('app.label.SeikyushoZensonFunshitsu.pdfData'),
          dataIndex: 'fileName',
          align: 'left',
          //width: 150,
          scopedSlots: { customRender: 'fileName' },
        },
        {
          // 操作
          title: this.$t('app.common.operation'),
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          //width: 200,
          //fixed:"right",
        }
      ],
      columnsOne: [
        {
          title: 'NO',
          dataIndex: 'no',
          //key: 'rowIndex',
         // width: 50,
          align: 'center',
          //scopedSlots: { customRender: 'num' },
        },
        {
          // 請求書種類
          title: this.$t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui'),
          align: 'left',
          //width: 100,
          dataIndex: 'seikyushoDict',
        },
        {
          // シリアル№
          title: this.$t('app.label.SeikyushoZensonFunshitsu.serialNo'),
          align: 'left',
          //width: 100,
          dataIndex: 'serialNo',
        },
        {
          // エリア
          title: this.$t('app.label.SeikyushoZensonFunshitsu.area'),
          align: 'left',
          //width: 100,
          dataIndex: 'area',
        },
        {
          // 支店
          title: this.$t('app.label.SeikyushoZensonFunshitsu.shiten'),
          align: 'left',
          //width: 100,
          dataIndex: 'shiten',
        },
        {
          // 店名
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tenMei'),
          align: 'center',
         // width: 150,
          dataIndex: 'tenMei',
        },
        {
          // 店コード
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tenCode'),
          align: 'left',
          //width: 100,
          dataIndex: 'tenCode',
        },
        {
          // 区分
          title: this.$t('app.label.SeikyushoZensonFunshitsu.kubun'),
          align: 'left',
          //width: 80,
          dataIndex: 'kubunDict',
        },
        {
          // 電話番号
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tel'),
          align: 'left',
          //width: 100,
          dataIndex: 'tel',
        },
        {
          // 月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.gatsudo'),
          align: 'center',
          //width: 150,
          dataIndex: 'gatsudo',
        },
        {
          // SGS受付日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.sgsUketsukeBi'),
          align: 'center',
          //width: 150,
          dataIndex: 'sgsUketsukeBi',
        },
        {
          // 入力②請求月基準日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.nyuryoku2SeikyuTsukiKijunbi'),
          align: 'center',
          //width: 150,
          dataIndex: 'nyuryoku2SeikyuTsukiKijunbi',
        },
        {
          title: this.$t('app.label.SeikyushoZensonFunshitsu.pdfData'),
          dataIndex: 'fileName',
          align: 'left',
          //width: 150,
          scopedSlots: { customRender: 'fileName' },
        },
        {
          // 操作
          title: this.$t('app.common.operation'),
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          //width: 200,
          //fixed:"right",
        },
      ],
      columnsTwo: [
        {
          title: 'NO',
          dataIndex: 'no',
          //key: 'rowIndex',
         // width: 50,
          align: 'center',
          //scopedSlots: { customRender: 'num' },
        },
        {
          // 請求書種類
          title: this.$t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui'),
          align: 'left',
          //width: 100,
          dataIndex: 'seikyushoDict',
        },
        {
          // シリアル№
          title: this.$t('app.label.SeikyushoZensonFunshitsu.serialNo'),
          align: 'left',
          //width: 100,
          dataIndex: 'serialNo',
        },
        {
          // 支店
          title: this.$t('app.label.SeikyushoZensonFunshitsu.shiten'),
          align: 'left',
          //width: 100,
          dataIndex: 'shiten',
        },
        {
          // 店名
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tenMei'),
          align: 'center',
         // width: 150,
          dataIndex: 'tenMei',
        },
        {
          // 入力日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.fpnyuyokubi'),
          align: 'center',
          //width: 80,
          dataIndex: 'fpnyuyokubi',
        },
        {
          // 区分
          title: this.$t('app.label.SeikyushoZensonFunshitsu.kubun'),
          align: 'left',
          //width: 80,
          dataIndex: 'kubunDict',
        },
        {
          // 発生月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.hasseiGatsudo'),
          align: 'center',
          //width: 80,
          dataIndex: 'hasseiGatsudo',
        },
        {
          // 請求月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.seikyuGatsudo'),
          align: 'center',
          //width: 80,
          dataIndex: 'seikyuGatsudo',
        },
        {
          title: this.$t('app.label.SeikyushoZensonFunshitsu.pdfData'),
          dataIndex: 'fileName',
          align: 'left',
          //width: 150,
          scopedSlots: { customRender: 'fileName' },
        },
        {
          // 操作
          title: this.$t('app.common.operation'),
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          //width: 200,
          //fixed:"right",
        }
      ],
       columnsThree: [
        {
          title: 'NO',
          dataIndex: 'no',
          //key: 'rowIndex',
         // width: 50,
          align: 'center',
          //scopedSlots: { customRender: 'num' },
        },
        {
          // 請求書種類
          title: this.$t('app.label.SeikyushoZensonFunshitsu.zensonFunshitsuShurui'),
          align: 'left',
          //width: 100,
          dataIndex: 'seikyushoDict',
        },
        {
          // シリアル№
          title: this.$t('app.label.SeikyushoZensonFunshitsu.serialNo'),
          align: 'left',
          //width: 100,
          dataIndex: 'serialNo',
        },
        {
          // 支店
          title: this.$t('app.label.SeikyushoZensonFunshitsu.shiten'),
          align: 'left',
          //width: 100,
          dataIndex: 'shiten',
        },
        {
          // 店名
          title: this.$t('app.label.SeikyushoZensonFunshitsu.tenMei'),
          align: 'center',
         // width: 150,
          dataIndex: 'tenMei',
        },
        {
          // 区分
          title: this.$t('app.label.SeikyushoZensonFunshitsu.kubun'),
          align: 'left',
          //width: 80,
          dataIndex: 'kubunDict',
        },
        {
          // 月度
          title: this.$t('app.label.SeikyushoZensonFunshitsu.gatsudo'),
          align: 'center',
          //width: 150,
          dataIndex: 'gatsudo',
        },
        {
          // 入力②請求月基準日
          title: this.$t('app.label.SeikyushoZensonFunshitsu.nyuryoku2SeikyuTsukiKijunbi'),
          align: 'center',
          //width: 150,
          dataIndex: 'nyuryoku2SeikyuTsukiKijunbi',
        },
        {
          title: this.$t('app.label.SeikyushoZensonFunshitsu.pdfData'),
          dataIndex: 'fileName',
          align: 'left',
          //width: 150,
          scopedSlots: { customRender: 'fileName' },
        },
        {
          // 操作
          title: this.$t('app.common.operation'),
          dataIndex: 'action',
          scopedSlots: {customRender: 'action'},
          align: "center",
          //width: 200,
          //fixed:"right",
        }
      ],
      url: {
        list: '/sys/seikyushozensonfunshitsu/list',
        delete: '/sys/seikyushozensonfunshitsu/delete',
        deleteBatch: '/sys/seikyushozensonfunshitsu/deleteBatch',
      },
    }
  },
  computed: {
    importExcelUrl: function () {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
  },

  // mounted() {
  //   this.timerFun()
  // },
 methods: {
      onSelectChangeSer(value) {
        // 下拉框1
         if(value==1 ){
            this.columns = this.columnsOne; 
         }
         // 下拉框2
         else if(value==2){
           this.columns = this.columnsTwo;
         }
         // 下拉框3
         else if(value==3){
           this.columns = this.columnsThree;
         }
        this.queryParam.seikyushoShurui = value;

      },

    //元データ
    downloadPdfFile: function (record) {
      record.downloadType = 1
      record.outputFileId = ''
      console.log("1:"+record.fileId);
      // let url = window.location.origin;
      // console.log(url);
      // let urls = window._CONFIG['domianURL']+'/sys/test/downloadPdfFile?fileId=' + record.fileId;
      //let urls = 'http://localhost:3000/dacs/sys/test/downloadPdfFile?fileId=' + record.fileId;
      // window.location.href = urls; // 本窗口打开下载
      // window.open(urls, '_blank'); // 新开窗口下载
      downloadPdf(record).then((response) => {
        const blob = new Blob([response])
        if (window.navigator.msSaveOrOpenBlob) {
          console.log("2:"+record);
          // 兼容IE
          navigator.msSaveBlob(blob, record.fileName)
        } else {
           console.log("3:"+record.fileName);
           console.log("4:"+record.fileId);
          let url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', record.fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },
  },



}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>