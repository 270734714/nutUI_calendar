<template>
  <div class="hello">
    <xcalendar
      :is-visible="isVisible"
      title="请选择日期时间"
      type="datetime"
      startDate="2000-11-10 12:08"
      endDate="2030-10-05 10:04"
      defaultValue="2021-06-20 11:08"
      defaultValueE="2024-05-11 13:28"
      @choose="setChooseValue"
    >
    </xcalendar>
  </div>
</template>
<script>
  import xcalendar from './xuleicalendar/datepicker'
  export default {
    name: 'HelloWorld',
    components: {xcalendar},
    data () {
      return {
        isVisible: true,
      }
    },
    methods: {
      setChooseValue(param) {
          alert(param)
      },
    }
  }
</script>
<style scoped>
</style>
