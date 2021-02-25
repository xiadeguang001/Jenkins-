<template>
  <a-modal
    title="【回收站】"
    :width="modalWidth"
    :style="modalStyle"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel">
    <template slot="footer">
      <a-button @click="handleCancel" v-html="$t('app.common.close')"></a-button>
    </template>
    <a-table
      ref="table"
      rowKey="id"
      size="middle"
      bordered
      :columns="columns"
      :loading="loading"
      :dataSource="dataSource"
      :rowClassName="InterlaceDiscoloration"
      :pagination="false">
      <span slot="action" slot-scope="text, record">
        <!-- 字典取回按钮 -->
        <a @click="handleBack(record.id)" v-html="$t('app.common.dictRollback')"><a-icon type="redo"/></a>
        <a-divider type="vertical"/>
        <!-- 彻底删除 -->
        <a @click="handleDelete(record.id)" v-html="$t('app.common.dictDelete')"><a-icon type="scissor"/></a>
      </span>
    </a-table> 

  </a-modal>


</template>

<script>
  import { getAction,deleteAction,putAction } from '@/api/manage'
  export default {
    name: "DictDeleteList",
    data () {
      return {
        modalWidth: '1000px',
        modalStyle: { 'top': '20px'},
        title: this.$t('app.label.action'),
        visible: false,
        loading: false,
        dataSource:[],
        columns:[
          // {
          //   title: '#',
          //   dataIndex: '',
          //   key: 'rowIndex',
          //   width: 40,
          //   align: "center",
          //   customRender: function (t, r, index) {
          //     return parseInt(index) + 1;
          //   }
          // },
          {
            // 字典名称
            title: this.$t('app.label.dictName'),
            width: 250,
            align: "left",
            dataIndex: 'dictName'
          },
          {
            // 字典编码
            title: this.$t('app.label.dictCode'),
            width: 250,
            align: "left",
            dataIndex: 'dictCode'
          },
          {
            // 描述
            title: this.$t('app.label.description'),
             width: 260,
            align: "left",
            dataIndex: 'description'
          },
          {
            // 操作
            title: this.$t('app.label.action'),
            dataIndex: 'action',
            width: 200,
            align: "center",
            scopedSlots: {customRender: 'action'}
          }
        ]
      }
    },

    methods: {
      // 初期
      handleCancel(){
        this.visible = false
      },
      show(){
        this.visible = true
        this.loadData();
      },
      // 数据处理
      loadData(){
        this.loading = true
        getAction("/sys/dict/deleteList").then(res=>{
          this.loading = false
          if(res.success){
            this.dataSource = res.result
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      // 数据处理
      handleBack(id){
        putAction("/sys/dict/back/"+id).then(res=>{
          if(res.success){
            this.$message.success(res.message)
            this.loadData();
          }else{
            this.$message.warning(res.message)
          }
        })
      },
      // 数据处理
      handleDelete(id){
        deleteAction("/sys/dict/deletePhysic/"+id).then(res=>{
          if(res.success){
            this.$message.success(res.message)
            this.loadData();
          }else{
            this.$message.warning(res.message)
          }
        })
      }

    }
  }
</script>

<style scoped>

</style>