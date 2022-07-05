<template>
  <div class="home">
    <swipe></swipe>
    <home-video></home-video>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import swipe from "@/components/swipe";
import homeVideo from "@/components/homeVideo";

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    swipe,
    homeVideo,
  },
  data(){
    return{
      cid: '',
      cname: '',

    }
  },
  // created() {
  //   this.user = this.$store.state.user
  // },
  mounted() {
    this.cid = sessionStorage.getItem('cid')
    this.cname = sessionStorage.getItem('cname')
  },
  methods:{

  }

}
</script>
<style lang="less" scoped>
  .home{
    background-color: #F2F3F5;
    height: 100%;
  }
</style>
