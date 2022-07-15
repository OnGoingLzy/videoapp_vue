<template>
  <div class="login-container">
    <div style="display: inline-block">
      <van-image
          round
          width="10rem"
          height="10rem"
          :src="require('../assets/笑脸.png')"
      />
    </div>
    <div class="login-box">


        <van-field
            v-model="loginForm.email"
            name="邮箱"
            label="邮箱"
            placeholder="邮箱"
            :rules="[{ required: true, message: '请填写邮箱' }]"
        />
        <van-field
            v-model="loginForm.cpwd"
            type="password"
            name="密码"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      <van-cell center title="请记住我" class="box">
        <template #right-icon>
          <van-switch v-model="remember" size="24" active-color="#8470FF"/>
        </template>
      </van-cell>
        <div style="margin: 10px;vertical-align: middle;text-align: center">
          <van-button round block type="info" @click="onSubmit" color="#8470FF" style="margin:8px;width: 100px;display: inline-block">登录</van-button>
          <van-button round block type="info" @click="onRegister" color="#8470FF" style="width: 100px;display: inline-block">注册</van-button>
        </div>
    </div>

  </div>
</template>

<script>
export default {
  inject: ['reload','setVisible'],
  name: "login",
  data() {
    return {
      remember:false,
      loginForm: {
        email: 'admin@lzy.com',
        cpwd: '666',
      },
      user:[],
    };
  },
  mounted() {
    if(localStorage.getItem("cid")!==null){
      // sessionStorage.setItem("cid",localStorage.getItem("cid"))
    }
  },
  methods: {
    onRegister(){
      this.$router.push('/register')
    },
    async onSubmit() {
      if(this.loginForm.email==="admin" && this.loginForm.cpwd==="666"){
        sessionStorage.setItem("cid","404")
        sessionStorage.setItem("cname","离线管理员")
        sessionStorage.setItem("currentPage",'1')
        this.reload()
        this.$router.push('/')
        return
      }
      const {data: res} = await this.$http.post("/login",this.loginForm);  //出现undifine是data写成date
      this.user = res
      if(res !== ""){
        this.$store.commit('upUserData',res)
        sessionStorage.setItem("cid",res.cid)
        sessionStorage.setItem("cname",res.cname)
        sessionStorage.setItem("email",res.email)
        sessionStorage.setItem("ctype",res.ctype)
        sessionStorage.setItem("currentPage",'1')
        if(this.remember===true){
          localStorage.setItem("cid",res.cid)
        }
        const {data: res2} = await this.$http.post("/getMsgImg", String(res.cid));//不能使用int型
        if (res !== "") {
          sessionStorage.setItem('cAvatar', res2.avatarName)
        } else {
          sessionStorage.setItem('cAvatar','default.png')
        }

        sessionStorage.setItem("active",0)
        this.reload()
        this.setVisible(true)
        this.$router.push('/')

      }else {
        console.log(sessionStorage.getItem('cid'))
        this.mounted()
      }
    },

    mounted() {//弹窗
      this.$dialog.alert({
        message: '登录失败,请检查用户名或密码是否正确！',
      });
    },
  },
}
</script>

<style lang="less" scoped>
  .login-container{
    margin-top: 25%;
    margin-left: 25px;
    margin-right: 25px;
    padding-bottom: 25px;
    vertical-align: middle;
    text-align: center;
    background: rgba(242, 243, 245, 0.99);
    box-shadow: 0 1px 1px darkgrey;
    border-radius: 6px;
  }
  .login-box{
    padding: 10px;
  }
</style>
