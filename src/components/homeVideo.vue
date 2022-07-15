<template>
  <div>

    <van-popup v-model="show1"
               round
               :style="{ width:'60%'}"
    >
      <van-radio-group v-model="category" @change="changeCategoryOrTag(searchSql)">

        <van-cell-group style="max-height: 400px">
          <van-cell title="默认" clickable @click="category = '默认'">
            <template #right-icon>
              <van-radio name="默认" />
            </template>
          </van-cell>
<!--          循环遍历分类-->
          <div v-for="(catgr,index) of categories" :key=index>
          <van-cell :title="catgr" clickable @click="category = catgr" >
            <template #right-icon>
              <van-radio :name="catgr" />
            </template>
          </van-cell>
          </div>

        </van-cell-group>


      </van-radio-group>

    </van-popup>
<!-- ----------------------------------------------->
    <van-popup v-model="show2"
               round
               :style="{ width:'60%'}"
    >

      <van-checkbox-group v-model="tagResult" @change="changeCategoryOrTag(searchSql)">
        <van-cell-group style="max-height: 400px">
          <van-cell
              v-for="(item, index) in allTagList"
              clickable
              :key="item"
              :title="`${item}`"
              @click="toggle(index)"
          >
<!--            点击cell执行toggle让checkbox勾选上，没有它点击cell是不会选中checkbox的-->
            <template #right-icon>
              <van-checkbox :name="item" ref="checkboxes" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>


    </van-popup>

    <van-row class="tag-box" type="flex" justify="space-around" >
      <van-col span="11" class="icondiv">
        <van-icon name="coupon-o"  size="35" @click="showPopup"/>
      </van-col>
      <van-col span="11" class="icondiv" @click="showPopup2">
        <van-icon name="label-o" size="35"/>
      </van-col>
    </van-row>

    <div class="video-msg ">
      <p class="video-msg-p">当前搜索: {{this.search}}</p>
      分类:<van-tag type="warning" mark size="medium">{{this.category}}</van-tag>
      <br>
      标签:<van-tag style="margin: 4px" mark size="medium" type="primary" v-for="(item,index) of this.tagResult">{{item}}</van-tag>
    </div>

    <div class="all-video-box" :key="videokey">
      <div><van-button plain hairline type="info" size="mini" @click="clearCTS">清除筛选</van-button></div>

      <div v-if="allVideoCount===0">
        <p>这里面空空如也</p>
      </div>

      <div class="video-box" v-for="(video,index) of videolist" :key="index" @click="toVideoFrame(video)">
        <div style="background: #e0e0e0;border-top-left-radius: 8px;border-top-right-radius: 8px;height: 80%">
          <van-image style="z-index: 1" radius="8px 8px 0px 0px" :src='"http://localhost:9000/videoCover/"+video.coverpath' width="100%" height="110px" fit="contain">
            <div style="z-index:2;margin-top: -30px;height: 30px;background: linear-gradient(to bottom,rgba(255,255,255,0),rgba(0,0,0,0.62))">
              <span style="color: #ffffff;display: flex;line-height: 35px;margin-left: 10px" v-text="Math.floor(Number(video.videoseconds)/60).toString().padStart(2, '0')+':'+(Number(video.videoseconds)%60).toString().padStart(2, '0')"></span>
            </div>
          </van-image>
        </div>

        <div class="van-ellipsis" style="width: 100%;text-align: left;height: 30px">
          <span class="video-box-p" >{{video.videoname}}</span>
        </div>
      </div>

    </div>

    <div class="video-page" :key="videokey+1">
      <van-pagination
          v-model="currentPage"
          :show-page-size="3"
          :total-items="this.allVideoCount"
          :items-per-page="4"
          force-ellipses
          @change="changePage"
      />
    </div>

  </div>
</template>

<script>

import {Notify} from "vant";
import bus from "@/bus";
import videoFrame from "@/components/videoFrame";
export default {
  inject:['setFVisible','setVisible'],
  name: "homeVideo",
  components:{
    videoFrame
  },
  provide(){
    return{
      returnHomeVideo: this.returnHomeVideo
    }
  },
  data(){
    return{
      search: null,
      videokey: 666,
      currentPage: 1,
      allVideoCount: 0,
      videolist: [],
      show1: false,
      show2: false,
      category: '默认' ,
      categories:[],
      tagResult: [],
      allTagList: ['无'],
      searchSql: null,
      selectVideo: null,
    }
  },
  mounted() {
    // this.getVideoList()  该功能已被淘汰，它只能查找所有视频
    this.search = sessionStorage.getItem("searchContent")
    this.searchSql = sessionStorage.getItem("searchSql")
    var sq =null;
    if(sessionStorage.getItem("searchSql")===''){
      sq = '';
    }else sq=sessionStorage.getItem("searchSql")
    console.log("当前searchsql"+sq)
    this.changeCategoryOrTag(sq) //查询视频功能的集合体
    this.getVideoCategoriesAndTag()
    sessionStorage.setItem("selectVideoId",null)
  },
  methods:{
    async getVideoList(){
      console.log("当前页:"+String(this.currentPage))
      const {data : vlist} = await this.$http.post("/videoListPage",String(this.currentPage));//传递的参数多个=号，暂未解决
      const {data : allcount} = await  this.$http.get("/getAllCount");
      this.allVideoCount = allcount
      this.videolist = vlist
      console.log("当前页videolist:"+this.videolist+" 所有数据有:"+allcount+"条")
      const {data : maxpage} = await this.$http.post("/getMaxPage");
    }, //获取视频 淘汰代码
    // async changePage() {
    //   console.log("页码改变了!当前页:"+String(this.currentPage))
    //   const {data: vlist} = await this.$http.post("/videoListPage", String(this.currentPage));//传递的参数多个=号，暂未解决
    //   const {data : allcount} = await  this.$http.get("/getAllCount");
    //   this.allVideoCount = allcount
    //   this.videolist = vlist
    //   this.videokey = 660
    //   this.$nextTick(function(){
    //     this.videokey = 666
    //   })
    // },   //切换页码
    async changePage() {
      console.log("页码改变了!当前页:"+String(this.currentPage))
      let shuju= {
        cpage: String(this.currentPage),
        category: this.category,
        tag: this.tagResult,
        searchSql: sessionStorage.getItem("searchSql"),
      }
      const {data: vlist} = await this.$http.post("/getVideoWithCategoryAndTag",shuju);
      const {data : allcount} = await  this.$http.post("/getAllCount2",shuju);
      this.allVideoCount = allcount
      this.videolist = vlist
      this.videokey = 660
      this.$nextTick(function(){
        this.videokey = 666
      })
    },   //切换页码
    showPopup() {
      this.show1 = true;
    },
    showPopup2() {
      this.show2 = true;
    },
    async getVideoCategoriesAndTag(){
      const {data : res} = await this.$http.get("/getVideoCategories")
      const {data : res2} = await this.$http.get("/getVideoTag")
      this.allTagList = res2
      this.categories = res;
      console.log("视频分类"+res)
      console.log("视频标签"+res2)
    },
    async changeCategoryOrTag(searchSql){

      this.currentPage = 1;
      let shuju= {
        cpage: String(this.currentPage),
        category: this.category,
        tag: this.tagResult,
        searchSql: searchSql,
      }
      const {data : videolist} = await this.$http.post("/getVideoWithCategoryAndTag",shuju)
      const {data : allcount} = await  this.$http.post("/getAllCount2",shuju);
      this.videolist = videolist
      this.allVideoCount = allcount;

      this.videokey = 660
      this.$nextTick(function(){
        this.videokey = 666
      })
    },
    clearCTS(){
      this.tagResult = []
      this.category = '默认'
      this.search= ''
      this.searchSql = ''
      sessionStorage.setItem("searchContent",'')
      sessionStorage.setItem("searchSql",'')
      this.changeCategoryOrTag(this.searchSql)
      this.videokey = 660
      this.$nextTick(function(){
        this.videokey = 666
      })
      Notify({ type: 'success', message: '清除筛选成功',duration: 1000});
    },
    toVideoFrame(video){
      this.selectVideo = video
      this.$router.push("videoFrame")
      sessionStorage.setItem("selectVideoId",video.videoid)
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    returnHomeVideo(){
      console
      this.selectVideo=null
      sessionStorage.setItem("selectVideoId",null)
    }
  },

}
</script>

<style lang="less" scoped>
  .all-video-box{
    min-height: 300px;
    ///*垂直居中 */
    //vertical-align: middle;
    /*水平居中*/
    text-align: center;
    padding-left: 5px;
    padding-right: 5px;
  }
  .video-page{
    padding-bottom: 66.8px;
    padding-right: 10.5px;
    padding-left: 10.5px;
    border-radius: 5px;
  }
  .video-box{
    //position:relative;
    width: 47%;
    height: 36%;
    //border: 1px solid #8470FF;
    box-shadow: 0 1px 1px darkgrey;
    background-color: #fcfcfc;
    margin: 5px;
    border-radius: 8px;
    display: inline-block;
    .video-box-p{
      padding: 8px;
      margin-block-start: 2px;
      margin-block-end: 0;
    }
  }
  .icondiv{
    background-color: rgba(132, 112, 255, 0.97);
    padding: 7.5px;
    display: table-cell;
    /*垂直居中 */
    vertical-align: middle;
    /*水平居中*/
    text-align: center;
    border-radius: 5px;
    .icondiv-p{
      margin: 0;
    }
  }
  .video-msg{
    background-color: #fcfcfc;
    margin: 8px 12px;
    box-shadow: 0 1px 1px darkgrey;
    border-radius: 5px;
    .video-msg-p{
      background-color: #fcfcfc;
      margin-block-start: 5px;
      margin-block-end: 0;
      border-radius: 2px;
    }
  }
  .tag-box{
    padding-left: 10.5px;padding-right: 10.5px;
    height: 50px;
    /*垂直居中 */
    vertical-align: middle;
    /*水平居中*/
    text-align: center;
  }


</style>
