<template>
  <div class="main">
    <div class="sidebar-left">
      <ul>
        <li>
          <p>环境</p>
          <select v-model="envSelected">
            <option v-for="item of envs" :key="item" :value="item">{{item}}</option>
          </select>
        </li>
        <li>
          <p>项目</p>
          <select v-model="nsSelected">
            <option v-for="item of fetchNsByEnv" :key="item" :value="item">{{item}}</option>
          </select>
        </li>
        <li>
          <p>应用</p>
          <select v-model="appSelected">
            <option v-for="item of fetchAppByNsAndEnv" :key="item"
                    :value="item">{{item}}
            </option>
          </select>
        </li>
        <li>
          <p>pod</p>
          <select v-model="podSelected">
            <option v-for="item of fetchPodByAppandNsAndEnv" :key="item"
                    :value="item">{{item}}
            </option>
          </select>
        </li>
        <li>
          <button class="btn" @click="handleLogQuery">查询日志</button>
        </li>
      </ul>
    </div>
    <div class="log-content" v-if="showLog">
      <ul>
        <li v-for="item of logList" :key="item.id">{{item.message}}</li>
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
    import axios from 'axios'
    export default {
        name: "HomeContent",
        data () {
            return {
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
                    let url = '/api/querylog?env=' + this.envSelected +
                      '&namespace=' + this.nsSelected + '&pod_name=' + this.podSelected;
                    axios.get(url).then(this.getLogSuccess);
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
      width 60%
      overflow hidden
      font-size .4rem
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
