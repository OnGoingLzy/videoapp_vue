<template>
  <div>
    <van-nav-bar
      title="视频审核"
      left-arrow
      @click-left="clickBack"
    />
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <div class="video-audit-box" v-for="(video,index) of videolist">
        <van-tag plain type="primary" class="video-audit-span" color="#5470ff">{{video.category}}</van-tag>
        <div class="video-audit-msg-box">
          <span>{{video.videoname}}</span>
        </div>
        <van-button  type="primary" size="small" class="video-audit-button" color="#8470FF" @click="videVideo(video)">查看</van-button>
        <van-button type="primary" size="small" class="video-audit-button" color="red">驳回</van-button>
        <van-button type="primary" size="small" class="video-audit-button" @click="passAudit(video.videoid)">通过</van-button>
      </div>
    </van-list>

    <van-popup v-model="view" @close="view = false" :style="{height: '50%',width:'80%',borderRadius:'5px'}">
      <van-icon name="shenhe" size="50px" style="left: 140px;padding: 8px" color="#5470ff"></van-icon>
      <div class="img-box">
        <div class="img-box-text">
          <span style="font-size: 14px;color: #4b4b4b;">视频封面</span>
        </div>
        <van-image
            :src="'http://localhost:9000/videoCover/'+video.coverpath"
            width="180px"
            height="120px"
            @click="showvideoplay=true"

        />
      </div>
      <van-field
          v-model="video.videoname"
          name="videoName"
          label="视频标题"
          readonly
      />
      <van-field
          v-model="video.description"
          rows="2"
          autosize
          label="介绍"
          type="textarea"
          maxlength="50"
          show-word-limit
      />

      <div class="img-box">
        <div class="img-box-text">
          <span style="font-size: 14px;color: #4b4b4b;">视频标签</span>
        </div>
        <div>
          <van-tag round type="primary" v-for="(tag,index) of taglist" style="margin: 5px;" color="darkgrey">{{tag}}</van-tag>
        </div>
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
            style="width:100%;height:200px;object-fit: contain;"
            :src="video.videopath"
            v-show="video.videopath"
            id="prevideo"
        ></video>
      </van-dialog>

    </van-popup>
  </div>
</template>

<script>
import async from "async";
import {Toast} from "vant";

export default {
  name: "adminVideoAudit",
  data(){
    return{
      videolist:{},
      loading: false,
      finished: false,
      view: false,
      taglist: [],
      showvideoplay: false,
      video: [],
    }
  },
  methods:{
    async passAudit(videoid) {
      let formData = new FormData
      formData.append("videoid")
      await this.$http.post("passVideoAudit", formData)
    },
    closeRunVideo(){
      this.showvideoplay=false
    },
    clickBack(){
      this.$router.back()
    },
    async onLoad() {
      await this.$http.post("getAuditVideo").then(res=>{
        if(res.data===null){
          Toast("没有可审核的视频")
          this.loading=true
          this.finished=true
        }else {
          this.videolist = res.data
          this.loading=true
          this.finished=true
        }
      })
    },
    videVideo(video){
      this.video = video
      console.log(video.tag)
      this.taglist = video.tag.split(',');
      this.view = true
    }
  }
}
</script>

<style lang="less" scoped>
  .video-audit-box{
    width: 100%;
    height: 80px;
    padding-top: 5px;
    .video-audit-span{
      margin-left: 5px;
      display: inline-block;
      height: 20%;
      top: 35%;
    }
    .video-audit-msg-box{
      display: inline-block;
      width: 50%;
      height: 80px;
      padding-left: 10px;
      padding-right: 10px;
    }
    .video-audit-button{
      display: inline-block;
      top: 24px;
      float: right;
      margin-right: 5px;
    }
  }
  .img-box{
    padding-top: 10px;
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    /*垂直居中 */
    .img-box-text{
      width: 98px;
      vertical-align: middle;

    }
  }
</style>
