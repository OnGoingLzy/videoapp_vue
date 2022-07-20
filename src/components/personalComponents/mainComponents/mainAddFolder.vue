<template>
  <div>
    <van-nav-bar
        title="创建"
        left-text=""
        right-text="完成"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
      <van-field
          class="box"
        v-model.trim="folderName"
        error
        required
        label="名称"
        placeholder="请输入名称"
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

    <van-cell center title="公开" class="box">
      <template #right-icon>
        <van-switch v-model="limit" size="24" active-color="#8470FF"/>
      </template>
    </van-cell>

  </div>

</template>

<script>
import {Dialog, Toast} from "vant";

export default {
  name: "mainAddFolder",
  inject:['returnPopup'],
  props:['showBar'],
  data(){
    return{
      folderName:null,
      introduction: null,
      limit: true,
    }
  },
  mounted() {
    // sessionStorage.setItem("personalActive",'2')
    // sessionStorage.setItem("active",'3')
    // this.changeBar(2)
    // this.footerReload()
  },
  methods:{
    onClickLeft(){
      this.returnPopup()
    },
    async onClickRight() {
      if (this.folderName === "") {
        Toast("请输入文件名称")
        return
      }
      let formData = new FormData()
      formData.append("cid",sessionStorage.getItem("cid"))
      formData.append("folderName",this.folderName)
      formData.append("introduction",this.introduction)
      formData.append("limit",this.limit)
      await this.$http.post("addFolder",formData,{
        headers:{
          "Content-Type": "multipart/form-data"
        }
      }).then(res=>{
        console.log(res)
        if(res.data===true){
          Dialog.alert({
            title: '创建',
            message: '创建收藏夹成功',
            theme: 'round-button',
            confirmButtonColor:"#8470ff"
          }).then(() => {
            // this.$router.back()
            this.returnPopup()
          });

        }
      })

    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    margin-top: 7px;
  }
</style>
