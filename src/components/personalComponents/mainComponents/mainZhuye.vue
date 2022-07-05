<template>
  <div style="min-height: 500px">
    <div class="guidelines-box">
      <div style=""><span>视频 </span></div>
      <div style="margin-left: 70%" @click="toMyTougao">
        <span style="color: darkgrey">查看更多 </span>
        <van-icon name="arrow" color="#A9A9A9"/>
      </div>
    </div>

    <div class="all-video-box">
      <div class="video-box" v-for="(video,index) of videolist.slice(0,2)" :key="index" @click="toVideoFrame(video)" v-if="video.status===2" >
        <div style="background: #e0e0e0;border-top-left-radius: 8px;border-top-right-radius: 8px;">
          <van-image :src='"http://localhost:9000/videoCover/"+video.coverpath' width="100%" height="105px" fit="contain">
          </van-image>
        </div>

        <div class="van-ellipsis" style="width: 100%;text-align: left">
          <span class="video-box-p">{{video.videoname}}</span>
        </div>
      </div>
    </div>

    <div class="guidelines-box">
      <div style=""><span>收藏 </span></div>
      <div style="margin-left: 70%" @click="toMyShoucang">
        <span style="color: darkgrey">查看更多 </span>
        <van-icon name="arrow" color="#A9A9A9"/>
      </div>
    </div>
    <div class="all-folder-box">
      <div class="folder-box" v-for="(folder,index) of folderList.slice(0,2)" @click="toShoucangFrame(folder)">
        <van-image height="120px" width="100%" radius="5px" fit="cover" :src="require('../../../assets/folder.png')" >
        </van-image>
        <span>{{folder.ffoldername}}</span>
        <br>
        <span v-if="folder.limit===1" style="color: darkgrey">状态: 公开</span>
        <span v-if="folder.limit===2" style="color: darkgrey">状态: 私密</span>
      </div>

    </div>

    <shoucang-frame v-bind:foldername="foldername" v-bind:folderid="folderid" v-if="showShoucang"></shoucang-frame>
  </div>


</template>

<script>
import shoucangFrame from "@/components/personalComponents/mainComponents/shoucangFrame";

export default {
  name: "mainZhuye",
  inject:['changeBar'],
  provide(){
    return{
      back:this.shoucangBack
    }
  },
  data(){
    return{
      videolist:[],
      folderList:[],
      folderid:null,
      foldername:null,
      showShoucang: false,
    }
  },
  components:{
    shoucangFrame
  },
  methods:{
    toVideoFrame(video){
      this.selectVideo = video
      this.$router.push("/videoFrame")
      sessionStorage.setItem("selectVideoId",video.videoid)
    },
    toMyTougao(){
      this.$router.push('myTougao')
      sessionStorage.setItem('personalActive','1')
      this.changeBar(1)
    },
    toMyShoucang(){
      this.$router.push('shoucang')
      sessionStorage.setItem('personalActive','2')
      this.changeBar(2)
    },
    toShoucangFrame(folder){
      this.folderid = folder.ffolderid
      this.foldername = folder.ffoldername
      this.showShoucang = true
    },
    shoucangBack(showShoucang){
      this.showShoucang = showShoucang
    },
    async getFolder() {
      let cid = sessionStorage.getItem("cid")
      let formData = new FormData()
      formData.append("cid",cid)
      const {data:res} = await this.$http.post("getFolder",formData,{
        headers:{
          "Content-Type": "multipart/form-data"
        }
      })
      console.log(res)
      this.folderList = res
    },
  },
  async mounted() {
    await this.$http.post("getVideoWithAuthor",sessionStorage.getItem("cid")).then(res=>{
      this.videolist = res.data
    })
    await this.getFolder()
  }
}
</script>

<style lang="less" scoped>
  .guidelines-box{
    padding: 10px;
    display: flex;
    text-align: center;
    vertical-align: middle;
  }
  .all-video-box{
    text-align: center;
  }
  .all-folder-box{
    text-align: center;
  }
  .folder-box{
    width: 180px;
    height: 160px;
    margin: 7.5px;
    display: inline-block;

    .folder-box-span{

    }
  }
  .video-box {
    width: 180px;
    height: 160px;
    //border: 1px solid #8470FF;
    box-shadow: 0 1px 1px darkgrey;
    background-color: #fcfcfc;
    margin: 7.5px;
    border-radius: 8px;
    display: inline-block;
    .video-box-p {
      padding: 8px;
      margin-block-start: 2px;
      margin-block-end: 0;
    }
  }
</style>
