<template>
  <div class="footer_">
    <van-row>

      <van-tabbar v-model="active" @change="onChange">
        <van-tabbar-item icon="wap-home-o">首页</van-tabbar-item>
        <van-tabbar-item icon="friends-o">社区</van-tabbar-item>
        <van-tabbar-item icon="add">创作</van-tabbar-item>
        <van-tabbar-item icon="manager-o">我的</van-tabbar-item>
        <van-tabbar-item icon="guanliyuan" v-if="ctype==='3'">管理中心</van-tabbar-item>
      </van-tabbar>
    </van-row>
    <!-- 开启底部安全区适配 -->
    <van-number-keyboard safe-area-inset-bottom />

  </div>
</template>

<script>
import {Notify} from "vant";

export default {
  name: "footer_",
  props:{
    // cvisible: Boolean
  },
  provide(){
    return{
      setActive: this.setActive
    }
  },
  mounted() {
    this.active = Number(sessionStorage.getItem("active"))
  },
  data(){
    return{
      active: 0,
      ctype: sessionStorage.getItem('ctype'),
    }
  },
  methods:{
    setActive(x){
      this.active = x
    },

    onChange(name){

      if(name===0){
        this.$emit('visibleEvent',true)
        sessionStorage.setItem("active",'0')
        this.$router.push('/')
      }
      if(name===2){
        this.$emit('visibleEvent',false)
        sessionStorage.setItem("active",'2')
        if(sessionStorage.getItem("uploadState")==='1'){
          this.$router.push('/tougao/videoSetMsg')
        }else this.$router.push('/tougao')
      }
      if(name===3){
        this.$emit('visibleEvent',false) //点击后传递false给app.vue隐藏header
        sessionStorage.setItem("active",'3')
        this.$router.push('/personalSpace')
      }
      if(name===4){
        this.$emit('visibleEvent',false) //点击后传递false给app.vue隐藏header
        sessionStorage.setItem("active",'4')
        this.$router.push('/adminManagement')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icondiv{
  padding: 6px;
  display: table-cell;
  /*垂直居中 */
  vertical-align: middle;
  /*水平居中*/
  text-align: center;
  .icondiv-p{
    margin: 0;
  }
}
.footer_{
  width: 100%;
  position: fixed;
  bottom:0;
  background-color: #fcfcfc;
}
</style>
