<template>
  <div>
    <van-grid direction="horizontal" :column-num="2">
      <van-grid-item icon="shenhe" text="视频审核" />
      <van-grid-item icon="peizhiguanli" text="视频管理" />
      <van-grid-item icon="24gl-tags2" text="标签管理" />
      <van-grid-item icon="fenlei" text="分类管理" />
    </van-grid>
  </div>
</template>

<script>
export default {
  name: "adminVanGrid"
}
</script>

<style scoped>

</style>
