<template>
  <div style="min-height: 500px">

    <div style="width: 100%;background: #fcfcfc;">
      <van-icon name="plus" size="20px" style="padding: 5px;left: 90%" @click="toAddFolder"/>
    </div>
    <van-collapse v-model="activeNames" accordion @change="changeFolder">
      <van-collapse-item :key="index" :title="folder.ffoldername" :name="folder.ffolderid" v-for="(folder,index) of folderList">
        内容
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

      </van-collapse-item>

    </van-collapse>

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

  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "mainShoucang",
  data(){
    return{
      activeNames: [],
      folderList: null,
      folderVideo: null,
      editVideo: false,
      editVideoId: null,
    }
  },
  methods:{
    toVideo(videoid){
      sessionStorage.setItem("selectVideoId",videoid)
      //带/从根路由开始，不带从当前路由开始
      this.$router.push("/videoFrame")
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
      this.folderList = res
    },
    async changeFolder(Event) {
      if(Event==="") return
      let folderid = Event
      let formData = new FormData()
      formData.append("folderid", folderid)
      const {data: res} = await this.$http.post("getFolderVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      this.folderVideo = res
    },
    toAddFolder(){
      this.$router.push('addFolder')
    },
    clickEditVideo(videoid){
      this.editVideoId = videoid
      this.editVideo = true
    },
    async cancelShoucang() {
      let formData = new FormData()
      formData.append("videoid",this.editVideoId)
      formData.append("folderid",this.activeNames)
      await this.$http.post("cancelShoucang", formData,{
        headers:{
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        if (res.data===true){
          Toast("取消成功")
          this.editVideoId=null
          this.editVideo=false
          this.activeNames=""
        }
      })
    }
  },
  mounted() {
    this.getFolder()
  }
}
</script>

<style lang="less" scoped>
  //.shoucang-video-box{
  //  background: #F2F3F5;
  //  width: 100%;
  //  height: 80px;
  //  padding: 5px;
  //  display: flex;
  //  .shoucang-video-box-img{
  //    width: 120px;
  //    height: 80px;
  //    display: inline-block;
  //  }
  //  .shoucang-video-box-msg{
  //    padding-left: 7px;
  //    width: 58%;
  //    height: 80px;
  //    display: inline-block;
  //  }
  //  .shoucang-video-box-edit{
  //    display: inline-block;
  //    width: 20px;
  //    padding-left: 6px;
  //  }
  //}
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
