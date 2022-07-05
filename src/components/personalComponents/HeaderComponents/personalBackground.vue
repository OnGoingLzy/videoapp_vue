<template>
  <div>
    <van-image
        width="100%"
        height="13rem"
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
    if(sessionStorage.getItem('cbkg')!==null){
      this.bkgImg = sessionStorage.getItem('cbkg')
    }

  }
}
</script>

<style scoped>

</style>
