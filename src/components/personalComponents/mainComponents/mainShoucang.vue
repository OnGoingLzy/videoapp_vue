<template>
  <div style="min-height: 500px">

    <div style="width: 100%;background: #fcfcfc;">
      <van-icon name="plus" size="20px" style="padding: 5px;left: 2%" @click="toAddFolder"/>
    </div>
    <van-collapse v-model="activeNames" accordion @change="changeFolder">
      <van-collapse-item :key="index" :title="folder.ffoldername" :name="folder.ffolderid" v-for="(folder,index) of folderList">
        <span v-if="folder.limit===1">公开</span>
        <span v-if="folder.limit===2">私密</span>
        <van-icon name="more" style="float: right" size="20px" @click="clickEditFolder(folder)"/>
        <div class="shoucang-video-box" v-for="(video,index) of folderVideo" >
          <div style="width: 93%" @click="toVideo(video.videoid)">
            <div class="shoucang-video-box-img">
              <van-image height="80px" width="120px" radius="5px" fit="fill" :src="'http://localhost:9000/videoCover/'+video.coverpath" style="border: 1px solid darkgrey">

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
            <van-icon size="20px" name="ellipsis" color="black" @click="clickEditVideo(video.videoid)"/>
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

    <van-popup @close="" v-model="editFolder" position="bottom" :style="{ minHeight: '10%' }" style="background-color: #F2F3F5">
      <van-row style="background-color: #fcfcfc">
        <van-col span="6" class="icondiv" @click="deleteFolder()">
          <van-icon name="delete" size="40px"/>
          <p class="icondiv-p">删除收藏夹</p>
        </van-col>

        <van-col span="6" class="icondiv" @click="">
          <van-icon style="margin-left: 4px" name="suoding" size="40px" color="#8470ff" v-if="editFolderMsg.limit === 2" @click="changeLimit(1)"/>
          <p class="icondiv-p" v-if="editFolderMsg.limit === 2">私密</p>
          <van-icon name="jiesuo" size="40px" v-if="editFolderMsg.limit === 1" @click="changeLimit(2)"/>
          <p class="icondiv-p" v-if="editFolderMsg.limit === 1">公开</p>
        </van-col>
      </van-row>

      <div style="width: 100%;height: 50px;text-align: center;margin-top: 5px;background-color: #fcfcfc" @click="editFolder = false">
        <span style="margin: 0;line-height: 50px">取消</span>
      </div>
    </van-popup>

    <van-popup @close="" v-model="showAddFolder" position="bottom" :style="{ minHeight: '30%' }">
      <main-add-folder></main-add-folder>
    </van-popup>
  </div>
</template>

<script>
import {Dialog, Toast} from "vant";
import mainAddFolder from "@/components/personalComponents/mainComponents/mainAddFolder";

export default {
  name: "mainShoucang",
  provide(){
    return{
      returnPopup: this.returnPopup
    }
  },
  data(){
    return{
      activeNames: [],
      folderList: null,
      folderVideo: null,
      editVideo: false,
      editVideoId: null,
      editFolder: false,
      showAddFolder: false,
      editFolderMsg: {
        limit:0
      },
    }
  },
  components:{
    mainAddFolder
  },
  methods:{
    returnPopup(){
      this.showAddFolder = false
      this.getFolder()
    },
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
      // this.$router.push('addFolder')
      this.showAddFolder = true
    },
    clickEditVideo(videoid){
      this.editVideoId = videoid
      this.editVideo = true
    },
    clickEditFolder(folder){
      this.editFolderMsg = folder
      this.editFolder = true
    },
    deleteFolder(){
      Dialog.confirm({
        title: '删除',
        message: '是否删除该文件夹?',
        confirmButtonColor: "#8470ff"
      })
          .then(() => {
            let formData = new FormData
            formData.append("folderid",this.editFolderMsg.ffolderid)
            this.$http.post("deleteFolder",formData,{
              headers:{
                "Content-Type":"multipart/form-data"
              }
            }).then(res=>{
              this.activeNames=[]
              this.folderList.some((folder, i) => {
                if (folder.ffolderid === this.editFolderMsg.ffolderid) {
                  this.folderList.splice(i, 1)
                  //在数组的some方法中，如果return true，就会立即终止这个数组的后续循环
                  return true
                }
              })
              this.editFolder = false
              Toast("删除成功")
            })
          })
          .catch(() => {
            // on cancel
          });

    },
    changeLimit(limit){
      this.editFolderMsg.limit = limit
      let formData = new FormData
      formData.append("limit",limit)
      formData.append("folderid",this.editFolderMsg.ffolderid)
      this.$http.post("changeFolderLimit",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }).then(res=>{
        Toast("修改成功")
      })
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
  .van-collapse-item__content{
    padding: 11px 11px;
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
