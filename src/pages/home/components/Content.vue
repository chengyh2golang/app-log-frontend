<template>
  <div class="container">
    <div class="sidebar">
      <div class="search">
        <div class="search-input-wrapper">
          <input class="search-input" v-model="keyword"  @keyup.enter="handleQueryClick" placeholder="输入日志关键字">
        </div>
        <div class="date-picker-wrapper">
          <date-picker @pickStart="handlePickTime"></date-picker>
        </div>
        <div class="btn-wrapper">
          <button class="btn" @click="handleQueryClick">查询</button>
        </div>

      </div>
      <router-link to="/pod">
        <button class="link-to-pod btn">跳转到在线应用日志查询</button>
      </router-link>
      <div>
        <router-link to="/pod-offline">
          <button class="link-to-pod btn link-to-pod-offline">跳转到历史应用日志查询</button>
        </router-link>
      </div>




    </div>
    <div class="error-content" v-if="errored">查询出现了错误！</div>
    <div class="search-result" v-else>
      <div v-if="isExecQuery">正在执行查询...</div>
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
      <div v-if="haveNoCotent">没有查到匹配的内容！</div>
    </div>
  </div>

</template>

<script>
    import axios from 'axios'
    import DatePicker from '../../common/Datepicker'
    export default {
        name: "HomeContent",
        components: {
            DatePicker,
        },
        data () {
            return {
                errored: false,
                keyword: "",
                queryResultMap: Object,
                envArr: [],
                show: false,
                isExecQuery: false,
                timer: null,
                startTime: "",
                endTime: ""
            }
        },
        computed: {
            haveContent () {
                return this.queryResultMap
            },
            haveNoCotent () {
                return !this.isExecQuery && !this.haveContent;
            }

        },
        methods: {
            handleQueryClick () { //实现逻辑跟pod查询log的逻辑类似，详见pod查询的注释部分
                if (this.keyword && this.startTime && this.endTime) {
                    this.isExecQuery = true;
                    this.errored = false;
                    if (this.queryResultMap) {
                        this.queryResultMap = null;
                        this.envArr = [];
                    }
                    if (this.isExecQuery) {
                        clearTimeout(this.timer)
                    }
                    this.timer = setTimeout( () => {
                        this.show = true;
                        let queryUrl = '/api/querycontent?keyword=' + this.keyword + '&start_time=' +
                            this.startTime + '&end_time=' +this.endTime;
                        axios.get(queryUrl).then(this.getQuerySuccess)
                            .catch( error => {this.errored = true})
                            .finally(() => this.isExecQuery = false);
                    },500);
                } else {
                    alert("请输入查询关键字和查询日期")
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
            },
            handlePickTime (arr) {
                this.startTime = arr[0].valueOf();
                this.endTime = arr[1].valueOf();
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
      width 100%
      float left
      margin-top .2rem
      overflow hidden
      border-bottom 1px solid #ccc
      padding-bottom .2rem
      .search
        float left
        overflow hidden
        margin-left 1rem
        height 1.2rem
        width 12rem
        display flex
        justify-content: flex-start
        align-items flex-end
        .search-input-wrapper
          padding-right .2rem
          .search-input
            padding .1rem
            border 2px solid #bbb
        .date-picker-wrapper
          padding-right .2rem
          text-align center
        .btn
          border-radius .1rem
          padding .05rem
      .link-to-pod
        float left
        margin-left 1rem
        border-radius .2rem
        padding .05rem
        background lightblue
        margin-top .5rem
      .link-to-pod-offline
        background #ccc

    .error-content
      border 2px solid #eee
      float left
      width 70%
      margin-top .2rem
      margin-left 1rem
      font-size .32rem
      padding-top .2rem
    .search-result
      float left
      width 70%
      margin-bottom  .3rem
      margin-left 1rem
      font-size .32rem
      padding-top .2rem
      li {
        border-bottom  2px solid #eee
        word-wrap break-word
        border-left  2px solid #eee
        border-right  2px solid #eee
        padding .05rem
        border-bottom 1px solid #ccc
      }
      .title
        background #ccc
</style>
