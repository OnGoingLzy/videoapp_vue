<template>
  <div class="myTougao-div">
    <van-divider dashed :style="{borderColor: '#6c6c6c', padding: '0 16px' }">审核中</van-divider>
    <div class="all-video-box">

      <div class="video-box" v-for="(video,index) of videolist" :key="index" @click="toPreview(video)" v-if="video.status===1" >
        <div style="background: #e0e0e0;border-top-left-radius: 8px;border-top-right-radius: 8px;">
          <van-image :src='"http://localhost:9000/videoCover/"+video.coverpath' width="100%" height="105px" fit="contain">
          </van-image>
        </div>

        <div class="van-ellipsis" style="width: 100%;text-align: left">
          <span class="video-box-p">{{video.videoname}}</span>
        </div>

        <div class="van-ellipsis" style="width: 100%;text-align: left">
          <span class="video-box-p" style="color: darkgrey">审核中...</span>
        </div>
      </div>
    </div>

    <van-divider dashed :style="{borderColor: '#6c6c6c', padding: '0 16px' }">已投稿</van-divider>
    <div class="all-video-box">
      <div class="video-box" v-for="(video,index) of videolist" :key="index" @click="toVideoFrame(video)" v-if="video.status===2" >
        <div style="background: #e0e0e0;border-top-left-radius: 8px;border-top-right-radius: 8px;">
          <van-image :src='"http://localhost:9000/videoCover/"+video.coverpath' width="100%" height="105px" fit="contain" radius="8px 8px 0px 0px">
          </van-image>
        </div>

        <div class="van-ellipsis" style="width: 100%;text-align: left">
          <span class="video-box-p">{{video.videoname}}</span>
        </div>

      </div>
    </div>
    <van-dialog
        style="width:100%;border-radius:0;height:200px;text-align: center"
        theme="default"
        v-model="showvideoplay"
        :show-cancel-button="false"
        :show-confirm-button="false"
        closeOnClickOverlay
        onclose="closeRunVideo"
    >
      <video
          controls
          preload="auto"
          style="width:300px;height:200px;object-fit: contain;display: inline-block"
          :src="videourl"
          v-show="videourl"
          id="prevideo"
      ></video>
    </van-dialog>

  </div>
</template>

<script>
function closeRunVideo(){

}
export default {
  name: "MainMyTougao",
  data(){
    return{
      showvideoplay:false,
      videourl:'',
      videolist:[],
    }
  },
  methods:{
    toPreview(video) {
      this.videourl = video.videopath
      this.showvideoplay=true
    },
    toVideoFrame(video){
      this.selectVideo = video
      this.$router.push("/videoFrame")
      sessionStorage.setItem("selectVideoId",video.videoid)
    },
  },
  async mounted() {
    await this.$http.post("getVideoWithAuthor",sessionStorage.getItem("cid")).then(res=>{
      this.videolist = res.data
    })
  }
}
</script>

<style lang="less" scoped>
  .myTougao-div{
    background: #F2F3F5;
    padding-bottom: 70px;
  }
  .all-video-box{
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
  }
  .video-box {
    width: 46%;
    height: 36%;
    //border: 1px solid #8470FF;
    box-shadow: 0 1px 1px darkgrey;
    background-color: #fcfcfc;
    margin: 5px;
    border-radius: 8px;
    display: inline-block;

    .video-box-p {
      padding: 8px;
      margin-block-start: 2px;
      margin-block-end: 0;
    }
  }
</style>
