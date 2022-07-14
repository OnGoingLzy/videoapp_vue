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
          <van-icon name="good-job-o" size="20px" style="display: inline-block;"/>
          <p style="margin: 0;display: inline-block">{{comment.belikecounts}}</p>
          <van-icon name="chat-o" size="20px" style="margin-left:10px;display: inline-block" @click="replyComment(commenter.cid,commenter.cname)"/>
        </div>


        <div class="comment-box-son" v-if="commentlist!==''" style="overflow: auto">
          <div v-for="(son,index) of commentlist" :key="index" >
            <span style="color: #8470FF">用户{{son.cid}}</span>
            <span>:{{son.content}}</span>
          </div>
        </div>
      </div>
    </div>
    <hr/>
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
      padding-top: 20px;
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
