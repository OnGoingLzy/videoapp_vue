<template>
  <div class="PersonalSpace">
<!--      <SpaceHeader v-if="key===0" ></SpaceHeader>-->

      <personalBackground v-if="key3===2"></personalBackground>
      <personal-message v-if="key3===2"></personal-message>
      <personalBar v-if="key===0"></personalBar>
    <keep-alive include="MainMyTougao,MainZhuye">
    <router-view v-if="key===0"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import SpaceHeader from "@/components/personalComponents/SpaceHeader";
import personalBackground from "@/components/personalComponents/HeaderComponents/personalBackground";
import personalMessage from "@/components/personalComponents/HeaderComponents/personalMessage";
import personalBar from "@/components/personalComponents/HeaderComponents/personalBar";

export default {
  inject:['setVisible'],
  name: "PersonalSpace",
  provide(){
    return{
      changeBar : this.changeBar,
      reloadmsg : this.reloadmsg
    }
  },
  data(){
    return{
      key: 0,
      key2:1,
      key3:2,

    }
  } ,
  methods:{
    changeBar(x){
      this.key = x
      this.$nextTick(function(){
        this.key = 0
      })
    },
    reloadmsg(){
      this.key3 = 3
      this.$nextTick(function(){
        this.key3 = 2
      })
    }
  },
  components:{
    SpaceHeader,
    personalBackground,
    personalMessage,
    personalBar
  },
  mounted() {
    this.setVisible(false)//防止F5刷新时组件被销毁visible变成默认的true导致出现header组件
    if(sessionStorage.getItem("personalActive")==='0'){
      this.$router.push('/personalSpace')
    }else if(sessionStorage.getItem("personalActive")==='1'){
      this.$router.push('/personalSpace/myTougao')
    }else if(sessionStorage.getItem("personalActive")==='2'){
      this.$router.push('/personalSpace/shoucang')
    }else {
      this.$router.push('/personalSpace')
    }

  }
}
</script>

<style  scoped>
  .PersonalSpace{
    min-height: 800px;
    background-color: #F2F3F5;
  }
</style>
