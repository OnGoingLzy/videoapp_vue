<template>
  <div>
    <van-row>
      <van-col span="12">
        <van-search v-model="value" placeholder="请输入搜索关键词" />
      </van-col>
      <van-col span="6">
        <van-icon name="user-circle-o" size="54"/>
      </van-col>

      <van-col span="6">
        <van-badge :content="0" max="99">
          <div class="child" />
          <van-icon name="envelop-o" size="54"/>
        </van-badge>
      </van-col>

    </van-row>
  </div>
</template>

<script>
export default {
  name: "header",

}
</script>

<style scoped>

</style>
