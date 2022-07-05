<template>
  <div>
    <van-popup v-model="show"
               round
               :style="{ width:'80%',height:'50%'}"
               @close="clickclose"
    >
      <div style="padding-top: 20px;text-align: center;vertical-align: middle">
        <div style="display: inline-block">
          <van-image
              round
              width="8rem"
              height="8rem"
              :src="require('../assets/注册.png')"
          />
        </div>
        <van-field
            class="box"
            v-model.trim="regData.cname"
            error
            required
            label="用户名"
            placeholder="请输入用户名"
        />
        <van-field
            class="box"
            v-model.trim="regData.email"
            error
            required
            label="邮箱"
            placeholder="请输入邮箱"
        />
        <van-field
            class="box"
            v-model="regData.cpwd"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 10px;vertical-align: middle;text-align: center">
          <van-button round block type="info" @click="onRegister" color="#8470FF" style="width: 100px;display: inline-block">注册</van-button>
        </div>

      </div>
    </van-popup>
  </div>
</template>

<script>
import {Toast} from "vant";

export default {
  name: "register",
  data(){
    return{
      show:true,
      regData:{
        cname:null,
        email:null,
        cpwd:null,
      }
    }
  },
  methods:{
    clickclose(){
      this.$router.push('/login')
    },
    async onRegister() {
      if(this.regData.cname==="" ||this.regData.email==="" ||this.regData.cpwd===""){
        Toast("请填写信息")
        return
      }
      await this.$http.post("register", this.regData).then(res=>{
        if(res.data===true){
          Toast("注册成功!")
          this.$router.push("/login")
        }else {
          Toast("注册失败")
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    display: inline-block;
  }
</style>
