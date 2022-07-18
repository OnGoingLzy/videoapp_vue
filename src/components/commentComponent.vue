<template>
  <div style="overflow:hidden;">
    <div class="comment-box-avatar">
      <van-image
          width="80%"
          height="80%"
          round
          v-if="commenter!==null"
          :src="'http://localhost:9000/avatar/'+commenter.avatarName"
      />
    </div>

    <div class="comment-box" v-if="commenter!==null">
      <div><span style="color: #8470FF">{{commenter.cname}}</span></div>
      <div>{{comment.date}}</div>
      <div class="comment-box-root">
        <div class="comment-box-root-content">
          <span style="font-weight: bolder">{{comment.content}}</span>
        </div>
        <div class="comment-box-root-statusbar">
          <van-icon name="good-job-o" size="20px" style="display: inline-block" v-if="!belikeStatus" @click="likeit"/>
          <p style="margin: 0;display: inline-block" v-if="!belikeStatus">{{comment.belikecounts}}</p>
          <van-icon name="good-job-o" size="20px" style="display: inline-block;" color="#8470ff" v-if="belikeStatus" @click="cancelLikeit"/>
          <p style="margin: 0;display: inline-block;color: #8470FF" v-if="belikeStatus">{{comment.belikecounts}}</p>

          <van-icon name="chat-o" size="20px" style="margin-left:10px;display: inline-block" @click="replyComment(comment.commentid,commenter.cname)"/>
          <p @click="delComment" style="font-size: 16px;margin: 0 0 0 10PX;display: inline-block;color: darkgrey" v-if="this.videojsx.getCid()===comment.cid">删除</p>
        </div>


        <div class="comment-box-son" v-if="commentlist!==''" style="overflow: auto">
          <div v-for="(son,index) of commentlist" :key="index" >
            <span style="color: #8470FF">用户{{son.cid}}</span>
            <span>:{{son.content}}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {Dialog, Toast} from "vant";

export default {
  name: "commentComponent",
  inject:["replyComment",'rootdelComment'],
  props:["comment"],
  data(){
    return{
      commenter:null,
      commentlist:null,
      belikeStatus:false,
    }
  },
  methods:{
    async likeit() {
      if(sessionStorage.getItem("cid")===null){
        Toast("请登录")
        return
      }
      let formData = new FormData
      formData.append("cid", sessionStorage.getItem("cid"))
      formData.append("commentid", this.comment.commentid)
      await this.$http.post("addBeLikeComment", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        if(res.data===true)this.belikeStatus = true
        this.comment.belikecounts = this.comment.belikecounts + 1
      })
    },
    async cancelLikeit() {
      let formData = new FormData
      formData.append("cid", sessionStorage.getItem("cid"))
      formData.append("commentid", this.comment.commentid)
      await this.$http.post("delBeLikeComment", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res => {
        if (res.data === true) {
          this.belikeStatus = false
          this.comment.belikecounts = this.comment.belikecounts - 1
        }
      })
    },
    delComment() {
      Dialog.confirm({
        title: '删除',
        message:'确认删除这条评论吗?',
      }).then(async () => {
        let formData = new FormData
        formData.append("commentid", this.comment.commentid)
        formData.append("cid",this.comment.cid)
        formData.append("videoid",this.comment.videoid)
        await this.$http.post("delComment", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }).then(res => {
          if (res.data === true) {
            this.$destroy()
            this.$el.parentNode.removeChild(this.$el);
            this.rootdelComment(this.comment.commentid)
          }
        })
      })

    }
  },
  async mounted() {
    this.$http.post("getMsgImg", this.comment.cid).then(res => {
      this.commenter = res.data
    })

    let formData = new FormData
    formData.append("videoid",this.comment.videoid)
    formData.append("toCommentid",this.comment.commentid)
    await this.$http.post("getCommentReply", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res=>{
      this.commentlist = res.data

    }).catch((error)=>{

    })
    formData.append("cid",sessionStorage.getItem("cid"))
    formData.append("commentid",this.comment.commentid)
    await this.$http.post("checkBeLikeComment",formData,{
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res=>{
      this.belikeStatus = res.data
    })



  }
}
</script>

<style lang="less" scoped>
//@import "src/assets/CSS/global";
.comment-box-avatar{
  float: left;
  margin-top: 15px;
  width: 12%;
  text-align: center;

}
.comment-box{
  float: left;
  padding-top: 15px;
  padding-bottom: 10px;
  width: 82%;

  .comment-box-root{
    padding-top: 5px;
    width: 100%;
    min-height: 40px;
    .comment-box-root-statusbar{
      padding-top: 15px;
      height: 20px;
    }
    .comment-box-son{
      margin-top: 10px;
      width: 97%;
      border-radius: 5px;
      background: #dfe1e1;
      min-height: 50px;
      max-height: 80px;
    }
  }
}
</style>
