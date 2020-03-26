<template>
  <div id="app">
    <transition
      :css="true"
      :enter-active-class="enterTransitionName"
      :leave-active-class="leaveTransitionName"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeleave"
      @leave="leave"
      @after-leave="afterleave"
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

@Component({
  components: {}
})
export default class App extends Vue {
  private speed: number = 250; //需要同时修改路由动画css的时间 单位ms
  private firstRect: any = {};
  private enterTransitionName: string = "";
  private leaveTransitionName: string = "";
  private flipName: string = "";

  private animateFn(
    dom: any,
    args: any,
    direction: string,
    time: any,
    event: any
  ) {
    //ios没有animate方法
    if (dom.animate) {
      dom.animate(
        [
          {
            transformOrigin: "left top",
            transform: `translate3d(${args.deltaX}px,${args.deltaY}px,0) scale(${args.deltaW})`,
            borderRadius: "5px"
          },
          {
            transformOrigin: "left top",
            transform: `translate3d(0 ,0, 0) scale(1)`,
            borderRadius: "0"
          }
        ],
        {
          duration: time,
          direction
        }
      ).onfinish = function() {
        event && event();
      };
    } else {
      //针对ios，做兼容
      const times = Math.ceil(time / 16);
      let speedX = Number((args.deltaX / times).toFixed(4));
      let speedY = Number((args.deltaY / times).toFixed(4));
      let scaleS = Number(((1 - args.deltaW) / times).toFixed(4));
      let transX = args.deltaX;
      let transY = args.deltaY;
      let scale = args.deltaW;
      if (direction === "reverse") {
        speedX = -speedX;
        speedY = -speedY;
        scaleS = -scaleS;
        scale = 1;
        transY = 0;
        transX = 0;
      }
      // console.log("direction", direction);
      // console.log("speedX", speedX, speedY, scaleS);

      const animateScale = () => {
        transX -= speedX;
        transY -= speedY;
        scale += scaleS;
        if (transX < 0) {
          transX = 0;
        }
        if (direction === "normal") {
          scale = scale > 1 ? 1 : scale;
          transY = transY < 0 ? 0 : transY;
          // console.log("scale", scale, transY);
          if (scale === 1 && transY === 0) {
            dom.style.cssText = `transform: translate(0, 0) scale(1);transform-origin: left top`;
            event && event();
            return;
          }
        }
        if (direction === "reverse" && scale < args.deltaW) {
          event && event();
          return;
        }
        // console.log("transX", transX, transY, scale);
        dom.style.cssText = `transform: translate(${transX}px, ${transY}px) scale(${scale});transform-origin: left top`;
        requestAnimationFrame(animateScale);
      };
      animateScale();
    }
  }
  private beforeEnter(el: any) {
    //   el.style.cssText = `position: absolute;transition: transform ${this.speed}ms;transform: translate(100%, 0);`;
  }
  private enter(el: any, done: any) {
    // console.log("el", el);
    // requestAnimationFrame(() => {
    //   //需要异步，不然动画没效果
    //   el.style.cssText = `position: absolute;transition: transform ${this.speed}ms;transform: translate(0, 0);`;
    // });
    // setTimeout(() => {
    //   el.style.cssText = `position: absolute;transition: transform ${this.speed}ms;transform: translate(0, 0);`;
    // }, 1);
    // // 监听 transitionend 事件
    // var transitionend = window.ontransitionend
    //   ? "transitionend"
    //   : "webkitTransitionEnd";
    // el.addEventListener(transitionend, function onEnd() {
    //   el.removeEventListener(transitionend, onEnd);
    //   done(); //调用done() 告诉vue动画已完成，以触发 afterEnter 钩子
    // });
    if (this.flipName === "flipEnter") {
      const Invert = this.getInvert(el);
      // console.log("enter Invert", Invert);
      this.animateFn(el, Invert, "normal", this.speed, done);
    } else {
      if (this.flipName === "flipLeave") {
        el.style.cssText = "position:absolute;left:0;top:0;z-index:-1";
      }
      setTimeout(() => {
        done();
      }, this.speed);
    }
  }
  private afterEnter(el: any) {
    el.style.cssText = "";
  }
  private beforeleave(el: any) {
    // console.log("beforeleave el", el);
    // el.style.cssText = `position: absolute;transition: transform ${this.speed}ms;transform: translate(0, 0);`;
  }
  private getInvert(el: any) {
    const lastReact = el.getBoundingClientRect();
    return {
      deltaX: this.firstRect.left - lastReact.left,
      deltaY: this.firstRect.top - lastReact.top,
      deltaW: this.firstRect.height / lastReact.height
    };
  }
  private leave(el: any, done: any) {
    el.style.cssText = "position:absolute;z-index:-1";

    if (this.flipName === "flipLeave") {
      el.style.cssText = "position:absolute;z-index:1";
      const Invert = this.getInvert(el);
      // console.log("leave Invert", Invert);
      this.animateFn(el, Invert, "reverse", this.speed, done);
    } else {
      setTimeout(() => {
        done();
        el.style.cssText = "";
      }, this.speed + 100);
    }
  }
  private afterleave(el: any) {
    el.style.cssText = "";
  }

  private created() {
    this.$navigation.on("forward", (to: any, from: any) => {
      // console.log("forward", to, from);
      this.transitionStart("forward", to, from);
    });

    this.$navigation.on("back", (to: any, from: any) => {
      this.transitionStart("back", to, from);
    });

    this.$navigation.on(
      "replace",
      (to: any, from: any, isChildRoute: boolean) => {
        this.transitionStart("replace", to, from, isChildRoute);
      }
    );
  }

  private transitionStart(
    direct: string,
    to: any,
    from: any,
    isChildRoute: boolean = false
  ) {
    let transition: string = "forward"; // default transition
    if (direct === "back") {
      transition = this.getBackTrantion(from.query.routerTransition);
    } else if (direct === "replace" || direct === "forward") {
      if (isChildRoute) {
        transition = "static";
      } else if (to && to.query && to.query.routerTransition) {
        transition = to.query.routerTransition;
        if (to.query.routerTransition === "flipEnter") {
          const flipItem = to.params.target.querySelector(
            ".flip-item"
          ) as HTMLElement;
          this.firstRect = flipItem.getBoundingClientRect();
        }
      }
    }
    this.getRouterTransition(transition);
  }

  private getBackTrantion(name: any) {
    let transition = "";
    switch (name) {
      case "forward":
        transition = "back";
        break;
      case "up":
        transition = "down";
        break;
      case "flipEnter":
        transition = "flipLeave";
        break;
      default:
        transition = "";
        break;
    }
    return transition;
  }

  private getRouterTransition(name: any) {
    this.flipName = "";
    switch (name) {
      case "flipEnter":
        this.enterTransitionName = "";
        this.leaveTransitionName = "";
        this.flipName = "flipEnter";
        break;
      case "flipLeave":
        this.enterTransitionName = "";
        this.leaveTransitionName = "";
        this.flipName = "flipLeave";
        break;
      case "back":
        this.enterTransitionName = "animated slideInLeft";
        this.leaveTransitionName = "animated slideOutRight";
        break;
      case "forward":
        this.enterTransitionName = "animated slideInRight";
        this.leaveTransitionName = "animated slideOutLeft";
        break;
      case "down":
        this.enterTransitionName = "animated slideInDown";
        this.leaveTransitionName = "animated slideOutDown";
        break;
      case "up":
        this.enterTransitionName = "animated slideInUp";
        this.leaveTransitionName = "animated slideOutUp";
        break;
      default:
        this.enterTransitionName = "";
        this.leaveTransitionName = "";
        break;
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/base.scss";
</style>
