<template>
  <div>
    <van-nav-bar
        title="管理中心"
        left-text=""
        right-text=""
    />
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "adminView",
  inject:['setVisible'],
  data(){
    return{

    }
  },
  methods:{

  },
  mounted() {
    this.setVisible(false)//防止F5刷新时组件被销毁visible变成默认的true导致出现header组件
  }
}
</script>

<style scoped>

</style>
