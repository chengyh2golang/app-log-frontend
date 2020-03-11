<template>
  <div class="container">
    <div class="sidebar">
      <div class="search">
        <input class="search-input" placeholder="输入要查询的日志关键字">
        <button class="btn">查询</button>
      </div>
      <router-link to="/pod">
        <button class="link-to-pod btn">转到pod日志查询页面</button>
      </router-link>

    </div>
    <div class="search-content">
      <ul>
        <li >日志内容</li>
        <li >日志内容</li>
      </ul>
    </div>
  </div>

</template>

<script>
    export default {
        name: "HomeContent",
    }
</script>

<style lang="stylus" scoped>
  .btn
    background orange
    font-size .4rem
  .btn:hover
    color #fff
  .container
    height 200px
    .sidebar
      min-width 5rem
      float left
      margin-top .2rem
      margin-left 1rem
      .search
        .search-input
          padding .1rem
          border 2px solid #bbb
        .btn
          border-radius .1rem
          padding .05rem
      .link-to-pod
        margin-top .6rem
        border-radius .2rem
        padding .05rem
    .search-content
      border 2px solid #eee
      float left
      width 60%
      margin-top .2rem
      margin-left .2rem
      font-size .4rem
      li {
        padding .05rem
        border-bottom 1px solid #ccc
      }
</style>
