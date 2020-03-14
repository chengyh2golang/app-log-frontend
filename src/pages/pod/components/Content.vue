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
          <button class="btn" @click="handleLogQuery">开始查询</button>
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
        <li v-for="item of logList" :key="item.id">{{item.message}}</li>
      </ul>
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
                timer: null,
                refreshLog: false,
                logList: [],
                envClusterInfo: Object,
                envSelected: '',
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
                axios.get('/api/clusterinfo').then(this.getEnvsSuccess);
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
                    this.errored = false;
                    this.isExecQuery = true; //这是为了实现函数节流，通过定义sExecQuery和timer来实现
                    if (this.logList) { //在执行查询之前，先判断上一次查询的logList是否为空，如果不为空，清除掉
                        this.logList = []
                    }
                    if (this.isExecQuery) {  //如果已经正在执行query，通过节流来限制函数执行的频率
                        clearTimeout(this.timer) //如果在500毫秒的时间范围内，又做了一次query的操作，就把上次的query给清除掉
                    }
                    this.timer = setTimeout( () => {
                        let url = '/api/querylog?env=' + this.envSelected +
                            '&namespace=' + this.nsSelected + '&pod_name=' + this.podSelected;
                        axios.get(url).then(this.getLogSuccess)
                            .catch( error => {this.errored = true})
                            .finally(() => this.isExecQuery = false);
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
    overflow hidden
    margin-top .2rem
    .sidebar-left
      overflow hidden
      position relative
      float left
      text-align center
      min-width: 5rem;
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
      .link-to-home
        background #25a4bb
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

    .no-log-content
      float left
      border 2px solid #eee
      margin-left .1rem
      width 60%
      font-size .4rem
    .log-content
      border 2px solid #eee
      float left
      margin-left .1rem
      width 70%
      overflow hidden
      font-size .32rem
      /*white-space normal
      word-wrap break-word
      word-break break-all*/
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
