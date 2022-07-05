<template>
  <div class="bar" :key="key">

<!--    <van-row>-->

<!--      <van-tabbar v-model="active" @change="onChange" @fixed=false>-->
<!--        <van-tabbar-item icon="wap-home-o">主页</van-tabbar-item>-->
<!--        <van-tabbar-item icon="friends-o">投稿</van-tabbar-item>-->
<!--        <van-tabbar-item icon="add">收藏</van-tabbar-item>-->
<!--      </van-tabbar>-->
<!--    </van-row>-->

    <van-row>
      <van-col span="8" class="icondiv" @click="onChange(0)">
        <van-icon name="qr" size="25" ref="b0" color="#8470FF" v-if="active===0"/>
        <van-icon name="qr" size="25" ref="b0"  v-if="active!==0"/>
        <p class="icondiv-p2" v-if="active===0">主页</p>
        <p class="icondiv-p" v-if="active!==0">主页</p>
      </van-col>
      <van-col span="8" class="icondiv" @click="onChange(1)">
        <van-icon name="send-gift-o" size="25" ref="1" color="#8470FF" v-if="active===1"/>
        <van-icon name="send-gift-o" size="25" ref="1"  v-if="active!==1"/>
        <p class="icondiv-p2" v-if="active===1">我的投稿</p>
        <p class="icondiv-p" v-if="active!==1">我的投稿</p>
      </van-col>
      <van-col span="8" class="icondiv" @click="onChange(2)">
        <van-icon name="star-o" size="25" ref="2" color="#8470FF" v-if="active===2"/>
        <van-icon name="star-o" size="25" ref="2"  v-if="active!==2"/>
        <p class="icondiv-p2" v-if="active===2">收藏</p>
        <p class="icondiv-p" v-if="active!==2">收藏</p>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import bus from "@/bus";

export default {
  name: "personalBar",
  props:['active_'],
  data(){
    return{
      cid: 0,
      active: 0,
      key:0,
    }
  },
  methods:{
    onChange(name){

      if(name===this.active)return
      if(name===0){
        this.$router.push('zhuye')
        this.active=0
        sessionStorage.setItem('personalActive','0')
      }
      if(name===1){
        this.$router.push('myTougao')
        this.active=1
        sessionStorage.setItem('personalActive','1')
      }
      if(name===2){
        this.$router.push('shoucang')
        this.active=2
        sessionStorage.setItem('personalActive','2')
      }
    },


//注意:上面子路由中加不加‘/’ 的区别：加 ‘/'会在地址栏中显示 #/xx 跑到第一级路由了;不加 ‘/'的时候回在地址栏中显示#/personalSpace/xx
  },
  mounted() {
    this.cid = sessionStorage.getItem('cid')
    if(Number(sessionStorage.getItem('personalActive'))!==null){
      this.active = Number(sessionStorage.getItem('personalActive'))
    }

  }

}
</script>

<style lang="less" scoped>
.bar{
  background-color: #fcfcfc;
}
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
  .icondiv-p2{
    margin: 0;
    color: #8470FF;
  }
}
</style>
