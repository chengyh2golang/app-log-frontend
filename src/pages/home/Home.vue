<template>
  <div>
    <home-header></home-header>
    <home-content></home-content>
  </div>
</template>

<script>
  import HomeHeader from './components/Header'
  import HomeContent from './components/Content'

    export default {
        name: "Home",
        components: {
            HomeHeader,
            HomeContent,
        },

    }
</script>

<style lang="stylus" scoped>

</style>
