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
        <van-button type="primary" size="small" class="video-audit-button">通过</van-button>
      </div>
    </van-list>

    <van-popup v-model="view" @close="view = false" :style="{height: '50%',width:'80%',borderRadius:'5px'}">
      <div class="img-box">
        <div class="mg-box-text">
          <span style="font-size: 14px;color: #4b4b4b;">视频封面</span>
        </div>
        <van-image
            :src="'http://localhost:9000/videoCover/'+video.coverpath"
            width="180px"
            height="120px"
            style="padding-left: 40px"
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
      <div class="category-box">

      </div>
      <div class="tag-box">

      </div>
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
      video: [],
    }
  },
  methods:{
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
