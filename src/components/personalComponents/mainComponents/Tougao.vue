<template>
  <div :key="key">
    <van-steps :active="active" active-color="#8470FF">
      <van-step>视频上传</van-step>
      <van-step>信息编辑</van-step>
      <van-step>成功</van-step>
    </van-steps>
    <keep-alive :key="key+1">
      <router-view></router-view>
    </keep-alive>


  </div>
</template>

<script>
export default {
  inject:['setVisible'],
  name: "mainTougao",
  provide(){
    return{
      toNext: this.toNext,
      toPrevious: this.toPrevious,
      toSuccess: this.toSuccess,
      tougaoReload: this.tougaoReload,
    }
  },
  data(){
    return{
      active: 0,
      key: 33,
    }
  },
  methods: {
    toNext(){
      this.active = 1
      this.$router.push('videoSetMsg')
    },
    toPrevious(){
      this.active = 0
      this.$router.push('videoUpload')
    },
    toSuccess(){
      this.active = 2
    },
    tougaoReload(){
      this.key = 1
      this.active=0
      this.$nextTick(function(){
        this.key = 0
      })
    }
  },
  async mounted() {
    this.setVisible(false)
    await this.$http.post('getPreUploadMsg', String(sessionStorage.getItem('cid'))).then(res=>{
      console.log("正在投稿的视频"+res)
      if(res.data!==''){
        sessionStorage.setItem("uploadState",'true')
        this.active = 1
        this.$router.push("videoSetMsg")
      }else {
        sessionStorage.setItem("uploadState",'false')
        this.$router.push("videoUpload")
      }
    })


  }
}
</script>

<style scoped>

</style>
