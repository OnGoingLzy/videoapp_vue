<template>

  <div>
    <personalBackground></personalBackground>
    <personal-message></personal-message>
    <personalBar :key="barkey"></personalBar>
  </div>

</template>

<script>
import personalBackground from "@/components/personalComponents/HeaderComponents/personalBackground";
import personalBar from "@/components/personalComponents/HeaderComponents/personalBar";
import personalMessage from "@/components/personalComponents/HeaderComponents/personalMessage";
import PersonalSpace from "@/views/PersonalSpace";
export default {
  name: "SpaceHeader",
  provide(){
    return{
      reloadBar: this.reloadBar
    }
  },
  data(){
    return{
      barkey:0
    }
  },
  components:{
    PersonalSpace,
    personalBackground,
    personalMessage,
    personalBar
  },
  methods:{
    reloadBar(){
      this.barkey=1
      this.$nextTick(function (){
        this.barkey = 0
      })
    }
  },

}
</script>

<style scoped>

</style>
