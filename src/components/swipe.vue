<template>
  <div class="swipe">
    <van-swipe :autoplay="3000" indicator-color="#8470ff" >
      <van-swipe-item v-for="(image, index) in images" :key="index" >
<!--        <img v-lazy="image" />-->
        <van-image
            width="100%"
            height="100%"
            fit="fill"
            lazy-load
            :src="image"
        />
      </van-swipe-item>
    </van-swipe>

  </div>
</template>

<script>



export default {
  name: "swipe",
  components:{

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
      height: 100%;
    }
  }
  .van-swipe-item{
    margin: 0;
    height: auto;
  }
</style>
