<template>
  <div>
    <van-image
        width="100%"
        height="24%"
        fit="fill"
        :src='"http://localhost:9000/personalBackground/"+bkgImg'
    />
  </div>
</template>

<script>
export default {
  name: "personalBackground",
  data(){
    return{
      bkgImg: "defaultBkg.png"
    }
  },
  mounted() {
    if (sessionStorage.getItem('cid') !== null) {
      this.$http.post("getMsgImg", sessionStorage.getItem('cid')).then(res => {
        this.bkgImg = res.data.bkgName
      })
    }

  }
}
</script>

<style scoped>

</style>
