<template>
  <div class="personalSpace">
      <SpaceHeader :key="key"></SpaceHeader>

        <router-view></router-view>


  </div>
</template>

<script>
import SpaceHeader from "@/components/personalComponents/SpaceHeader";

export default {
  inject:['setVisible'],
  name: "personalSpace",
  provide(){
    return{
      changeBar : this.changeBar
    }
  },
  data(){
    return{
      key: 0
    }
  } ,
  methods:{
    changeBar(x){
      this.key = x
      this.$nextTick(function(){
        this.key = 0
      })
    }
  },
  components:{
    SpaceHeader,
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
  .personalSpace{
    min-height: 800px;
    background-color: #F2F3F5;
  }
</style>
