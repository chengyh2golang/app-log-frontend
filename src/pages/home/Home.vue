<template>
  <div>
    <common-header :titleInfo="titleInfo"></common-header>
    <home-content></home-content>
  </div>
</template>

<script>
  import CommonHeader from '../common/Header'
  import HomeContent from './components/Content'

    export default {
        name: "Home",
        components: {
            CommonHeader,
            HomeContent,
        },
        data () {
            return {
                titleInfo: "容器平台应用日志查询系统"
            }
        }
    }
</script>

<style lang="stylus" scoped>

</style>
