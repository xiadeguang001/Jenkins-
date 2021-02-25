/**
 * 新增修改完成调用 modalFormOk方法 编辑弹框组件ref定义为modalForm
 * 高级查询按钮调用 superQuery方法  高级查询组件ref定义为superQueryModal
 * data中url定义 list为查询列表  delete为删除单条记录  deleteBatch为批量删除
 */
import { filterObj } from '@/utils/util';
import { deleteAction, getAction, downFile } from '@/api/manage'
import Vue from 'vue'
import { ACCESS_TOKEN } from "@/store/mutation-types"

export const JeecgListMixin = {
  data() {
    return {
      //token header
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      /* 查询条件-请不要在queryParam中声明非字符串值的属性 */
      queryParam: {},
      /* 数据源 */
      dataSource: [],
      /* 分页参数 */
      ipagination: {
        current: 1,
        pageSize: 20,
        pageSizeOptions: ['10', '20', '30'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " " + this.$t('app.common.altogether') + total + this.$t('app.common.strip')
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      /* 排序参数 */
      isorter: {
        column: 'createTime',
        order: 'desc',
      },
      /* 筛选参数 */
      filters: {},
      /* table加载状态 */
      loading: false,
      /* table选中keys*/
      selectedRowKeys: [],
      /* table选中records*/
      selectionRows: [],
      /* 查询折叠 */
      toggleSearchStatus: false,
      /* 高级查询条件生效状态 */
      superQueryFlag: false,
      /* 高级查询条件 */
      superQueryParams: "",
      /* 是否显示合计行 */
      hasTotal: false
    }
  },
  created() {
    if (!this.disableMixinCreated) {
      console.log(' -- mixin created -- ')
      this.loadData();
      //初始化字典配置 在自己页面定义
      this.initDictConfig();
    }
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        console.log("请设置url.list属性!")
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = this.getQueryParams();//查询条件
      this.loading = true;
      getAction(this.url.list, params).then((res) => {
        if (res.success) {
          this.dataSource = res.result.records;
          this.ipagination.total = res.result.total;

          // 添加合计行
          if (this.hasTotal) {
            var count = this.ipagination.pageSizeOptions
            this.tableAddTotalRow(this.columns, this.dataSource, params.pageSize)
          }
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false;
      })
    },
    initDictConfig() {
      console.log("--这是一个假的方法!")
    },
    handleSuperQuery(arg) {
      //高级查询方法
      if (!arg) {
        this.superQueryParams = ''
        this.superQueryFlag = false
      } else {
        this.superQueryFlag = true
        this.superQueryParams = JSON.stringify(arg)
      }
      this.loadData()
    },
    getQueryParams() {
      //获取查询条件
      let sqp = {}
      if (this.superQueryParams) {
        sqp['superQueryParams'] = encodeURI(this.superQueryParams)
        sqp['superQueryMatchType'] = this.superQueryMatchType
      }
      var param = Object.assign(sqp, this.queryParam, this.isorter, this.filters);
      param.field = this.getQueryField();
      param.pageNo = this.ipagination.current;
      param.pageSize = this.ipagination.pageSize;
      return filterObj(param);
    },
    getQueryField() {
      //TODO 字段权限控制
      var str = "id,";
      this.columns.forEach(function (value) {
        str += "," + value.dataIndex;
      });
      return str;
    },

    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectionRows = selectionRows;
    },
    onClearSelected() {
      this.selectedRowKeys = [];
      this.selectionRows = [];
    },
    searchQuery() {
      this.loadData(1);
    },
    superQuery() {
      this.$refs.superQueryModal.show();
    },
    searchReset() {
      this.queryParam = {}
      this.loadData(1);
    },
    batchDel: function () {
      if (!this.url.deleteBatch) {
        this.$message.error(this.$t("app.message.msg0310"))
        return
      }
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning(this.$t("app.message. msg0021"));
        return;
      } else {
        var ids = "";
        for (var a = 0; a < this.selectedRowKeys.length; a++) {
          ids += this.selectedRowKeys[a] + ",";
        }
        var that = this;
        this.$confirm({
          title: this.$t("app.message. msg0006"),
          content: this.$t("app.message. msg0007"),
          onOk: function () {
            that.loading = true;
            deleteAction(that.url.deleteBatch, { ids: ids }).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.loading = false;
            });
          }
        });
      }
    },
    handleDelete: function (id) {
      if (!this.url.delete) {
        this.$message.error("请设置url.delete属性!")
        return
      }
      var that = this;
      deleteAction(that.url.delete, { id: id }).then((res) => {
        if (res.success) {
          that.$message.success(res.message);
          that.loadData();
        } else {
          that.$message.warning(res.message);
        }
      });
    },
    handleEdit: function (record) {
      this.$refs.modalForm.edit(record);
      if (this.$refs.modalForm.editTitle === undefined || this.$refs.modalForm.editTitle == '') {
        // this.$refs.modalForm.title = "编辑";
      } else {
        this.$refs.modalForm.title = this.$refs.modalForm.editTitle;
      }
      this.$refs.modalForm.disableSubmit = false;
    },
    handleAdd: function () {
      this.$refs.modalForm.add();
      if (this.$refs.modalForm.addTitle === undefined || this.$refs.modalForm.addTitle == '') {
        // this.$refs.modalForm.title = "新規";
      } else {
        this.$refs.modalForm.title = this.$refs.modalForm.addTitle;
      }
      this.$refs.modalForm.disableSubmit = false;
    },
    handleTableChange(pagination, filters, sorter) {
      //分页、排序、筛选变化时触发
      //TODO 筛选
      if (Object.keys(sorter).length > 0) {
        this.isorter.column = sorter.field;
        this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
      }
      this.ipagination = pagination;
      this.loadData();
    },
    handleToggleSearch() {
      this.toggleSearchStatus = !this.toggleSearchStatus;
    },
    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData();
    },
    handleDetail: function (record) {
      this.$refs.modalForm.edit(record);
      if (this.$refs.modalForm.detailTitle === undefined || this.$refs.modalForm.detailTitle == '') {
        this.$refs.modalForm.title = "详情";
      } else {
        this.$refs.modalForm.title = this.$refs.modalForm.detailTitle;
      }
      this.$refs.modalForm.disableSubmit = true;
    },
    /* 导出 */
    handleExportXls2() {
      let paramsStr = encodeURI(JSON.stringify(this.getQueryParams()));
      let url = `${window._CONFIG['domianURL']}/${this.url.exportXlsUrl}?paramsStr=${paramsStr}`;
      window.location.href = url;
    },
    handleExportXls(fileName) {
      if (!fileName || typeof fileName != "string") {
        fileName = "导出文件"
      }
      let param = { ...this.queryParam };
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['selections'] = this.selectedRowKeys.join(",")
      }
      console.log("导出参数", param)
      downFile(this.url.exportXlsUrl, param).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data]), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
        }
      })
    },
    /* 导入 */
    handleImportExcel(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          // this.$message.success(`${info.file.name} 文件上传成功`);
          if (info.file.response.code === 201) {
            let { message, result: { msg, fileUrl, fileName } } = info.file.response
            let href = window._CONFIG['domianURL'] + fileUrl
            this.$warning({
              title: message,
              content: (
                <div>
                  <span>{msg}</span><br />
                  <span>具体详情请 <a href={href} target="_blank" download={fileName}>点击下载</a> </span>
                </div>
              )
            })
          } else {
            this.$message.success(info.file.response.message || `${info.file.name} 文件上传成功`)
          }
          this.loadData()
        } else {
          this.$message.error(`${info.file.name} ${info.file.response.message}.`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`文件上传失败: ${info.file.msg} `);
      }
    },
    /* 图片预览 */
    getImgView(text) {
      if (text && text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      return window._CONFIG['imgDomainURL'] + "/" + text
    },
    /* 文件下载 */
    uploadFile(text) {
      if (!text) {
        this.$message.warning("未知的文件")
        return;
      }
      if (text.indexOf(",") > 0) {
        text = text.substring(0, text.indexOf(","))
      }
      window.open(window._CONFIG['domianURL'] + "/sys/common/download/" + text);
    },
    // 自定义表格加载
    initColumns() {
      //权限过滤（列权限控制时打开，修改第二个参数为授权码前缀）
      var key = this.$route.name + ":colsettings";
      let colSettings = Vue.ls.get(key);
      //把表头放到自定义列里
      if (colSettings == null || colSettings == undefined) {
        let allSettingColumns = [];
        this.defColumns.forEach(function (item, i, array) {
          allSettingColumns.push(item.dataIndex);
        })
        this.settingColumns = allSettingColumns;
        const cols = this.defColumns.filter(item => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action') {
            return true;
          }
          if (allSettingColumns.includes(item.dataIndex)) {
            return true;
          }
          return false;
        })
        this.columns = cols;
        //去除自定义不显示的部分
        if (this.settingColumnsBlank != undefined) {
          this.settingColumnsBlank.forEach(tabColumn => {
            this.defColumns.forEach(tabColumns => {
              if (tabColumns.dataIndex == tabColumn.dataIndex) {
                this.defColumns.splice(this.defColumns.indexOf(tabColumns), 1);
              }
            })
          })
        }
      } else {
        //在此处把表头放到自定义列
        this.settingColumns = colSettings;
        const cols = this.defColumns.filter(item => {
          if (item.key == 'rowIndex' || item.dataIndex == 'action') {
            return true;
          }
          if (colSettings.includes(item.dataIndex)) {
            return true;
          }
          return false;
        })
        this.columns = cols;
        //去除自定义不显示的部分
        if (this.settingColumnsBlank != undefined) {
          this.settingColumnsBlank.forEach(tabColumn => {
            this.defColumns.forEach(tabColumns => {
              if (tabColumns.dataIndex == tabColumn.dataIndex) {
                this.defColumns.splice(this.defColumns.indexOf(tabColumns), 1);
              }
            })
          })
        }
      }
    },
    //列设置更改事件
    onColSettingsChange(checkedValues, index) {
      var key = this.$route.name + ":colsettings";
      Vue.ls.set(key, checkedValues, 7 * 24 * 60 * 60 * 1000)
      this.settingColumns = checkedValues;
      var i = index;
      const Columns = this.columns.filter(item => {
        if (this.settingColumnsBlank != undefined) {
          this.settingColumnsBlank.forEach(tabColumn => {
            if (item.dataIndex == tabColumn.dataIndex) {
              this.defColumns.splice(i, 0, item)
              i++;
            }
          })
        }
      })
      const cols = this.defColumns.filter(item => {
        if (item.key == 'rowIndex' || item.dataIndex == 'action') {
          return true
        }
        if (this.settingColumns.includes(item.dataIndex)) {
          return true
        }
        return false
      })
      if (this.settingColumnsBlank != undefined) {
        this.settingColumnsBlank.forEach(tabColumn => {
          this.defColumns.forEach(tabColumns => {
            if (tabColumns.dataIndex == tabColumn.dataIndex) {
              this.defColumns.splice(this.defColumns.indexOf(tabColumns), 1);
            }
          })
        })
      }
      this.columns = cols;
    },
    /** 表格增加合计行 */
    tableAddTotalRow(columns, dataSource, pageSizes) {
      let numKey = 'rowIndex'
      let totalRow = { [numKey]: '合计' }
      columns.forEach(column => {
        let { key, dataIndex } = column
        if (![key, dataIndex].includes(numKey)) {

          let total = 0
          dataSource.forEach(data => {
            total += /^\d+\.?\d?$/.test(data[dataIndex]) ? Number.parseInt(data[dataIndex]) : Number.NaN
          })

          if (Number.isNaN(total)) {
            total = '-'
          }
          totalRow[dataIndex] = total
        }
      })

      // 每页最后一条数据是合计行
      totalRow["id"] = -1;
      var i = 0;
      var newDataSource = new Array();
      dataSource.forEach(data => {
        newDataSource.push(dataSource[i]);
        totalRow["id"] = -1 - i;
        if (i + 2 == pageSizes) {

          newDataSource.push(totalRow);
        } else if (i + 1 == dataSource.length) {
          newDataSource.push(totalRow);
        }
        i++;
      })
      this.dataSource = newDataSource
    },
    InterlaceDiscoloration(record, index) {
      // 表格的隔行变色功能
      if (index % 2 === 1) {
        return "once"
      } else {
        return "twoe"
      }
    },

    simpleActionProcess4List(obj) {
      let that = this;
      obj.then((res) => {
            if (res.success) {
              that.$message.success(res.message)
            } else {
              that.$message.warning(res.message)
            }
          }).finally(() => {
            that.loadData();
          });
    },
  }
}