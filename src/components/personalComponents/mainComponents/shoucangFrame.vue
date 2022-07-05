<template>
  <div style="min-height: 600px;width: 414px" :key="key">
    <van-popup v-model="show" position="right" :style="{ height: '100%' ,width: '100%'}" @close="onClickLeft" class="videoFrame">
    <van-nav-bar
        :title="foldername"
        left-text=""
        right-text=""
        left-arrow
        @click-left="onClickLeft"
    />
      <div v-if="folderVideo===null">
        这里面空空如也
      </div>
      <div class="shoucang-video-box" v-for="(video,index) of folderVideo" >
        <div style="width: 93%" @click="toVideo(video.videoid)">
          <div class="shoucang-video-box-img">
            <van-image height="80px" width="120px" radius="5px" fit="cover" :src="'http://localhost:9000/videoCover/'+video.coverpath" >

            </van-image>
          </div>
          <div class="shoucang-video-box-msg van-multi-ellipsis--l2" >
            <div style="width: 100%;height: 40px">
              <span style="color: black">{{video.videoname}}</span>
            </div>
            <div>
              <van-icon name="contact" size="16px"/>
              <span>{{video.authorid}}</span>
            </div>
          </div>
        </div>

        <div class="shoucang-video-box-edit">
          <van-icon name="ellipsis" color="black" @click="clickEditVideo(video.videoid)"/>
        </div>
      </div>

      <van-popup @close="editVideoId = null" v-model="editVideo" position="bottom" :style="{ minHeight: '10%' }" style="background-color: #F2F3F5">
        <van-row style="background-color: #fcfcfc">
          <van-col span="6" class="icondiv" @click="cancelShoucang()">
            <van-icon name="star-o" size="40px"/>
            <p class="icondiv-p">取消收藏</p>
          </van-col>
        </van-row>

        <div style="width: 100%;height: 50px;text-align: center;margin-top: 5px;background-color: #fcfcfc" @click="editVideo = false">
          <span style="margin: 0;line-height: 50px">取消</span>
        </div>
      </van-popup>

    </van-popup>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "shoucangFrame",
  inject:['back'],
  props:['folderid','foldername'],
  data(){
    return{
      folderVideo: null,
      editVideo: false,
      editVideoId: null,
      show:true,
      key:1
    }
  },
  methods:{
    onClickLeft(){
      this.back(false)
    },
    clickEditVideo(videoid){
      this.editVideoId = videoid
      this.editVideo = true
    },
    async cancelShoucang() {
      let formData = new FormData()
      formData.append("videoid",this.editVideoId)
      formData.append("folderid",this.folderid)
      await this.$http.post("cancelShoucang", formData,{
        headers:{
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        console.log(res.data)
        if (res.data===true){
          Toast("取消成功")
          this.editVideoId=null
          this.editVideo=false
          this.getFolderVideo()
          this.key=2
          this.$nextTick(function (){
            this.key=1
          })
        }
      })
    },
    async getFolderVideo() {
      let folderid = this.folderid
      let formData = new FormData()
      formData.append("folderid", folderid)
      const {data: res} = await this.$http.post("getFolderVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      if(res.length === 0){
        this.folderVideo = null
        return
      }
      this.folderVideo = res

    },
    toVideo(videoid){
      sessionStorage.setItem("selectVideoId",videoid)
      //带/从根路由开始，不带从当前路由开始
      this.$router.push("/videoFrame")
    },
  },
  async mounted() {

    await this.getFolderVideo()
  }
}
</script>

<style lang="less" scoped>
.videoFrame{
  background: #F2F3F5;
  min-height: 600px;
  width: 414px;
}
.shoucang-video-box{
  height: 80px;
  padding: 10px;
  display: flex;
  .shoucang-video-box-img{
    width: 120px;
    height: 80px;
    display: inline-block;
  }
  .shoucang-video-box-msg{
    padding-left: 7px;
    width: 56%;
    height: 80px;
    display: inline-block;
  }
  .shoucang-video-box-edit{
    display: inline-block;
    width: 20px;

  }
}
.icondiv{
  padding: 6px;
  display: table-cell;
  /*垂直居中 */
  vertical-align: middle;
  /*水平居中*/
  text-align: center;
  .icondiv-p{
    margin: 0;
  }
}
</style>
