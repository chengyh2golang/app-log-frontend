<template>
  <div class="block">
    <div class="demonstration">选择查询时间范围</div>
      <el-date-picker
        class="date-picker"
        v-model="value1"
        type="date"
        placeholder="选择开始时间"
        @change="pickTime"
        :picker-options="pickerOptions0">
      </el-date-picker>
      <el-date-picker
        class="date-picker"
        v-model="value2"
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
                value1: '',
                value2: ''
            }
        },
        methods: {
            pickTime () {
                if (this.value1 && this.value2) {
                    if (this.value2.valueOf() >= this.value1.valueOf()) {
                        this.$emit("pickStart",[this.value1,this.value2])
                    } else {
                        alert("开始时间不能晚于结束时间");
                        this.value1 = null;
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
