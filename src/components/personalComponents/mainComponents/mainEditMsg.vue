<template>
  <div class="edit-box">
<!--    <van-uploader v-model="img"-->
<!--                  accept="image/*"-->
<!--                  max-count="1"-->
<!--                  :after-read="selectAfter"-->
<!--                  preview-size="100px"-->
<!--                  :deletable="coverImg = null"-->
<!--                  :preview-image=true-->
<!--                  :max-size="4096 * 1024" @oversize="onOversize"-->
<!--                  @delete="coverImg = null"-->

<!--    />-->
    <div class="upload-img-box">
      <div class="upload-img-box-text">
        <span style="font-size: 14px;color: #4b4b4b;line-height: 88px">头像</span>
      </div>
      <van-uploader
                    :after-read="selectAvatarAfter"
                    v-model="img"
                    accept="image/*"
                    preview-size="100px"
                    :deletable="deletable"
                    max-count="1"
                    :preview-image=true
                    @delete="AvatarImg = null"
                    :max-size="4096 * 1024" @oversize="onOversize"

      />
    </div>
    <div class="upload-img-box">
      <div class="upload-img-box-text">
        <span style="font-size: 14px;color: #4b4b4b;line-height: 88px">封面</span>
      </div>
      <van-uploader
          :after-read="selectBKGAfter"
          v-model="BKG"
          accept="image/*"
          preview-size="100px"
          :deletable="deletable"
          max-count="1"
          :preview-image=true
          @delete="BKGImg = null"
          :max-size="10240 * 1024" @oversize="onOversize2"

      />
    </div>
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
  inject:['changeBar','reload','reloadmsg'],
  name: "mainEditMsg",
  data(){
    return{
      deletable:true,
      cname:null,
      introduction:null,
      img:[],
      BKG:[],
      BKGImg: null,
      AvatarImg: null,
    }
  },
  methods:{
    selectAvatarAfter(file){
      this.AvatarImg  = file.file
    },
    onOversize(){
      Toast('头像大小不能超过 4Mb');
    },
    selectBKGAfter(file){
      this.BKGImg  = file.file
      console.log(this.BKGImg)
    },
    onOversize2(){
      Toast('背景大小不能超过 10Mb');
    },
    async updateMsg() {
      let formData = new FormData
      formData.append("cid", sessionStorage.getItem("cid"))
      formData.append("cname", this.cname)
      formData.append("introduction", this.introduction)
      if(this.AvatarImg==null){
        let file;
        file = new File([], "default.png", undefined);
        formData.append('avatar', file)
      }else formData.append('avatar', this.AvatarImg)
      if(this.BKGImg==null){
        let file;
        file = new File([], "defaultBkg.png", undefined);
        formData.append('bkg', file)
      }else formData.append('bkg', this.BKGImg)

      await this.$http.post("updateMsg", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        if(res.data==='success'){
          Toast("修改成功!")
          this.$http.post("getMsgImg",sessionStorage.getItem("cid")).then(res=>{
            sessionStorage.setItem("cbkg",res.bkgName)
            sessionStorage.setItem("cAvatar",res.avatarName)
          })
          this.reloadmsg()
          this.changeBar()
          this.$router.push('zhuye')
        }else {
          Toast("修改失败"+res.data)
        }
      }).catch(error=>{
        Toast("出现了一个意外错误")
      })
    },

  }
}
</script>

<style lang="less" scoped>
  .edit-box{
    margin-top: 10px;
    padding-top: 10px;
    padding-bottom: 20px;
    background: #fcfcfc;
  }
  .upload-img-box{
    padding-left: 16px;
    padding-right: 16px;
    display: flex;
    /*垂直居中 */
    .upload-img-box-text{
      width: 98px;
      vertical-align: middle;

    }
  }
</style>
