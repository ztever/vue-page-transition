<template>
  <div class="Detail">
    <h4 @click="goBack">back to pre page</h4>
    <p>{{ text }}</p>
    <div @click="routerpushVip">click to vip page</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Detail extends Vue {
  private text: string = "";
  private goBack() {
    this.$router.go(-1);
  }
  private routerpushVip() {
    this.$router.push({
      name: "VipPage",
      query: {
        routerTransition: "up"
      }
    });
  }
  private created() {
    this.text = (this.$route.query as any).text;
  }

  private activated() {
    this.text = (this.$route.query as any).text;
  }
}
</script>

<style scoped lang="scss">
.Detail {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: rgb(102, 197, 237);
  font-size: 60px;
  h4 {
    font-size: 26px;
    line-height: 60px;
  }
  p {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
