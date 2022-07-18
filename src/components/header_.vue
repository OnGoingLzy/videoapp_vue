<template>
  <div :key="key" class="header">
    <van-row>
      <van-col span="12" style="height: 100%">
        <van-search v-model="search"
                    placeholder="请输入搜索关键词"
                    @search="onSearch"
                    input-align="center"
        />
      </van-col>
      <van-col span="4" class="icondiv" v-if="cid === '0'">
        <div class="child" />
        <van-icon name="user-circle-o" size="34" @click="iconClick" />
      </van-col>
      <van-col span="4" class="icondiv" v-if="cid !== '0'">
        <van-image
            round
            width="34"
            height="34"
            :src='"http://localhost:9000/avatar/"+cAvatar'
            @click="toPersonalSpace"
            style="border: 1px solid darkgrey"
        />
      </van-col>
      <van-col span="4" class="icondiv">
        <van-badge :content="0" max="99">
          <div class="child" />
          <van-icon name="envelop-o" size="34"/>
        </van-badge>
      </van-col>
<!--     退出登录 logout-->
      <van-col span="4" class="icondiv" v-if="cid !== '0'">
          <div class="child" />
          <van-icon name="close" size="34" @click="logout"/>
      </van-col>

    </van-row>
  </div>
</template>

<script>
import router from "@/router";
import {List, Notify, Toast} from "vant";

export default {
  inject: ['reload','footerReload'],
  name: "header_",
  data(){
    return{
      search: '',
      cid: '0',
      cAvatar: 'default.png',
      key: 0,
    }
  },
  methods: {
    iconClick(){
      router.push('login')
    },
    logout(){
      this.$dialog.confirm({
        title:'退出登录',
        message:'确定退出当前账号吗？'
      })
      .then(()=>{
        console.log("正在退出")
        sessionStorage.clear()
        this.$store.commit('deleteAllData')
        this.reload()
        //his.$router.push('loading')
        this.$router.push('/')
      })
      .catch(()=>{

      })
    },
    toPersonalSpace() {
      sessionStorage.setItem("active",'3')
      this.footerReload()
      this.$emit('visibleEvent',false) //点击后传递false给app.vue隐藏header
      this.$router.push('/personalSpace')
    },
    refresh(){
      this.key = 1
      this.$nextTick(function(){
        this.headerkey = 0
      })
    },
    async onSearch(){
      if(this.search===''){
        Notify({ type: 'warning', message: '请输入搜索关键词',duration: 1000 });
        return
      }
      const {data:res} = (await this.$http.post("searchContent", this.search))
      sessionStorage.setItem("searchContent",this.search)
      sessionStorage.setItem("searchSql",res)
      console.log("搜索内容:" + res);
      this.reload()  //搜索后刷新页面
      Notify({ type: 'success', message: '搜索成功',duration: 1000 });
    },



  },//挂载
  mounted() {
    console.log("挂载.....")
    this.cid = sessionStorage.getItem('cid')

    //获取消息和头像等
    console.log("header里的avatar1:" + this.cAvatar)
    if (sessionStorage.getItem('cid') !== null) {
      this.$http.post("getMsgImg", sessionStorage.getItem('cid')).then(res => {
        this.cAvatar = res.data.avatarName
      })
      // this.$http.post("getMsgImg", this.desjs.decryptDes(sessionStorage.getItem('cid'))).then(res => {
      //   this.cAvatar = res.data.avatarName
      // })
    }else this.cid = '0'
  }
}
</script>

<style lang="less" scoped>
  .icondiv{
    padding: 12px;
  }
  .header{
    background-color: #fcfcfc;
  }

</style>
