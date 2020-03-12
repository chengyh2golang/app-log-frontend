<template>
  <div class="container">
    <div class="sidebar">
      <div class="search">
        <input class="search-input" v-model="keyword" placeholder="输入日志关键字">
        <button class="btn" @click="handleQueryClick">查询</button>
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
    import axios from 'axios'
    export default {
        name: "HomeContent",
        data () {
            return {
                keyword: ""
            }
        },
        methods: {
            handleQueryClick () {
                if (!this.keyword) {
                    alert("请输入用于查询日志的关键字")
                } else {
                    console.log(this.keyword)
                    // let queryUrl = '/api/querycontent?keyword="' + this.keyword + '"';
                    let queryUrl = '/api/querycontent?keyword=' + this.keyword;
                    console.log(queryUrl)
                    axios.get(queryUrl).then(
                        this.getQuerySuccess
                    )
                }
            },
            getQuerySuccess (res) {
                res = res.data;
                if (res.ret && res.env_content_query_result) {
                    console.log(res)
                }

            }
        }
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
