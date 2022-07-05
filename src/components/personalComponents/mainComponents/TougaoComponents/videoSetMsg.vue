<template>
  <div class="video-msg-set">
    <van-form>
      <div class="upload-img-box">
        <div class="upload-img-box-text">
          <span style="font-size: 14px;color: #4b4b4b;">视频封面</span>
        </div>
        <van-uploader v-model="img"
                      accept="image/*"
                      max-count="1"
                      :after-read="selectAfter"
                      preview-size="100px"
                      :deletable="deletable"
                      :preview-image=true
                      :max-size="4096 * 1024" @oversize="onOversize"
                      @delete="deleteImg"

        >
        </van-uploader>
      </div>
      <van-field
          v-model="formData.videoName"
          name="videoName"
          label="视频标题"
          placeholder="视频标题"
          :rules="[{ required: true, message: '请填写视频标题' }]"
      />

      <van-dropdown-menu>
        <van-dropdown-item  title="分类">
          <van-radio-group v-model="formData.category" >
            <van-cell-group>
            <!--          循环遍历分类-->
              <div v-for="(catgr,index) of categories" :key=index>
               <van-cell :title="catgr" clickable @click="formData.category = catgr" >
                 <template #right-icon>
                   <van-radio :name="catgr" />
                 </template>
              </van-cell>
             </div>
            </van-cell-group>
          </van-radio-group>
        </van-dropdown-item>
        <van-dropdown-item title="标签" ref="tag" >
          <van-checkbox-group v-model="formData.tagResult" @change="">
            <van-cell-group>
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
        </van-dropdown-item>
      </van-dropdown-menu>

      <div class="video-msg ">
        分类:<van-tag type="warning" style="margin: 4px" mark size="medium" v-if="formData.category!==null">{{formData.category}}</van-tag><span style="color: red" v-if="formData.category==null">请选择分类</span>
        <br>
        标签:<van-tag style="margin: 4px" mark size="medium" type="primary" v-for="(item,index) of formData.tagResult">{{item}}</van-tag>
      </div>
      <van-field
          v-model="formData.description"
          rows="2"
          autosize
          label="介绍"
          type="textarea"
          maxlength="50"
          placeholder="请留下一下介绍"
          show-word-limit
      />

    </van-form>
    <div class="button-box">
      <van-button round type="info" @click="this.toPrevious" color="#8470FF">上一步</van-button>
      <van-button round type="info" @click="submitVideo" color="#8470FF">投稿</van-button>
    </div>
    <van-overlay :show="show" >
      <div class="wrapper">
        <div class="block" >
          <van-loading size="24px">投稿中...</van-loading>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import bus from "@/bus";
import {Dialog, Notify, Toast} from "vant";

export default {
  inject:['toNext','toPrevious','toSuccess','tougaoReload'],
  name: "videoSetMsg",
  data(){
    return{
      show: false,
      img: [],
      deletable: true,
      allTagList: null,
      categories: null,
      coverImg: null,
      formData:{
        cid:null,
        videoName: null,
        category: null,
        tagResult: ["默认"],
        videoPath: null,
        description: null,
      },
    }
  },
  created() {
    bus.$on('videoPath',vn=>{
      console.log("videoPath:"+vn)
      this.formData.videoPath = vn
    })
  },
  methods:{
    deleteImg(){
      this.coverImg = null;
    },
    onOversize(){
      Toast('封面大小不能超过 4Mb');
    },
    async getVideoCategoriesAndTag(){
      const {data : res} = await this.$http.get("/getVideoCategories")
      const {data : res2} = await this.$http.get("/getVideoTag")
      this.allTagList = res2
      this.categories = res;
      console.log("视频分类"+res)
      console.log("视频标签"+res2)
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    selectAfter(file) {
      this.coverImg  = file.file
    },
    async submitVideo() {
      if(this.formData.category==null || this.formData.videoName===""){
        Toast('请填写标题,选择分类');
        return
      }
      const formData = new FormData() // 创建form对象
      if(this.coverImg==null){
        let file;
        file = new File([], "defaultCover.png", undefined);
        formData.append('coverImg', file)
      }else formData.append('coverImg', this.coverImg)
      formData.append('cid',this.formData.cid)
      formData.append('videoName', this.formData.videoName)
      formData.append('videoPath',this.formData.videoPath)
      formData.append('tagResult',this.formData.tagResult)
      formData.append('description',this.formData.description)
      formData.append('category',this.formData.category)
      await this.$http.post("submitVideo", formData,{
            headers: {
                    "Content-Type": "multipart/form-data"
                  },
          }
      ).then(async res => {
          console.log(res.data)
          if (res.data){
            await Dialog.alert({
              title: '投稿成功',
              message: '等待审核,你可以前往个人中心查看投稿内容!'
            }).then(()=>{
              sessionStorage.setItem("uploadState",'false')
              this.tougaoReload()
              this.$router.push("videoUpload")
            })

          }else {
            Toast('上传失败');
          }
      })
    }
  },
  async mounted() {
    await this.getVideoCategoriesAndTag()
    const {data: res} = await this.$http.post('getPreUploadMsg', String(sessionStorage.getItem('cid')))
    this.formData.videoPath = res.videourl
    this.formData.cid = sessionStorage.getItem("cid")
  },

}
</script>

<style lang="less" scoped>
 .video-msg-set{
   min-height: 500px;
   background-color: #fcfcfc;
   .video-msg{
     padding-left: 16px;
     width: 100%;
     vertical-align: middle;
     font-size: 14px;color: #4b4b4b;
   }
   .button-box{
     padding: 10px;
     /*垂直居中 */
     vertical-align: middle;
     /*水平居中*/
     text-align: center;

     .van-button{
       width: 140px;
       margin-left: 15px;
       margin-right: 15px;
     }
   }
   .upload-img-box{
     padding-left: 16px;
     padding-right: 16px;
      display: flex;
     /*垂直居中 */
     .upload-img-box-text{
       width: 98px;
       vertical-align: middle;

     }
   }
   .wrapper {
     display: flex;
     align-items: center;
     justify-content: center;
     height: 100%;
   }

   .block {
     width: 120px;
     height: 120px;
   }


 }
</style>
