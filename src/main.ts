import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Navigation from "@/plugins/navigation/index";
Vue.config.productionTip = false;
Vue.use(Navigation, { router });
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
