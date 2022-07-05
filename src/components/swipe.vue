<template>
  <div class="swipe">
    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in images" :key="index" >
        <img v-lazy="image" />
      </van-swipe-item>
    </van-swipe>
<!--    三级嵌套<hello-world></hello-world>-->
  </div>
</template>

<script>

import HelloWorld from "@/components/HelloWorld";

export default {
  name: "swipe",
  components:{
      HelloWorld
  },
  data() {
    return {
      images: [
        'http://localhost:9000/lunBoImg/2.png',
        'http://localhost:9000/lunBoImg/4.png',
        'http://localhost:9000/lunBoImg/1.png',
        'http://localhost:9000/lunBoImg/3.png',
      ],
    };
  },
}
</script>

<style lang="less" scoped>
  .swipe{
    padding: 10.5px;
    /*垂直居中 */
    vertical-align: middle;
    /*水平居中*/
    text-align: center;
    img{
      box-shadow: 0 1px 1px darkgrey;
      border-radius: 5px;
      width: 100%;
      height: 206px;
    }
  }
</style>
