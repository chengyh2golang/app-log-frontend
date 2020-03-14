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
    <div class="search-result" v-if="show">
      <div v-if="haveContent">
        <div class="search-result-env" v-for="env of envArr"  :key="env">
          <div class="search-result-env-ns" v-for="ns of fetchNsbyEnv(env)" :key="ns">
            <div v-for="deploy of fetchDeployByNsAndEnv(env,ns)" :key="deploy">
              <ul v-for="podName of fetchPodNameByDeployAndNsAndEnv(env,ns,deploy)"
                  :key="podName">
                <li class="title">项目: {{ns}}, 应用: {{deploy}}, pod: {{podName}}</li>
                <li v-for="item of fetchMsgByPodNameAndDeployAndNsAndEnv(env,ns,deploy,podName)"
                    :key="item.id">
                  {{item.message}}
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
      <div v-else>没有查找到匹配的内容！</div>
    </div>
  </div>

</template>

<script>
    import axios from 'axios'
    export default {
        name: "HomeContent",
        data () {
            return {
                keyword: "",
                queryResultMap: Object,
                envArr: [],
                show: false,
                isExecQuery: false,
                timer: null
            }
        },
        computed: {
            haveContent () {
                return this.queryResultMap
            },


        },
        methods: {
            handleQueryClick () {
                if (!this.keyword) {
                    alert("请输入用于查询日志的关键字")
                } else {
                    this.isExecQuery = true;
                    if (this.queryResultMap) {
                        this.queryResultMap = null;
                        this.envArr = [];
                    }
                    if (this.isExecQuery) {
                        clearTimeout(this.timer)
                    }
                    this.timer = setTimeout( () => {
                        this.show = true;
                        let queryUrl = '/api/querycontent?keyword=' + this.keyword;
                        axios.get(queryUrl).then(this.getQuerySuccess);
                        this.isExecQuery = false;
                    },500);
                }
            },
            getQuerySuccess (res) {

                res = res.data;
                if (res.ret && res.env_content_query_result) {
                    this.queryResultMap = res.env_content_query_result;
                    for (let envKey in this.queryResultMap) {
                        this.envArr.push(envKey)
                    }
                }

            },
            fetchNsbyEnv(env) {
                let nsList = [];
                let queryResultArr = this.queryResultMap[env];
                for (let i = 0,len = queryResultArr.length; i < len; i++ ){
                    if (nsList.indexOf(queryResultArr[i]['namespace']) === -1) {
                        nsList.push(queryResultArr[i]['namespace'])
                    }
                }
                return nsList
            },
            fetchDeployByNsAndEnv(env,ns) {
                let deployList = [];
                let queryResultArr = this.queryResultMap[env];
                for (let i = 0,len = queryResultArr.length; i < len; i++ ){
                    if (queryResultArr[i]['namespace'] === ns) {
                        if (deployList.indexOf(queryResultArr[i]["deploy_name"]) === -1) {
                            deployList.push(queryResultArr[i]["deploy_name"])
                        }
                    }
                }
                return deployList
            },
            fetchPodNameByDeployAndNsAndEnv(env,ns,deploy) {
                let podNameList = [];
                let queryResultArr = this.queryResultMap[env];
                for (let i = 0,len = queryResultArr.length; i < len; i++ ){
                    if (queryResultArr[i]['namespace'] === ns &&
                        queryResultArr[i]["deploy_name"] === deploy)
                    {
                        if (podNameList.indexOf(queryResultArr[i]["pod_name"]) === -1) {
                            podNameList.push(queryResultArr[i]["pod_name"])
                        }
                    }
                }
                return podNameList
            },
            fetchMsgByPodNameAndDeployAndNsAndEnv(env,ns,deploy,podName) {
                let MsgList = [];
                let queryResultArr = this.queryResultMap[env];
                for (let i = 0,len = queryResultArr.length; i < len; i++ ){
                    let MsgObj = {};
                    if (queryResultArr[i]['namespace'] === ns &&
                        queryResultArr[i]["deploy_name"] === deploy &&
                        queryResultArr[i]["pod_name"] === podName)
                    {
                        MsgObj["message"] = queryResultArr[i]["message"];
                        MsgObj["id"] = queryResultArr[i]["id"];
                        MsgList.push(MsgObj)
                    }
                }
                return MsgList
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
        background #25a4bb
    .search-result
      border 2px solid #eee
      float left
      width 70%
      margin-top .2rem
      margin-left .2rem
      font-size .32rem
      li {
        padding .05rem
        border-bottom 1px solid #ccc
      }
      .title
        background #ccc
</style>
