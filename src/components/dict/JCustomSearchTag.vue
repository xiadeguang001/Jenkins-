<template>

  <a-select
    :placeholder="placeholder"
    style="width: 100%"
    @change="handleChange"
    :value="value"
    >
    <a-select-option v-for="d in options" :key="d.value" :value="d.value">{{ d.text }}</a-select-option>
  </a-select>

</template>

<script>
  import debounce from 'lodash/debounce';
  import { getAction } from '../../api/manage'

  export default {
    name: 'JSearchSelectTag',
    props:{
      url: String,
      method: String,
      valueName:String,
      textName:String,
      value: String,

      disabled: Boolean,
      params: Object,
      value: String,
      placeholder:{
        type:String,
        default:"请选择",
        required:false
      }
    },
    data(){
      this.loadData = debounce(this.loadData, 800);//消抖
      this.lastLoad = 0;
      return {
        loading:false,
        selectedValue:[],
        options: [],
      }
    },
    created(){
    },
    watch:{
      "url":{
        immediate:true,
        handler(){
          this.loadData();
        }
      }
    },
    methods:{
      initSelectValue(){
        this.selectedValue = this.value
      },
      loadData(){
        let that = this;
        this.lastLoad +=1
        const currentLoad = this.lastLoad
        this.options = []
        this.loading=true

        let request = null;
        if (this.method === "post"){
          request = postAction(this.url,this.params);
        } else {
          request = getAction(this.url,this.params);
        }
        request.then((res) => {
          if (res.success) {
            res.result.forEach(ele => {
              ele.value = ele[this.valueName].toString();
              ele.text = ele[this.textName];
              that.options.push(ele);
            });
          }
        }).finally(() => {
          that.loading = false;
        });

      },
      handleChange (selectedValue) {
        this.$emit('change', selectedValue);
      },
    },
    model: {
      prop: 'value',
      event: 'change'
    }
  }
</script>

<style scoped>

</style>