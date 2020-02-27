<template>
  <div class="main">
    <div class="sidebar-left">
      <ul>
        <li>
          <p>环境</p>
          <select>
            <option>环境1</option>
            <option>环境2</option>
          </select>
        </li>
        <li>
          <p>项目</p>
          <select>
            <option>项目1</option>
            <option>项目2</option>
          </select>
        </li>
        <li>
          <p>应用</p>
          <select>
            <option>应用1</option>
            <option>应用2</option>
          </select>
        </li>
        <li>
          <p>pod</p>
          <select>
            <option>pod1</option>
            <option>pod2</option>
            <option>pod1</option>
            <option>pod2</option>
            <option>pod1</option>
            <option>pod2</option>
            <option>pod1</option>
            <option>pod3</option>
          </select>
        </li>
        <li>
          <button class="btn">提交</button>
        </li>
      </ul>
    </div>
    <div class="log-content" v-if="showLog">
      <ul>
        <li v-for="(item,index) of logList" :key="index">{{item}}</li>
      </ul>

    </div>
    <div class="sidebar-right">
      <div v-if="showLog">
        <button class="refresh-log-switch" @click="handleClickRefresh" v-if="showLogRefresh">日志刷新已关闭</button>
        <button class="refresh-log-switch" @click="handleClickRefresh" v-else>日志刷新已开启</button>
      </div>
    </div>
  </div>

</template>

<script>
    export default {
        name: "HomeContent",
        data () {
            return {
                refreshLog: false,
                logList: [
                    '[2020-01-27 13:36:30,659] INFO   [o.a.coyote.http11.Http11NioProtocol:173] - Initializing ProtocolHandler ["http-nio-0.0.0.0-8040"]',
                    '[2020-01-27 13:36:30,693] INFO   [o.a.catalina.core.StandardService:173] - Starting service [Tomcat]',
                    '[2020-01-27 13:36:30,696] INFO   [o.a.catalina.core.StandardEngine:173] - Starting Servlet engine: [Apache Tomcat/9.0.16]',
                    '[2020-01-27 13:36:30,706] INFO   [o.a.c.core.AprLifecycleListener:173] - The APR based Apache Tomcat Native library which allows optimal performance in production environments was not found on the java.library.path: [lib]'
                ]
            }
        },
        methods: {
            handleClickRefresh () {
                this.refreshLog = !this.refreshLog;
            }
        },
        computed: {
            showLog () {
                return this.logList.length
            },
            showLogRefresh () {
                return !this.refreshLog
            }
        }
    }
</script>

<style lang="stylus" scoped>
  .main
    overflow hidden
    margin-top .2rem
    .sidebar-left
      overflow hidden
      position relative
      float left
      text-align center
      min-width: 4rem;
      padding-bottom .4rem
      border 2px solid #eee
      font-family '微软雅黑'
      font-size 20px
      .btn {
        padding .05rem
        background orange
        border-radius .2rem
      }
      .btn:hover {
        color #fff
      }
      li {
        margin-top .4rem;
        padding .1rem 0
      }
      p {
        padding-bottom .1rem
      }
      select {
        background #ccc
      }

    .log-content
      border 2px solid #eee
      float left
      margin-left .1rem
      width 70%
      overflow hidden
      li {
        padding .05rem
        border-bottom 1px solid #ccc
      }
    .sidebar-right
      float left
      margin-left .1rem
      width 200px;
      height 200px;
      font-size 20px
      .refresh-log-switch
        border-radius .1rem
        background orange
      .refresh-log-switch:hover {
        color #fff
      }
</style>
