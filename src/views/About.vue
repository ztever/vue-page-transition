<template>
  <div class="about">
    <p class="back" @click="backPrePage">click back to home</p>
    <h1>This is about page</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Home extends Vue {
  private backPrePage() {
    this.$router.go(-1);
  }
}
</script>

<style lang="scss" scoped>
.about {
  background: #6ab6fc;
  color: #fff;
  height: 100%;
  width: 100%;
  .back {
    padding: 40px 20px 20px;
    font-size: 20px;
    color: #333;
  }
}
</style>
