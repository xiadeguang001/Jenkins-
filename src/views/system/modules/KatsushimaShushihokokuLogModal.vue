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
      rowKey="id"
      bordered
      :columns="columns"
      :dataSource="dataSource"
      :loading="loading"
      :pagination="ipagination"
        @change="handleTableChange"
    >
       <span
          slot="num"
          slot-scope="text, record, index"
        >{{(ipagination.current-1)*ipagination.pageSize+parseInt(index)+1}}</span>
      <!-- 字符串超长截取省略号显示-->
      <span slot="content" slot-scope="text">
        <j-ellipsis :value="text" :length="20" />
      </span>


    </a-table>
    
      <template slot="footer">
      <a-button @click="handleCancel" type="primary">{{$t('app.common.close')}}</a-button>
        <a-button type="primary" @click="searchQuery">{{$t('app.common.refresh')}}</a-button>
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
  name: 'KatsushimaShushihokokuLogModal',
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
      queryParam: {
        page: 1
        },
      record: {},
      ipagination:{current:1},
      dataSource:null,
      // 表头
      columns: [
        {
          title: 'NO',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          scopedSlots: { customRender: 'num' },
        },
        {
          title: this.$t('app.label.Job.logTime'),
          align: 'center',
          dataIndex: 'logTime'
        },
        {
          title: this.$t('app.label.Job.logDetail'),
          align: 'left',
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
  created() {
    const pager = { ...this.ipagination };
      pager.current = 1;
      this.ipagination = pager;
  },
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
        const pager = { ...this.ipagination };
      pager.current = 1;
      this.ipagination = pager;      
      this.close()
    },
    searchQuery(){
      this.loadData();
      const pager = { ...this.ipagination };
      pager.current = 1;
      this.ipagination = pager;
    }
  }
}
</script>

<style scoped>

@import '~@assets/less/common.less';
</style>