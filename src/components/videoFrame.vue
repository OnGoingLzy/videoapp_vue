<template>
  <div >
    <van-popup v-model="show" position="right" :style="{ height: '100%' ,width: '100%'}" @close="onClickLeft" class="videoFrame" >
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
        <van-col span="6" @click="toComment">
          <div>
            <span style="line-height: 40px" v-if="jianjie" >评论</span>
            <span style="line-height: 40px;color: #8470FF" v-if="!jianjie">评论</span>
          </div>
        </van-col>
      </van-row>

      <div class="jianjie" v-show="jianjie">
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
                <span style="font-size: 14px;color: #afafaf">{{video.description}}</span>
                <span v-if="video.description===''">该视频没有任何简介哦</span>
              </div>
            </van-col>
          </van-row>
<!--          视频标签-->
          <div class="img-box">
            <div>
              <van-tag round type="primary" v-for="(tag,index) of taglist" style="margin-right: 5px;" color="darkgrey">{{tag}}</van-tag>
            </div>
          </div>
          <van-row style="padding-top: 10px;">
            <van-col span="8" class="icondiv" @click="likeit" v-if="!likeState">
              <van-icon name="thumb-circle" size="30px"/>
              <p class="icondiv-p">{{video.likescount}}</p>
            </van-col>
            <van-col span="8" class="icondiv" @click="cancelLikeit" v-if="likeState" >
              <van-icon name="thumb-circle" size="30px" color="#8470FF"/>
              <p class="icondiv-p">{{video.likescount}}</p>
            </van-col>

            <van-col span="8" class="icondiv" @click="showShoucangClick" v-if="!shoucangState">
              <van-icon name="star" size="30px"/>
              <p class="icondiv-p">点击收藏</p>
            </van-col>
            <van-col span="8" class="icondiv" v-if="shoucangState" @click="toast">
              <van-icon name="star" size="30px" color="#8470FF"/>
              <p class="icondiv-p">已收藏</p>
            </van-col>


            <van-col span="8" class="icondiv" @click="showShare=true">
              <van-icon name="share" size="30px"/>
            </van-col>
          </van-row>



        </div>
        <hr>
<!--        推荐视频-->
        <div style="padding: 10px;max-height: 270px;overflow: auto">
          <div class="shoucang-video-box" v-for="(rvideo,index) of recommendVideoList" style="" v-if="video.videoid!==rvideo.videoid">
            <div style="width: 93%" @click="toVideo(rvideo.videoid)">
              <div class="shoucang-video-box-img">
                <van-image
                    height="80px"
                    width="120px"
                    radius="5px"
                    fit="fill"
                    :src="'http://localhost:9000/videoCover/'+rvideo.coverpath"
                    style="border: 1px solid darkgrey"
                >
                </van-image>
              </div>
              <div class="shoucang-video-box-msg van-multi-ellipsis--l2" >
                <div style="width: 100%;height: 40px">
                  <span style="color: black">{{rvideo.videoname}}</span>
                </div>
                <div>
                  <van-icon name="contact" size="16px"/>
                  <span>{{rvideo.authorid}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--      弹出区-->
        <van-share-sheet
            v-model="showShare"
            title="立即分享给好友"
            :options="options"
            @select="onSelect"

        />
        <van-popup v-model="showShoucang" position="bottom" :style="{ minheight: '15%' }" style="background-color: #F2F3F5" ref="popupbox">
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
      </div>
<!--&lt;!&ndash;      弹出区&ndash;&gt;-->
<!--      <van-share-sheet-->
<!--          v-model="showShare"-->
<!--          title="立即分享给好友"-->
<!--          :options="options"-->
<!--          @select="onSelect"-->

<!--      />-->
<!--      <van-popup v-model="showShoucang" position="bottom" :style="{ height: '25%' }" style="background-color: #F2F3F5" ref="popupbox">-->
<!--        <div style="width: 100%;background: #fcfcfc;">-->
<!--          <van-icon name="plus" size="20px" style="padding: 5px;left: 376px" @click="toAddFolder"/>-->
<!--        </div>-->

<!--        <van-radio-group v-model="chooseFolder" >-->
<!--          <van-cell-group>-->
<!--            <van-cell :title="folder.ffoldername" clickable @click="chooseFolder = folder.ffolderid" v-for="(folder,index) of folderlist">-->
<!--              <template #right-icon>-->
<!--                <van-radio :name="folder.ffolderid" />-->
<!--              </template>-->
<!--            </van-cell>-->

<!--          </van-cell-group>-->
<!--        </van-radio-group>-->

<!--        <div style="width: 100%;height: 50px;text-align: center;margin-top: 5px;background-color: #fcfcfc" @click="shoucangVideo">-->
<!--          <span style="margin: 0;line-height: 50px">完成</span>-->
<!--        </div>-->
<!--      </van-popup>-->


      <div class="pinglun" v-show="!jianjie" style="max-height: 550px;overflow: auto">
        <div>
          <div style="display: inline-block;padding: 10px">
            <span>热门评论</span>
          </div>
          <div style="display: inline-block;float: right;padding: 10px">
           <span v-if="sortState==='按热度'" style="color: darkgrey" @click="changeSort('按日期')" v-text="sortState"></span>
            <span v-if="sortState==='按日期'" style="color: darkgrey" @click="changeSort('按热度')" v-text="sortState"></span>
          </div>
        </div>


        <div v-for="(comment,index) of commentlist" v-show="commentkey" style="overflow:hidden;box-shadow: 0 1px 1px darkgrey;">
          <keep-alive>
            <comment-component v-bind:comment="comment" :key="index"  ></comment-component>
          </keep-alive>

        </div>
        <div style="height: 40px;width: 100%">

        </div>

<!--        <div class="input-Comment" v-if="!jianjie">-->
<!--          <input v-model="sendComment" class="input-Comment-box" type="text" :placeholder="placeholder" >-->
<!--          <span  style="color: #d9d9d9;padding-left: 8px" v-if="sendComment===''&&tocid===null">发布</span>-->
<!--          <span  style="color: #8470FF;padding-left: 8px" v-if="sendComment!==''&&tocid===null" @click="submitComment">发布</span>-->
<!--          <span  style="color: #d9d9d9;padding-left: 8px" v-if="sendComment===''&&tocid!==null">回复</span>-->
<!--          <span  style="color: #8470FF;padding-left: 8px" v-if="sendComment!==''&&tocid!==null" @click="submitComment">回复</span>-->
<!--        </div>-->

      </div>
      <!--        评论一些下-->
      <div class="input-Comment" v-if="!jianjie">
        <input v-model="sendComment" class="input-Comment-box" type="text" :placeholder="placeholder" >
        <van-icon style="vertical-align: middle" name="close" size="20px" @click="tocommentid=null;placeholder='输入一条友善的评论';sendComment=''"/>
        <span  style="color: #d9d9d9;padding-left: 8px" v-if="sendComment===''&&tocommentid===null">发布</span>
        <span  style="color: #8470FF;padding-left: 8px" v-if="sendComment!==''&&tocommentid===null" @click="submitComment">发布</span>
        <span  style="color: #d9d9d9;padding-left: 8px" v-if="sendComment===''&&tocommentid!==null">回复</span>
        <span  style="color: #8470FF;padding-left: 8px" v-if="sendComment!==''&&tocommentid!==null" @click="submitComment">回复</span>
      </div>
    </van-popup>

  </div>

</template>

<script>
import {Toast} from "vant";
import mainAddFolder from "@/components/personalComponents/mainComponents/mainAddFolder";
import commentComponent from "@/components/commentComponent";

export default {
  inject:['setFVisible','footerReload','reload'],
  provide(){
    return{
      replyComment: this.replyComment,
      rootdelComment: this.delComment
    }
  },
  components:{
    mainAddFolder,
    commentComponent,
  },
  name: "videoFrame",

  data(){
    return {
      sortState:"按热度",
      placeholder:"输入一条友善的评论",
      commentkey:true,
      sendComment:'',
      tocommentid:null,
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
      commentlist:{},
      usermsg:{},
      recommendVideoList:{},
      taglist:null,
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '复制链接', icon: 'link' },
      ],
    }
  },
  created() {
    // //添加监听事件，当点击输入框以外的地方清除回复的目标
    // document.addEventListener('click',(e) =>{
    //   if(this.$refs.popupbox){
    //     let isclick = this.$refs.popupbox.contains(e.target)
    //     if(isclick){
    //       this.placeholder="输入一条友善的评论"
    //       this.tocid = null
    //     }
    //   }
    // } )
  },
  methods:{
    toVideo(videoid){
      // this.videojsx.globaltoVideo(videoid)
      sessionStorage.setItem("selectVideoId",videoid)
      //带/从根路由开始，不带从当前路由开始
      this.$router.push("/videoFrame")
      this.reload()
    },
    replyComment(tocommentid,tocname){
      this.tocommentid = tocommentid
      this.placeholder = "回复@"+tocname+":"
    },
    delComment(commentid) {
      this.commentlist.some((comment,i)=>{
        if(comment.commentid===commentid){
          this.commentlist.splice(i,1)
          return true
        }
      })
      this.commentkey = false
      this.$nextTick(()=>{
        this.commentkey = true
      })
    },
    changeSort(sortState){
      this.commentkey = false
      this.$nextTick(()=>{
        this.commentkey = true
      })
      if(sortState==='按热度'){
        this.sortState = '按热度'
        this.commentlist = this.commentlist.sort(function (a,b){
          return b.belikecounts - a.belikecounts

        })
      }else {
        this.sortState = '按日期'
        this.commentlist = this.commentlist.sort(function (a,b){
          //按时间排序需要处理下
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })
      }

    },
    async submitComment() {
      if(sessionStorage.getItem("cid")===null){
        Toast("请登录")
        return
      }
      let formData = new FormData
      formData.append("videoid",this.video.videoid)
      formData.append("cid",sessionStorage.getItem("cid"))
      formData.append("content",this.sendComment)
      formData.append("tocommentid",this.tocommentid)
      // console.log(this.tocommentid)
      await this.$http.post("submitComment", formData).then(res=>{
        if(res.data===true) {
          Toast("评论成功")
          //回复成功后清除当前回复的对象
          this.sendComment=''
          this.tocommentid = null
          this.placeholder = "输入一条友善的评论"
          this.commentkey = false
          this.$nextTick(()=>{
            this.commentkey = true
          })
          this.toComment()
        }
      }).catch((error)=>{
        Toast("服务器开小差了")
      })
    },
    toast(){//再次点击收藏提示
      Toast("请前往个人中心管理收藏")
    },
    async toComment() {
      this.jianjie = false
      let formData = new FormData
      formData.append("videoid",this.video.videoid)
      await this.$http.post("getVideoComment", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        //点赞数排序
        this.commentlist = res.data
        this.changeSort('按热度')
      }).catch((error)=>{
        Toast("服务器请求失败")
      })
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
      this.folderlist = res
    },
    async getRecommendVideo(){
      let shuju= {
        cpage: null,
        category: this.video.category,
        //tag: this.video.tag.split(','),
        tag: ['默认'],
        searchSql: null,
      }
      let allcount
      this.$http.post("/getAllCount2",shuju).then(async res => {
        allcount = res.data
        shuju.cpage = String(Math.floor(Math.random() * ((Number(allcount) / 4))) + 1);
        const {data: videolist} = await this.$http.post("/getVideoWithCategoryAndTag", shuju)
        this.recommendVideoList = videolist
      });



    }
  },
  async beforeMount() {
    sessionStorage.setItem("active",'0')
    let videoid = sessionStorage.getItem("selectVideoId")
    await this.$http.post("getVideo",videoid).then(async res => {
      if (res.data !== null) {
        this.video = res.data
        this.taglist = this.video.tag.split(',')
        await this.$http.post("getMsgImg",res.data.authorid).then(res => {
          this.authorAvatar = res.data.avatarName
          this.author = res.data
        })
      }
    })
    await this.checkBeLike()
    await  this.checkBeCollected()
    await this.getRecommendVideo()
  },

}
</script>

<style lang="less" scoped>
@import "src/assets/CSS/global";
.video-container{
  width: 100%;
}
.videoFrame{
  background: #f5f5f6;
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
.pinglun{

}
.input-Comment{
  width: 100%;
  position: fixed;
  bottom: 0;
  background: #fcfcfc;
  .input-Comment-box{
    display: inline-block;
    background: rgba(224,224,224,0.76);
    border-radius: 8px;
    margin: 8px;
    width: 70%;
    height: 30px;
    border: none;
  }
}
.img-box {
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  /*垂直居中 */

  .img-box-text {
    width: 98px;
    vertical-align: middle;

  }
}
</style>
