<template>
  <div class="home">
    <p class="title">home</p>
    <div class="list" @click="routerpush" tag="div">
      click forward to about page
    </div>
    <div class="list" @click="routerpushVip" tag="div">
      click up to vip page
    </div>

    <div
      class="item "
      v-for="(item, index) in itemList"
      :key="index"
      @click="clickToItem(item, $event)"
    >
      <p class="icon flip-item">{{ item }}</p>
      <p class="text">click flip to detail</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  components: {}
})
export default class Home extends Vue {
  private itemList: string[] = ["😊", "😂", "🌹", "👏", "👩", "👏"];
  private scrollValue: number = 0;

  private routerpush() {
    this.$router.push({
      name: "about",
      query: {
        routerTransition: "forward"
      }
    });
  }
  private clickToItem(text: string, e: any) {
    const target: any = e.currentTarget;
    this.$router.push({
      name: "Detail",
      query: {
        routerTransition: "flipEnter",
        text
      },
      params: {
        target
      }
    });
  }
  private routerpushVip() {
    this.$router.push({
      name: "VipPage",
      query: {
        routerTransition: "up"
      }
    });
  }

  private activated() {
    (document.querySelector(
      ".home"
    ) as HTMLElement).scrollTop = this.scrollValue;
  }

  private deactivated() {
    this.scrollValue = (document.querySelector(
      ".home"
    ) as HTMLElement).scrollTop;
  }
}
</script>

<style scoped lang="scss">
.home {
  background: #f8f8f8;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  // animation: 0; 不能设置为0，否则home页路由动画会消失
  .title {
    font-size: 16px;
    line-height: 80px;
    background: #6ab6fc;
    text-align: center;
  }
}
.list {
  margin-top: 10px;
  background: #6ab6fc;
  padding: 20px;
}
.item {
  margin-top: 20px;
  display: flex;
  align-items: center;
  width: 100%;
  p {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ccc;
    &.text {
      height: 100px;
      flex: 1;
    }
    &.icon {
      width: 100px;
      height: 100px;
      background: #6ab6fc;
      margin-right: 10px;
    }
  }
}
</style>
