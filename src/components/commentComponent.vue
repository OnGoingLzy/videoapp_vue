<template>
  <div class="comment-box" v-if="commenter!==null">
    <van-image
        class="comment-box-avatar"
        width="40px"
        height="40px"
        round
        :src="'http://localhost:9000/avatar/'+commenter.avatarName"
    />
    <div><span style="color: #8470FF">{{commenter.cname}}</span></div>
    <div>{{comment.date}}</div>
    <div class="comment-box-root">
      <div class="comment-box-root-content">
        <span style="font-weight: bolder">{{comment.content}}</span>
      </div>
      <div class="comment-box-root-statusbar">
          <van-icon name="good-job-o" size="20px" style="display: inline-block;"/>
          <p style="margin: 0;display: inline-block">{{comment.belikecounts}}</p>
        <van-icon name="chat-o" size="20px" style="margin-left:10px;display: inline-block" @click="replyComment(commenter.cid,commenter.cname)"/>
      </div>


      <div class="comment-box-son" v-if="commentlist!==''">
        <div v-for="(son,index) of commentlist" :key="index" >
          <span style="color: #8470FF">用户{{son.cid}}</span>
          <span>:{{son.content}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "commentComponent",
  inject:["replyComment"],
  props:["comment"],
  data(){
    return{
      commenter:null,
      commentlist:null,
    }
  },
  methods:{

  },
  async beforeMount() {
    await this.$http.post("getMsgImg", this.comment.cid).then(res => {
      this.commenter = res.data
    })

    let formData = new FormData
    formData.append("videoid",this.comment.videoid)
    formData.append("tocid",this.comment.cid)
    await this.$http.post("getCommentReply", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }).then(res=>{
      this.commentlist = res.data
    }).catch((error)=>{

    })


  }
}
</script>

<style lang="less" scoped>
//@import "src/assets/CSS/global";
.comment-box{
  padding-left: 50px;
  padding-top: 15px;
  .comment-box-avatar{
    margin-left: -45px;
    position: absolute;
  }
  .comment-box-root{
    padding-top: 5px;
    width: 100%;
    min-height: 40px;
    .comment-box-root-statusbar{
      padding-top: 20px;
    }
    .comment-box-son{
      margin-top: 10px;
      width: 97%;
      border-radius: 5px;
      background: #dfe1e1;
      min-height: 50px;
      max-height: 100px;
    }
  }
}
</style>
