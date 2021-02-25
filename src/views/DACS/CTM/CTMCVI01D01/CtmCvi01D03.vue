<!--
*   
*   ページ： エージェントを探すview
*   説明： コンテナ履歴の情報を検索する
*
-->
<template>
    <a-drawer
        :title="title"
        :width="drawerWidth"
        :maskClosable="true"
        @close="handleCancel"
        :visible="visible"
        :confirmLoading="confirmLoading"
        :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}">

        <div :style="{width: '100%',padding: '10px 16px',background: '#fff',}">
            <a-spin :spinning="confirmLoading">
                <a-form :form="form" class="standard-form">
                    <!-- コンテナ -->
                    <a-form-item
                    :labelCol="labelCol"
                    :wrapperCol="wrapperCol"
                    :label="this.$t('app.CtmChc01D01.10000')">

                        <a-input v-decorator="['containerfrom']" maxLength="5"  style="width:150px"  /> 
                        <span style="margin-top: 18px;margin-left: 15px;">{{$t('app.MstCap01D01.10014')}}</span>
                        <a-input v-decorator="['containerto']"  style="margin-left:20px;width:150px;"  />    
                    </a-form-item>
                </a-form>
            </a-spin>
        </div>
        
        <div class="fill-drawer-bottom"></div>
        <div style="z-index:999 " class="drawer-bootom-button">
            <a-button @click="resetClick" icon="reload" style="margin-left: 8px">{{this.$t('app.common.reload')}}</a-button>

            <a-button @click="handleOk" type="primary" :loading="confirmLoading" :disabled="disableSubmit" icon="search">{{this.$t('app.common.search')}}</a-button>    
        </div>

    </a-drawer>
</template>

<script>
    import pick from 'lodash.pick'
    export default {
        name: "CtmChc01D03",
        components: {
                
        },
        data () {
            return {
                drawerWidth: 600,
                title:this.$t('app.common.search'),
                addTitle: this.$t('app.common.add'),
                editTitle: this.$t('app.common.edit'),
                visible: false,
                disableSubmit:false,
                containerfrom:"",
                containerto:"",
                model: {},
                
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 },
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 19 },
                },

                confirmLoading: false,
                form: this.$form.createForm(this),

                iconChooseVisible: false,
                validateStatus:""
            }
        },
        computed:{
        },
        methods: {
            edit (record) {
                this.resetScreenSize(); 
                this.form.resetFields();
                this.model = Object.assign({}, record);
                this.visible = true;
                console.log(record);

            },
            close () {
                this.visible = false;
            },
            handleOk () {
                this.$emit('ok', this.model);
                this.close();
            },
            handleCancel () {
                this.close();
            },
            handleButtonClick () {

            },
            resetScreenSize(){
                let screenWidth = document.body.clientWidth;
                if(screenWidth < 400){
                    this.drawerWidth = screenWidth;
                }else{
                    this.drawerWidth = 600;
                }
            },

            resetClick(){
               
            },

        }
    }
</script>