<template>
  <div class="main-box">

    <van-uploader v-model="video"
                  accept="video/*"
                  max-count="1"
                  :after-read="selectAfter"
                  result-type="file"
                  class="uploader-box"
                  preview-size="300px"
                  :deletable="deletable"
                  :preview-image=false


    >
      <div slot="default" class="add-video-box">
        <van-icon name="add-o" size="200px" color="#EBEDF0"/>
      </div>

    </van-uploader>
<!--选择好视频后出现的div-->
    <div class="add-video-box" v-if="video.length!==0" style="margin-left: 48px">
      <van-icon name="tv-o" size="200px" color="black" @click="previewClick"/>
      <van-icon name="clear" size="24" style="float: right" @click="clearTheVideo" v-if="videourl===''"/>
      <img :src="videoPreviewUrl" alt="" v-if="videoPreviewUrl">
    </div>


    <van-dialog
        style="width:100%;border-radius:0;height:200px"
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
          style="width:300px;height:200px;object-fit: contain;"
          :src="videourl"
          v-show="videourl"
          id="prevideo"
      ></video>
    </van-dialog>



    <div>
      <div style="width: 80%;padding: 10px;margin-left: 36px">
        <van-progress :percentage="progress" stroke-width="8" v-if="progress!==0" />
      </div>

      总大小:{{videoSize}}
    </div>
    <van-button round type="info" @click="uploadVideo()" color="#8470FF" v-if="uploadState==='false'">上传视频</van-button>
    <div>
      <van-button v-if="uploadState!=='false'" round type="info" @click="this.toNext" color="#8470FF">下一步</van-button>
    </div>

    <canvas id="canvas" style="display: none"></canvas>
  </div>
</template>

<script>
import {Notify, Toast} from "vant";
import axios from "axios";
import bus from "@/bus";

export default {
  inject:['toNext','toPrevious'],
  name: "videoUpload",
  data(){
    return{
      video: [],
      videoFile: null,
      progress: 0, // 进度条
      videoSize: null,
      videourl:'',
      videoPreviewUrl:'',
      showvideoplay: false,
      deletable: true,
      uploadState: 'false',
    }
  },
  methods:{
    closeRunVideo(){
      const video = document.getElementById('prevideo');
      video.pause()
    },
    uploading() {
      Notify({ type: 'warning', message: '请等待上传完成',duration: 1000 });
    },
    clearTheVideo(){
      this.video = []
      this.videoSize = null
    },
    selectAfter(file){
      this.videoFile = file.file;
      this.videoSize = (file.file.size / 1024 / 1024).toFixed(2) + "MB";
      console.log(this.videoSize  + "MB")


    },
    previewClick(){
      if(this.videourl!==''){
        this.showvideoplay = true;
      }else {
        Toast('视频还未上传')
      }
    },
    async uploadVideo() {
      if(this.videoFile==null){
        Toast('请添加视频')
        return
      }
      const formData = new FormData() // 创建form对象
      formData.append('file', this.videoFile) // 通过append向form对象添加数据const res = await upLoadImage(formData);
      // const {data: res} =
        await this.$http.post('videoUpload',formData,{
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: progressEvent => {// 原生获取上传进度的事件
          const process = ((progressEvent.loaded / progressEvent.total) * 100) | 0
          this.progress = process
        }
      }).then(async res => {
          console.log(res.data)
          this.videourl = "http://localhost:9000/video/" + res.data
          bus.$emit('videoPath', this.videourl)//把后台存放路径发给下一步骤
          this.uploadState = 'true'
          sessionStorage.setItem("uploadState",'true')
          this.deletable = false
          let preVideoMsg ={
            videoUrl: this.videourl,
            cid: sessionStorage.getItem('cid'),
            videoSize: this.videoSize
          }
          await this.$http.post('preUploadSave',preVideoMsg)

        })
    },

  },
  async mounted() {
     if(Number(sessionStorage.getItem('cid'))!==0){
       const {data:res}= await this.$http.post('getPreUploadMsg', String(sessionStorage.getItem('cid')))
       if(res!==''){
         this.videourl = res.videourl
         this.video = [1]
         this.videoSize = res.videosize
         this.toNext()
         console.log(res.uploadstate)
         this.uploadState = res.uploadstate
       }else {

       }

     }

  }

}
</script>

<style lang="less" scoped>
  .main-box{
    /*垂直居中 */
    min-height: 600px;
    width: 100%;
    vertical-align: middle;
    /*水平居中*/
    text-align: center;
    .uploader-box{

      margin-top: 30px;

    }
    .add-video-box{
      width: 300px;
      height: 200px;
      background-color: #fcfcfc;
      border-radius: 2px;
      box-shadow: 0 1px 1px darkgrey;
      vertical-align: middle;
      /*水平居中*/
      text-align: center;
    }
    .preview-cover{
      height: 200px;
      box-shadow: 0 1px 1px darkgrey;
    }
  }


</style>
