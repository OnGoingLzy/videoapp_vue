<template>
  <div >
    <van-popup v-model="show" position="right" :style="{ height: '100%' ,width: '100%'}" @close="onClickLeft" class="videoFrame">
      <van-nav-bar
          title=""
          left-text=""
          right-text=""
          left-arrow
          @click-left="onClickLeft"
      />
    <div class="video-container" v-if="video!==null">
<!--       <vue-core-video-player :src="video.videopath" id="video"></vue-core-video-player>&ndash;&gt;-->
      <video controls autoplay :src="video.videopath" style="width: 100%;height: 240px"></video>
    </div>

      <van-row type="flex" justify="space-around" class="videomsg-bar-box">
        <van-col span="6" @click="jianjie=true">
          <div>
            <span style="line-height: 40px" v-if="!jianjie" >简介</span>
            <span style="line-height: 40px;color: #8470FF" v-if="jianjie">简介</span>
          </div>
        </van-col>
        <van-col span="6" @click="jianjie=false">
          <div>
            <span style="line-height: 40px" v-if="jianjie" >评论</span>
            <span style="line-height: 40px;color: #8470FF" v-if="!jianjie">评论</span>
          </div>
        </van-col>
      </van-row>

      <div class="jianjie" v-if="jianjie">
        <div>
          <van-row>
            <van-col span="16" class="jianjie-author">
              <van-image
                  round
                  width="50px"
                  height="50px"
                  :src="'http://localhost:9000/avatar/'+authorAvatar"
              />
              <span style="margin-left: 10px;line-height: 50px">{{author.cname}}</span>
            </van-col>
            <van-col span="8"></van-col>
          </van-row>
        </div>
        <div>
          <van-row>
            <van-col span="24" class="jianjie-videomsg">
              <div><span style="font-size: 20px;font-weight: bold;">{{video.videoname}}</span></div>
              <br>
              <div style="width: 70%">
                <span>{{video.description}}</span>
                <span v-if="video.description===''">该视频没有任何简介哦</span>
              </div>
            </van-col>
          </van-row>

          <van-row style="padding-top: 10px;background: #fcfcfc">
            <van-col span="8" class="icondiv" @click="likeit" v-if="!likeState">
              <van-icon name="thumb-circle" size="40px"/>
              <p class="icondiv-p">{{video.likescount}}</p>
            </van-col>
            <van-col span="8" class="icondiv" @click="cancelLikeit" v-if="likeState" >
              <van-icon name="thumb-circle" size="40px" color="#8470FF"/>
              <p class="icondiv-p">{{video.likescount}}</p>
            </van-col>

            <van-col span="8" class="icondiv" @click="showShoucangClick" v-if="!shoucangState">
              <van-icon name="star" size="40px"/>
              <p class="icondiv-p">点击收藏</p>
            </van-col>
            <van-col span="8" class="icondiv" v-if="shoucangState" @click="toast">
              <van-icon name="star" size="40px" color="#8470FF"/>
              <p class="icondiv-p">已收藏</p>
            </van-col>


            <van-col span="8" class="icondiv" @click="showShare=true">
              <van-icon name="share" size="40px"/>
            </van-col>
          </van-row>

        </div>

      </div>
<!--      弹出区-->
      <van-share-sheet
          v-model="showShare"
          title="立即分享给好友"
          :options="options"
          @select="onSelect"
      />
      <van-popup v-model="showShoucang" position="bottom" :style="{ height: '25%' }" style="background-color: #F2F3F5">
        <div style="width: 100%;background: #fcfcfc;">
          <van-icon name="plus" size="20px" style="padding: 5px;left: 376px" @click="toAddFolder"/>
        </div>

        <van-radio-group v-model="chooseFolder" >
          <van-cell-group>
            <van-cell :title="folder.ffoldername" clickable @click="chooseFolder = folder.ffolderid" v-for="(folder,index) of folderlist">
              <template #right-icon>
                <van-radio :name="folder.ffolderid" />
              </template>
            </van-cell>

          </van-cell-group>
        </van-radio-group>

        <div style="width: 100%;height: 50px;text-align: center;margin-top: 5px;background-color: #fcfcfc" @click="shoucangVideo">
          <span style="margin: 0;line-height: 50px">完成</span>
        </div>
      </van-popup>


      <div class="pinglun" v-if="!jianjie">

      </div>
    </van-popup>
  </div>

</template>

<script>
import {Toast} from "vant";
import mainAddFolder from "@/components/personalComponents/mainComponents/mainAddFolder";

export default {
  inject:['setFVisible','footerReload'],
  components:{
    mainAddFolder
  },
  name: "videoFrame",
  data(){
    return {
      chooseFolder:'',
      jianjie: true,
      key: 1,
      show: true,
      showShoucang: false,
      author: [],
      video: {},
      authorAvatar: 'default.png',
      likeState: false,
      shoucangState: false,
      showShare: false,
      folderlist:[],
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '复制链接', icon: 'link' },
      ],
    }
  },
  methods:{
    toast(){//再次点击收藏提示
      Toast("请前往个人中心管理收藏")
    },
    async shoucangVideo() {
      let formData = new FormData
      formData.append("folderid", this.chooseFolder)
      formData.append("videoid", this.video.videoid)
      await this.$http.post("shoucangVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        if (res.data === true) {
          this.shoucangState = true
          this.showShoucang = false
        }
      })
    },
    showShoucangClick(){
      if(sessionStorage.getItem("cid")===null){
        Toast("请登录")
        return
      }
      this.showShoucang=true
      this.getFolder()
    },
    toAddFolder(){
       this.$router.push('/personalSpace/addFolder')
     // window.location.href='http://localhost:8080/#/personalSpace/addFolder';
    },
    async checkBeCollected(){
      let formData = new FormData
      formData.append("cid",sessionStorage.getItem("cid"))
      formData.append("videoid",sessionStorage.getItem("selectVideoId"))
      await this.$http.post("checkBeCollected", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        console.log("检查是否收藏"+res.data)
        if(res.data===true){
          this.shoucangState=true
        }
      })
    },
    async checkBeLike() {
      let formData = new FormData
      formData.append("cid",sessionStorage.getItem("cid"))
      formData.append("videoid",sessionStorage.getItem("selectVideoId"))
      await this.$http.post("checkBeLike", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        console.log("检查是否点赞"+res.data)
        if(res.data===true){
          this.likeState=true
        }
      })
    },
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },
    onClickLeft(){
      this.$router.back()
      //this.footerReload()
    },
    async likeit() {
      if(sessionStorage.getItem("cid")===null){
        Toast("请登录")
        return
      }
      this.video.likescount = this.video.likescount + 1
      this.likeState = true
      let formData = new FormData
      formData.append("cid", sessionStorage.getItem("cid"))
      formData.append("videoid", sessionStorage.getItem("selectVideoId"))
      await this.$http.post("addBeLike", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        if(res.data===true){
          this.likeState = true
        }
      })
    },
    async cancelLikeit() {
      this.video.likescount = this.video.likescount - 1
      this.likeState = false
      let formData = new FormData
      formData.append("cid", sessionStorage.getItem("cid"))
      formData.append("videoid", sessionStorage.getItem("selectVideoId"))
      await this.$http.post("deleteBeLike", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        if(res.data===true){
          this.likeState=false
        }
      })
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
      this.folderlist = res
    },
  },
  async beforeMount() {
    sessionStorage.setItem("active",'0')
    let videoid = sessionStorage.getItem("selectVideoId")
    await this.$http.post("getVideo",videoid).then(async res => {
      if (res.data !== null) {
        this.video = res.data
        await this.$http.post("getMsgImg",res.data.authorid).then(res => {
          this.authorAvatar = res.data.avatarName
          this.author = res.data
        })
      }
    })
    await this.checkBeLike()
    await  this.checkBeCollected()
  },

}
</script>

<style lang="less" scoped>
@import "src/assets/CSS/global";
.video-container{
  width: 100%;
}
.videoFrame{
  background: #F2F3F5;
  min-height: 600px;
}

  .videomsg-bar-box{
    padding: 6px;
    height: 35px;
    text-align: center;
    vertical-align: middle;
    background: #fcfcfc;
    box-shadow: 0 1px 1px darkgrey;
  }
  .jianjie-author{
    padding: 10px;
    display: flex;
    text-align: center;
  }
  .jianjie-videomsg{
    padding: 10px;

  }
</style>
