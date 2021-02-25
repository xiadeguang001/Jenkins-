<template>
  <a-drawer
    :title="title"
    :width="drawerWidth"
    :maskClosable="false"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
  >

    <a-spin :spinning="confirmLoading">

      <a-card class="card" :bordered="false">
      <a-form :form="form" class="standard-form">
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="$t('app.label.batchJob.taskName')"
            >
            <a-input v-decorator="['taskName', validatorRules.taskName]" />
          </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.cronExpression')">
              <j-cron ref="innerVueCron" v-decorator="['cronExpression', { initialValue: '* * * * * ? *' }]" @change="setCorn"></j-cron>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.blockingStrategy')">
              <j-dict-select-tag dictCode="blocking_strategy" :triggerChange="true"  v-decorator="['blockingStrategy']"/>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.retryTimes')">
              <a-input-number v-decorator="['retryTimes', validatorRules.retryTimes]" />
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-form-item
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              :label="$t('app.label.batchJob.noticeEmails')">
              <a-input v-decorator="['noticeEmails', validatorRules.noticeEmails]" />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-row :gutter="24">
          <a-col :md="12" :sm="24">
            <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="$t('app.label.batchJob.taskStatus')"
            >
            <j-dict-select-tag dictCode="task_status" :triggerChange="true"  v-decorator="['status']"/>
          </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="24" :sm="24">
            <a-form-item
            :labelCol="labelCol1"
            :wrapperCol="wrapperCol1"
            :label="$t('app.label.batchJob.taskDescription')"
            >
            <a-input v-decorator="['description', validatorRules.taskDescription]" />
          </a-form-item>
          </a-col>
        </a-row>

       
      </a-form>
      </a-card>
      <a-card class="card" :bordered="false">
        <a-table
        ref="table"
        size="middle"
        bordered
        :pagination="false"
        rowKey="processOrder"
        :columns="columns"
        :dataSource="jobs">

        <template slot="jobSelect" slot-scope="text, record">
          <j-custom-search-tag
            url="/sys/job/allJobs"
            valueName="id"
            textName="jobName"
            v-model="record.jobId"
            width="40%"
            >
          </j-custom-search-tag>
        </template>

        <template slot="params" slot-scope="text, record">
          <a-input v-model="record.params"></a-input>
        </template>

        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="jobs.length"
            title="确认要删除吗?"
            @confirm="() => onDelete(record.processOrder)"
          >
            <a href="javascript:;"><a-icon type="delete"/>删除</a>
          </a-popconfirm>
        </template>

      </a-table>

      <div class="addIcon">
        <a-button type="primary" icon="plus-circle" @click="handleAddJob">添加任务</a-button>
      </div>
      </a-card>
      
    </a-spin>

    <div class="fill-drawer-bottom"></div>
    <div style="z-index:999 " class="drawer-bootom-button">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem;float:left">关闭</a-button>
      </a-popconfirm>

      <a-button @click="handleDelete" type="danger" :loading="deleteLoading" v-show="this.model.id">删除</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">{{this.$t('app.common.confirm')}}</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { httpAction,postAction } from '@/api/manage'
  import {duplicateCheck,batchTaskDelete,batchJobAll,queryTaskJobs} from '@/api/api'
  import { getMsgInfo } from "@/utils/util"
  import JCron from "@/components/jeecg/JCron";
  import pick from 'lodash.pick'
  import JCustomSearchTag from '@/components/dict/JCustomSearchTag'
  import { isEmail} from '@/utils/validate'
  // import moment from "moment"

  export default {
    name: "BatchJobModal",
    components: {
      JCron,
      batchJobAll,
      JCustomSearchTag
    },
    data () {
      return {
        title:"操作",
        buttonStyle: 'solid',
        visible: false,
        drawerWidth:780,
        model: {},
        jobs:[],
        labelCol: {
          md: { span: 8 },
          sm: { span: 24 },
        },
        wrapperCol: {
          md: { span: 16 },
          sm: { span: 24 },
        },

        labelCol1: {
          md: { span: 4 },
          sm: { span: 24 },
        },
        wrapperCol1: {
          md: { span: 20 },
          sm: { span: 24 },
        },
        cron: {
          label: '',
          value: ''
        },
        confirmLoading: false,
        deleteLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          taskName:{
            rules: [{
              required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.label.batchJob.taskName')})
            },{
              validator: this.validateTaskname,
            }]
          },

          cronExpression:{
            rules: [{
              required: true, message: this.$t('app.message.msg0001',{'0': this.$t('app.label.batchJob.cronExpression')})
            },{
            }]
          },

          noticeEmails:{
            rules: [{
            },{
              validator: this.validateNoticeEmails,
            }]
          },
        },
        url: {
          add: "/sys/task/add",
          edit: "/sys/task/edit",
        },

        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },

          {
            title: this.$t('app.label.batchJob.jobSelectLabel'),
            align:"center",
            width:223,
            scopedSlots: { customRender: 'jobSelect' },
          },

          {
            title: this.$t('app.label.batchJob.paramsLabel'),
            align:"center",
            width:211,
            scopedSlots: { customRender: 'params' },
          },

          {
            title: this.$t('app.label.action'),
            align:"center",
            scopedSlots: { customRender: 'operation' },
          },
        ]
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({status:"0",blockingStrategy:"1"});
      },
      edit (record) {
        this.jobs = [];
        if (record.id != null) {
          this.initJobs(record.id);
        } else {
          this.handleAddJob();
        }
        this.form.resetFields();
        this.model = Object.assign({},record);
        console.log(this.model)
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'taskName','cronExpression','blockingStrategy','retryTimes','noticeEmails','status','description'));
        });
        
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        if (!this.validateJobs()) {
          return;
        }
        // 触发表单验证
        this.form.validateFields((err, values) => {
          console.log('values',values)
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            formData.taskJobsView = that.jobs;
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })

          }
        })
      },
      handleCancel () {
        this.close()
      },

      validateTaskname(rule, value, callback){
        var params = {
          tableName: 'batch_task_info',
          fieldName: 'task_name',
          fieldVal: value,
          dataId: this.model.id,
          excludeLogicDelete: true,
          logicDeleteFieldName: "delete_flg"
        };
        duplicateCheck(params).then((res) => {
          if (res.success) {
          callback()
        } else {
          callback(getMsgInfo(this,'msg0028','batchJob.taskName'))
        }
      })
      },

      validateNoticeEmails(rule, value, callback){
        if (value != null && value != "") {
          let emails = value.split(',');
          for (let key in emails) {
            if (!isEmail(emails[key])){
              callback(this.$t('app.message.batchJob.msg0006'))
            }
          }
        }
        callback();
      },

      validateJobs() {
        let effectiveJobs = this.jobs.filter(item => item.jobId != null);
        if (effectiveJobs.length == 0) {
          this.$message.warning(this.$t('app.message.batchJob.msg0007'));
          return false;
        }
        this.jobs = effectiveJobs;
        return true;
      },

      handleDelete(){
        let that = this;
        this.$confirm({
          title: this.$t('app.message.batchJob.msg0003'),
          content: this.$t('app.message.batchJob.msg0004'),
          onOk: function () {
            that.simpleActionProcess4Modal(batchTaskDelete({id:that.model.id, exclcnt:that.model.exclcnt}), that.deleteLoading);
          }
        });
      },

      setCorn(data){
        console.log('data)',data);
        this.$nextTick(() => {
          this.model.cronExpression = data;
        })

        if (Object.keys(data).length==0) {
          this.$message.warning(this.$t('app.message.msg0001', this.$t('app.label.batchJob.cronExpression')));
        }
      },

      initJobs(id) {
        let that = this;
        queryTaskJobs({"taskId":id}).then((res) => {
        if (res.success) {
          if (res.result == null || res.result.length === 0) {
            // 默认给一个
            that.handleAddJob();
          } else {
            res.result.forEach(j => {j.jobId = j.jobId.toString()});
            that.jobs = res.result;
          }
          console.log(that.jobs);
        }
      });
      },

      onDelete(key) {
        this.jobs = this.jobs.filter(item => item.processOrder !== key);
      },

      handleAddJob() {
        let processOrder = this.jobs.length + 1;
        this.jobs.push({"processOrder": processOrder});
      }
    }
  }
</script>

<style scoped>
  .addIcon {
    width: 100%;
    text-align: left;
    margin-top: 4px;
  }
</style>