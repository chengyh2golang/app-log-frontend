<template>
  <div>
    <common-header :titleInfo="titleInfo"></common-header>
    <pod-content></pod-content>
  </div>
</template>

<script>
  import CommonHeader from '../common/Header'
  import PodContent from './components/Content'

    export default {
        name: "PodOffline",
        components: {
            CommonHeader,
            // HomeHeader,
            PodContent,
        },
        data () {
            return {
                titleInfo: "离线应用日志查询系统"
            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>
