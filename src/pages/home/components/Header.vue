<template>
    <div class="header">
      <div class="logo">
        <img class="img" src="../../../assets/logo.png"  />
      </div>
      <div class="app-name">
        <p>网贷平台应用日志检索系统</p>
      </div>
    </div>
</template>

<script>
    export default {
        name: "HomeHeader"
    }
</script>

<style lang="stylus" scoped>
  .header
    overflow hidden
    background #bbb
    padding .2rem
    .logo
      float left
      .img
        width 2.57rem
        height 1rem
    .app-name
      float left
      margin-left 1rem
      height 1rem
      line-height: 1rem;
      font-size 20px
</style>
