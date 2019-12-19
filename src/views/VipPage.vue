<template>
  <div class="vip-page">
    <p class="back" @click="backPrePage">click back to home</p>
    this is vip page
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class VipPage extends Vue {
  private backPrePage() {
    this.$router.go(-1);
  }
}
</script>

<style scoped lang="scss">
.vip-page {
  width: 100%;
  height: 100%;
  background: pink;
  color: red;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  .back {
    padding: 40px 20px 20px;
    font-size: 20px;
    color: #333;
    text-align: left;
  }
}
</style>
