<template>
  <div class="edit-box">
    <van-field
        class="box"
        v-model.trim="cname"
        error
        required
        label="昵称"
        placeholder="请输入昵称"
    />
    <van-field
        class="box"
        v-model="introduction"
        rows="2"
        autosize
        label="简介"
        type="textarea"
        maxlength="50"
        placeholder="可填写简介"
        show-word-limit
    />
    <div style="width: 100%;display: inline-block;vertical-align: middle;text-align: center">
      <van-button round type="info" color="#8470FF" @click="updateMsg">确认修改</van-button>
    </div>

  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  inject:['changeBar'],
  name: "mainEditMsg",
  data(){
    return{
      cname:null,
      introduction:null,
    }
  },
  methods:{
    async updateMsg() {
      let formData = new FormData
      formData.append("cid", sessionStorage.getItem("cid"))
      formData.append("cname", this.cname)
      formData.append("introduction", this.introduction)
      await this.$http.post("updateMsg", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        if(res.data===true){
          Toast("修改成功!")
          this.changeBar()
          this.$router.push('zhuye')
        }else {
          Toast("修改失败")
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
  .edit-box{
    margin-top: 10px;
    padding-bottom: 20px;
    background: #fcfcfc;
  }
</style>
