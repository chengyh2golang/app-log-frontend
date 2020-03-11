<template>
  <div>
    <common-header></common-header>
    <pod-content></pod-content>
  </div>
</template>

<script>
  import CommonHeader from '../common/Header'
  import PodContent from './components/Content'

    export default {
        name: "Pod",
        components: {
            CommonHeader,
            // HomeHeader,
            PodContent,
        },
    }
</script>

<style lang="stylus" scoped>

</style>
