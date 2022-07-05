
<template>

  <div id="app">
    <!-- 开启顶部安全区适配 -->
<!--    <van-nav-bar safe-area-inset-top />-->
    <header_
        :key="headerkey"
        v-show="cvisible"
        @visibleEvent="showComponents"
    ></header_>
<!--    <button @click="showComponents(true)">显示</button>-->
<!--    <button @click="showComponents(false)">隐藏</button>-->
<!--    keepalive会缓存组件而不是销毁 其中key是用来控制刷新的，以免出现退出登录后但还是保持存活 -->
    <keep-alive include="HomeView" v-if="headerkey === 0">
    <router-view :key="headerkey+1" @visibleEvent="showComponents" >
    </router-view>
      </keep-alive>
<!--    @visibleEvent在哪个组件里就代表 该组件中触发Event传递的参数给父组件,这是实现隐藏组件的第一种方式
        局限性:只能接受一代子组件触发事件,隔代无法通过@visbleEvent直接传给祖宗，只能每一代都设计@Event，太麻烦
        故第二种方式位于 provide里，注入子组件方法改变祖宗组件的值
-->
    <footer_ :key="footerkey+2" v-show="fvisible"
        @visibleEvent="showComponents"
    ></footer_>


  </div>

</template>
<script>
  import header_ from "@/components/header_";
  import login from "@/components/login";
  import HomeView from "@/views/HomeView";
  import footer_ from "@/components/footer_";
  import '@vant/touch-emulator';//组件只监听了移动端的 touch 事件，没有监听桌面端的 mouse 事件。使用他适配
  export default {
    //该provide里的reload用于子组件调用父组件中的reload函数刷新key值达到刷新组件的目的
    provide () {
      return{
        reload: this.reload,  //在其他组件注入reload，可以刷新界面
        setVisible: this.setVisible, //在其他组件注入，可以在某个组件设置是否隐藏某个组件 这种方式为第二种
        setFVisible: this.setFVisible,
        footerReload : this.footerReload,
      }
    },
    data() {
      return {
        headerkey: 0,
        footerkey: 4,
        cvisible: true, //header是否显示
        fvisible: true, //footer是否显示
      };
    },
    components:{
      header_,
      footer_,
      login,
      HomeView
    },
    methods:{
      footerReload(){
        this.footerkey = 5
        this.$nextTick(function(){
          this.footerkey = 4
        })
      },
      reload(){//key改变时会刷新组件
        this.headerkey = 1
        this.footerkey = 5
        this.$nextTick(function(){
          this.headerkey = 0
          this.footerkey = 4
        })
      },
      showComponents(x){
        this.cvisible = x
      },
      setVisible(x){
        this.cvisible = x
      },
      setFVisible(x){
        this.fvisible = x
      }
    },
    mounted() { //挂载是在组件生成前就执行的
    }
  }
</script>
<style lang="less" scoped>
  .app{
    background-color: #F2F3F5;
  }
</style>
