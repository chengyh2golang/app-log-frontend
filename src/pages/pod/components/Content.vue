<template>
  <div class="main">
    <div class="sidebar-left">
      <ul>
        <li>
          <p>环境</p>
          <select v-model="envSelected">
            <option disabled value="">请选择</option>
            <option v-for="item of envs" :key="item" :value="item">{{item}}</option>
          </select>
        </li>
        <li>
          <p>项目</p>
          <select v-model="nsSelected">
            <option disabled value="">请选择</option>
            <option v-for="item of fetchNsByEnv" :key="item" :value="item">{{item}}</option>
          </select>
        </li>
        <li>
          <p>应用</p>
          <select v-model="appSelected">
            <option disabled value="">请选择</option>
            <option v-for="item of fetchAppByNsAndEnv" :key="item"
                    :value="item">{{item}}
            </option>
          </select>
        </li>
        <li>
          <p>pod</p>
          <select v-model="podSelected">
            <option disabled value="">请选择</option>
            <option v-for="item of fetchPodByAppandNsAndEnv" :key="item"
                    :value="item">{{item}}
            </option>
          </select>
        </li>
        <li>
          <button class="btn " @click="handleLogQuery">开始查询</button>
        </li>
        <li>
          <router-link to="/">
            <button class="btn link-to-home">回到主页</button>
          </router-link>
        </li>
      </ul>

    </div>
    <div class="no-log-content" v-if="errored">查询出现了错误！</div>
    <div class="log-content" v-else>
      <div v-if="isExecQuery">正在执行查询...</div>
      <ul>
        <li  v-for="item of logList" :key="item.id">{{item.message}}</li>
      </ul>
      <div class="" v-if="haveNoContent">没有查到pod的日志信息，请稍后再试！</div>
    </div>
    <div style="display: none" class="sidebar-right">
      <div v-if="showLog">
        <button class="refresh-log-switch" @click="handleClickRefresh" v-if="showLogRefresh">日志刷新已关闭</button>
        <button class="refresh-log-switch" @click="handleClickRefresh" v-else>日志刷新已开启</button>
      </div>
    </div>


  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "PodContent",
        data () {
            return {
                errored: false,
                isExecQuery: false,
                isQueryFinished: false,
                timer: null,
                refreshLog: false,
                logList: [],
                envClusterInfo: Object,
                envSelected: 'env6',
                nsSelected: '',
                appSelected: '',
                podSelected: '',
                envs: []
            }
        },
        computed: {
            //只有当logList有数据才显示日志内容
            showLog () {
                return  this.logList.length
            },
            //只有当refreshLog为真，才显示"日志刷新已关闭"
            //否则显示"日志刷新已打开"
            showLogRefresh () {
                return !this.refreshLog
            },
            haveNoContent () {
                return this.isQueryFinished && !this.logList.length;
            },
            fetchNsByEnv () {
                const nsList = [];
                if (this.envSelected && this.envClusterInfo[this.envSelected]) {
                    const clusterInfo = this.envClusterInfo[this.envSelected];
                    for (let i = 0,len = clusterInfo.length; i < len; i++) {
                        if (nsList.indexOf(clusterInfo[i]['namespace']) === -1) {
                            nsList.push(clusterInfo[i]['namespace'])
                        }
                    }
                }
                return nsList
            },
            fetchAppByNsAndEnv () {
                const deployList = [];
                if (this.envSelected && this.nsSelected ) {
                    const clusterInfo = this.envClusterInfo[this.envSelected];
                    for (let i = 0,len = clusterInfo.length; i < len; i++) {
                        if (clusterInfo[i]['namespace'] === this.nsSelected) {
                            if (deployList.indexOf(clusterInfo[i]['deploy']) === -1) {
                                deployList.push(clusterInfo[i]['deploy'])
                            }
                        }
                    }
                }

                return deployList
            },
            fetchPodByAppandNsAndEnv () {
                const podList = [];
                if ( this.envSelected && this.nsSelected && this.appSelected ) {
                    const clusterInfo = this.envClusterInfo[this.envSelected];
                    for (let i = 0,len = clusterInfo.length; i < len; i++) {
                        if (clusterInfo[i]['namespace'] === this.nsSelected &&
                            clusterInfo[i]['deploy'] === this.appSelected
                        ) {
                            if (podList.indexOf(clusterInfo[i]['pod_name']) === -1) {
                                podList.push(clusterInfo[i]['pod_name'])
                            }
                        }
                    }
                }

                return podList
            }
        },
        methods: {
            //当点击日志刷新按钮时，做取反操作
            handleClickRefresh () {
                this.refreshLog = !this.refreshLog;
            },
            //发送ajax请求，获取环境信息
            getEnvsInfo () {
                axios.get('/api/clusterinfo').then(this.getEnvsSuccess)
                    .catch( error => {alert("调用/api/clusterinfo获取集群信息出错！")});
            },
            //ajax返回的是一个promise对象，这是回调函数
            getEnvsSuccess (res) {
                res = res.data;
                if (res.ret && res.env ) {
                    this.envs = res.env;
                    if (res.env_cluster_info) {
                        this.envClusterInfo = res.env_cluster_info
                    }
                }
            },
            handleLogQuery () {
                if (this.podSelected) {
                    //当点击查询之后，把之前的错误状态：errored先重新置为false
                    //由promise的执行结果来重新修改该变量，如果api调用失败，则改为true
                    this.errored = false;
                    //在执行被调用完成之前，设置为false，查询执行完成之后才改写为true
                    //isQueryFinished这个变量是为了计算出haveNoContent的结果而服务的
                    //如果isQueryFinished为true，且logList没有查到返回值，才显示haveNoContent这个div的信息
                    //即在前台展示：“没有查到匹配的内容”
                    this.isQueryFinished = false;
                    this.isExecQuery = true; //这是为了实现函数节流，通过定义sExecQuery和timer来实现
                    if (this.logList) { //在执行查询之前，先判断上一次查询的logList是否为空，如果不为空，清除掉
                        this.logList = []
                    }
                    if (this.isExecQuery) {  //如果已经正在执行query，通过节流来限制函数执行的频率
                        clearTimeout(this.timer) //如果在500毫秒的时间范围内，又做了一次query的操作，就把上次的query给清除掉
                    }
                    this.timer = setTimeout( () => {
                        //拼接出ajax调用的url，使用的时候在URL中通过？携带params的方式给后端api传参数
                        //后端通过r.URL.Query().Get("env")来解析url参数
                        let url = '/api/querylog?env=' + this.envSelected +
                            '&namespace=' + this.nsSelected + '&pod_name=' + this.podSelected;
                        //axios调用，返回的是一个promise，所以调用then方法来执行回调
                        //通过配置catch和finally来控制报错和状态更新
                        axios.get(url).then(this.getLogSuccess)
                            .catch( error => {this.errored = true})
                            .finally( () => {
                                this.isExecQuery = false; //执行完成之后，把正在执行isExecQuery设置为false
                                this.isQueryFinished = true} //执行完成后，把isQueryFinished设置为true
                                );
                    },500);
                } else {
                    alert("请选择pod")
                }
            },
            getLogSuccess (res) {
                res = res.data;
                if (res) {
                    this.logList = res

                }
            }
        },
        mounted() {
            //生命周期函数，用以发起ajax请求
            this.getEnvsInfo();
        }
    }
</script>

<style lang="stylus" scoped>
  .main
    .sidebar-left
      overflow hidden
      position relative
      text-align center
      padding-bottom .2rem
      border-bottom  2px solid #eee
      font-family '微软雅黑'
      font-size 20px
      .btn {
        padding .05rem
        background orange
        border-radius .2rem
        margin-top .3rem
      }
      .btn:hover {
        color #fff
      }
      .link-to-home
        background #25a4bb
      li {
        float left
        margin-left 20px
        margin-top .1rem;
        padding .1rem 0
      }
      p {
        padding-bottom .1rem
      }
      select {
        background #ccc
      }

    .no-log-content
      border 2px solid #eee
      margin-left .1rem
      width 60%
      font-size .4rem
    .log-content
      /*border 2px solid #eee*/
      width 1200px
      margin: 0 auto
      overflow hidden
      font-size .4rem
      /*white-space normal
      word-wrap break-word
      word-break break-all*/
      li {
        padding .05rem
        border-bottom  1px solid #ccc
        border-left  1px solid #ccc
        border-right  1px solid #ccc
      }
    .sidebar-right
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
