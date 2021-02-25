<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    @cancel="handleCancel"
    :cancelText="$t('app.common.close')"
  >
    <a-table
      ref="table"
      size="middle"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
    >
      <!-- 字符串超长截取省略号显示-->
      <span slot="content" slot-scope="text">
        <j-ellipsis :value="text" :length="20" />
      </span>


    </a-table>
    
      <template slot="footer">
      <a-button @click="handleCancel" type="primary">{{$t('app.common.close')}}</a-button>
    </template>
  </a-modal>

</template>

<script>
import { httpAction, postAction } from '@/api/manage'
import { quartzStatus, getJobClasses,getJobLogList } from '@/api/api'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JCron from '@/components/jeecg/JCron'
import pick from 'lodash.pick'
import JDictSelectTag from '../../../components/dict/JDictSelectTag.vue'
import JUpload from '../../../components/jeecg/JUpload'
import JEllipsis from '@/components/jeecg/JEllipsis'

function superRequest(options) {
    this.loading = !!options.loading
    options.promise.then(res => {
      if (res.success && typeof options.success === 'function') {
        options.success(res)
      } else {
        throw new Error(res.message)
      }
    }).catch(e => {
      // console.error('查询已删除的用户失败：', e)
      // this.$message.warning(this.$t('app.message.msg0037'))
    }).finally(() => {
      this.loading = false
    })
  }

export default {
  name: 'InventoryLogModal',
  mixins: [JeecgListMixin],
  components: {
    JEllipsis
  },
  data() {
    return {
      title: this.$t('app.label.Job.logList'),
      visible: false,
      description: this.$t('app.message.msg0304'),
      // 查询条件
      queryParam: {},
      record: {},
      dataSource:null,
      // 表头
      columns: [
        {
          title: 'NO',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: this.$t('app.label.Job.logTime'),
          align: 'center',
          dataIndex: 'logTime'
        },
        {
          title: this.$t('app.label.Job.logDetail'),
          align: 'center',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        }
      ],
      url: {
        list: '/sys/job/logList'
      }
    }
  },
    watch: {
      visible: {
        immediate: true,
        handler(val) {
          if (val) {
            this.loadData()
          }
          this.innerVisible = val
        }
      },
      innerVisible(val) {
        this.$emit('update:visible', val)
      },
    },
  created() {},
  methods: {
    loadData() {  
        superRequest.call(this, {
          loading: true,
          promise: getJobLogList(this.record),
          success: res => this.dataSource = res.result.records
        })
      },
    show(record) {
      let that = this
      this.visible = true
      this.record = record
    },

    close() {
      this.$emit('close')
      this.visible = false
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style scoped>
</style>