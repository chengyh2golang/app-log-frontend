<template>
  <div class="block">
    <div class="demonstration">选择查询时间范围</div>
      <el-date-picker
        class="date-picker"
        v-model="startTime"
        type="date"
        placeholder="选择开始时间"
        @change="pickTime"
        :picker-options="pickerOptions0">
      </el-date-picker>
      <el-date-picker
        class="date-picker"
        v-model="endTime"
        align="right"
        type="date"
        @change="pickTime"
        placeholder="选择结束时间"
        :picker-options="pickerOptions1">
      </el-date-picker>
  </div>
</template>

<script>
    export default {
        name: "Datepicker",
        data () {
            return {
                pickerOptions0: {
                    disabledDate (time) {
                        return time.getTime() > new Date()
                    }
                },
                pickerOptions1: {
                    disabledDate (time) {
                        return time.getTime() > Date.now()
                    }
                },
                startTime: "",
                endTime: ""
            }
        },
        methods: {
            pickTime () {
                if (this.startTime && this.endTime) {
                    if (this.endTime.valueOf() >= this.startTime.valueOf()) {
                        this.$emit("pickStart",[this.startTime,this.endTime])
                    } else {
                        alert("开始时间不能晚于结束时间，请重新选择");
                        this.startTime = null;
                        this.endTime = null;
                    }
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
  .demonstration
    padding-bottom .1rem
  .date-picker
    width 3rem

</style>
