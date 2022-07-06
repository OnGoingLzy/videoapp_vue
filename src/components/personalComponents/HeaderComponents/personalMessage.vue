<template>
  <div class="pmsg-box">
    <van-row>
      <van-col span="5" class="pmsg-box-img" v-if="cid === 0">
        <div class="child" />
        <van-icon name="user-circle-o" size="50" @click="iconClick" />
      </van-col>
      <van-col span="5" v-if="cid !== 0" class="pmsg-box-img">
        <van-image
            round
            width="60"
            height="60"
            :src='"http://localhost:9000/avatar/"+cAvatar'
        />
      </van-col>
      <van-col span="8" class="pmsg-box-name">
        <div style="padding-top: 10px">
          <span class="pmsg-box-name-span">{{userMsg.cname}}</span>
        </div>
          <van-image
              width="20"
              height="20"
              :src="require('../../../assets/管理员.png')"
              style="padding-top: 10px"
              v-if="ctype==='3'"
          />
      </van-col>


      <van-col span="8" class="pmsg-edit-box">
        <div >
          _____________
        </div>
        <div style="padding-top: 10px">
          <van-button style="height: 25px;width: 120px" color="#8470FF" plain type="primary" @click="toEdit">编辑资料</van-button>
        </div>
      </van-col>
    </van-row>
    <div class="introduction">
      <p style="margin: 0">{{userMsg.introduction}}</p>
    </div>
  </div>
</template>

<script>

import bus from "@/bus";

export default {
  inject: ['reload','setVisible','reloadBar'],
  name: "personalMessage",
  data(){
    return{
      cAvatar: 'default.png',
      cid: 0,
      cname: '请先登录',
      userMsg:[],
      ctype: sessionStorage.getItem('ctype'),
    }
  },
  methods:{
    iconClick(){
      this.setVisible(true)
      this.$router.push('/login')
    },
    toEdit(){
      sessionStorage.setItem('personalActive','0')
      this.reloadBar()
      this.$router.push('editMsg')
    }
  },
  async mounted() {
    this.cid = Number(sessionStorage.getItem('cid'))  //一定要转换类型
    if (this.cid === 404) {
      this.cAvatar = "default.png"
    } else this.cAvatar = sessionStorage.getItem("cAvatar")

    this.cname = sessionStorage.getItem('cname')
    if (this.cid === 404) {
      this.cname = "离线管理"
    }
    await this.$http.post("getMsgImg", this.cid).then(res=>{
      this.userMsg = res.data
    })

  }
}
</script>

<style lang="less" scoped>
  .pmsg-box{
    background-color: #fcfcfc;
    //margin-top: -10px;
    .pmsg-box-img{
      padding-left: 15px;
      padding-right: 15px;
    }
    .pmsg-box-name{
      width: 44%;
      height: 100%;
      display: table-cell;
      /*垂直居中 */
      vertical-align: middle;
      .pmsg-box-name-span{
        font-weight: bold;
        font-size: 14px;
      }
    }
    .pmsg-edit-box{
      padding-top: 5px;
      /*水平居中*/
      text-align: center;
    }
  }
  .introduction{
    width: 300px;
    padding: 10px 15px 10px 30px;
  }
</style>
