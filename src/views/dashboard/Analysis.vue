<template>
  <div>
    <!-- <div style="width: 100%;text-align: left;margin-top: 10px">
      <a-radio-group v-model="indexStyle">
        <a-radio :value="1">销售统计</a-radio>
        <a-radio :value="3">业务提醒</a-radio>
      </a-radio-group>
    </div>
    <div style="width: 100%;text-align: left;margin-top: 10px">
    </div>
    <index-chart v-if="indexStyle==1"></index-chart>
    <index-task v-if="indexStyle==3"></index-task> -->

  </div>
</template>

<script>
  // import IndexChart from './IndexChart'
  // import IndexTask from "./IndexTask"

  export default {
    name: "Analysis",
    components: {
      // IndexChart,
      // IndexTask,
    },
    data() {
      return {
        indexStyle:1
      }
    },
    created() {

    },
    methods: {

    }
  }
</script>