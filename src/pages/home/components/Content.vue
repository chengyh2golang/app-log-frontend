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
    import axios from 'axios'
    export default {
        name: "HomeContent",
        data () {
            return {
                refreshLog: false,
                logList: [],
                allEnvInfo: [],
                envSelected: '',
                nsSelected: '',
                appSelected: '',
                podSelected: ''
            }
        },
        computed: {
            //只有当logList有数据才显示日志内容
            showLog () {
                return this.logList.length
            },
            //只有当refreshLog为真，才显示"日志刷新已关闭"
            //否则显示"日志刷新已打开"
            showLogRefresh () {
                return !this.refreshLog
            },
            envs () {
                const envs = [];
                for (let i = 0,len = this.allEnvInfo.length; i < len; i++) {
                    for (let key  in this.allEnvInfo[i]) {
                        envs.push(key)
                    }
                }
                return envs
            },
            fetchNsByEnv () {
                //根据envSelected的值来计算出namespace的数组
                const NsInfoByEnv = [];
                for (let i = 0,len = this.allEnvInfo.length; i < len; i++) {
                    //this.allEnvInfo[i]是一个对象
                    //它的值类似于：{"13": [{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}]}
                    let envObj = this.allEnvInfo[i];
                    for (let envKey  in envObj) {
                        if ( envKey === this.envSelected) {
                            //envObj[envKey]是一个数组，数组里的成员是对象，对象的key是namespace的名字
                            //数组类似于：[{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}]
                            //循环这个数组，拿到数组中的对象：{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}
                            for (let j = 0,len = (envObj[envKey]).length; j < len; j++) {
                                //循环这个对象，拿到对象的key，就是我们需要的namespace的值
                                for (let nsKey  in envObj[envKey][j]) {
                                    NsInfoByEnv.push(nsKey)
                                }
                            }
                        }
                    }
                }
                return NsInfoByEnv
            },
            fetchAppByNsAndEnv () {
                const fetchAppByNsAndEnv = [];
                //根据envSelected的值和namespace的值来计算出应用的数组
                for (let i = 0,len = this.allEnvInfo.length; i < len; i++) {
                    //this.allEnvInfo[i]是一个对象
                    //它的值类似于：{"13": [{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}]}
                    let envObj = this.allEnvInfo[i];
                    for (let envKey  in envObj) {
                        if ( envKey === this.envSelected) {
                            //envObj[envKey]是一个数组，数组里的成员是对象，对象的key是namespace的名字
                            //数组类似于：[{"13-ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}]
                            //循环这个数组，拿到数组中的对象：{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}
                            for (let j = 0,len = (envObj[envKey]).length; j < len; j++) {
                                let nsObj = envObj[envKey][j];
                                //循环这个对象，拿到对象的key，就是我们需要比较的namespace的值
                                for (let nsKey  in nsObj) {
                                    if  (nsKey === this.nsSelected) {
                                        //找这个namespace下的所有应用
                                        //nsObj[nsKey]就是这个ns下的应用的数组
                                        //循环这个数组，会得到{"13-ns1-app01": ["13-ns1-app01-pod01"]}对象
                                        for (let k = 0,len = (nsObj[nsKey]).length; k < len; k++) {
                                            for (let appKey  in nsObj[nsKey][k]) {
                                                fetchAppByNsAndEnv.push(appKey)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return fetchAppByNsAndEnv
            },
            fetchPodByAppandNsAndEnv () {
                const fetchPodByAppandNsAndEnv = [];
                //根据envSelected的值和namespace的值及app的值来计算出pod的数组
                for (let i = 0,len = this.allEnvInfo.length; i < len; i++) {
                    //this.allEnvInfo[i]是一个对象
                    //它的值类似于：{"13": [{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}]}
                    let envObj = this.allEnvInfo[i];
                    for (let envKey  in envObj) {
                        if ( envKey === this.envSelected) {
                            //envObj[envKey]是一个数组，数组里的成员是对象，对象的key是namespace的名字
                            //数组类似于：[{"13-ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}]
                            //循环这个数组，拿到数组中的对象：{"ns1": [{"13-ns1-app01": ["13-ns1-app01-pod01"]}]}
                            for (let j = 0,len = (envObj[envKey]).length; j < len; j++) {
                                let nsObj = envObj[envKey][j];
                                //循环这个对象，拿到对象的key，就是我们需要比较的namespace的值
                                for (let nsKey  in nsObj) {
                                    if  (nsKey === this.nsSelected) {
                                        //找这个namespace下的所有应用
                                        //nsObj[nsKey]就是这个ns下的应用的数组
                                        //循环这个数组，会得到{"13-ns1-app01": ["13-ns1-app01-pod01"]}对象
                                        for (let k = 0,len = (nsObj[nsKey]).length; k < len; k++) {
                                            let appObj = nsObj[nsKey][k];
                                            for (let appKey  in appObj) {
                                                if (appKey === this.appSelected) {
                                                    //去循环["13-ns1-app01-pod01"]这个数组
                                                    for (let m = 0,len = (appObj[appKey]).length; m < len; m++) {
                                                        fetchPodByAppandNsAndEnv.push(appObj[appKey][m])
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                return fetchPodByAppandNsAndEnv
            }
        },
        methods: {
            //当点击日志刷新按钮时，做取反操作
            handleClickRefresh () {
                this.refreshLog = !this.refreshLog;
            },
            //发送ajax请求，获取环境信息
            getEnvsInfo () {
                axios.get('/api/envs').then(this.getEnvsSuccess);
            },
            //ajax返回的是一个promise对象，这是回调函数
            getEnvsSuccess (res) {
                res = res.data;
                if (res.ret && res.all_env_info) {
                    this.allEnvInfo = res.all_env_info
                }
            },
            handleLogQuery () {
                if (this.podSelected) {
                    axios.get('/api/log').then(this.getLogSuccess);
                } else {
                    alert("请选择pod")
                }

            },
            getLogSuccess (res) {
                res = res.data;
                if (res.ret && res.log) {
                    this.logList = res.log
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
