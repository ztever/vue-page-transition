import Routes from "./routes";
import Navigator from "./navigator";
import { genKey, isObjEqual } from "./utils";
import Router from "vue-router";
declare module "vue/types/vue" {
  export interface Vue {
    $navigation: any;
  }
}

export default {
  install: (Vue: any, { router, keyName = "VN" }: any) => {
    if (!router) {
      console.error("vue-navigation need options: router");
      return;
    }

    const routerMethods = ["push", "replace"];

    routerMethods.forEach((method: string) => {
      const originalCall = (Router.prototype as any)[method];
      (Router.prototype as any)[method] = function(
        location: any,
        onResolve: any,
        onReject: any
      ): Promise<any> {
        if (onResolve || onReject) {
          return originalCall.call(this, location, onResolve, onReject);
        }
        return (originalCall.call(this, location) as any).catch(
          (err: any) => err
        );
      };
    });

    const bus = new Vue();
    const navigator = Navigator(bus, keyName);

    // hack vue-router replace for replaceFlag
    const routerReplace = router.replace.bind(router);
    let replaceFlag = false;
    router.replace = (location: any, onComplete: any, onAbort: any) => {
      replaceFlag = true;
      routerReplace(location, onComplete, onAbort);
    };

    // init router`s keyName
    router.beforeEach((to: any, from: any, next: any) => {
      if (!to.query[keyName]) {
        const query = { ...to.query };
        // go to the same route will be set the same key
        if (
          to.path === from.path &&
          isObjEqual(
            { ...to.query, [keyName]: null },
            { ...from.query, [keyName]: null }
          ) &&
          from.query[keyName]
        ) {
          query[keyName] = from.query[keyName];
        } else {
          query[keyName] = genKey();
        }
        next({
          name: to.name,
          params: to.params,
          query,
          replace: replaceFlag || !from.query[keyName]
        });
      } else {
        next();
      }
    });

    // record router change
    router.afterEach((to: any, from: any) => {
      navigator.record(to, from, replaceFlag);
      replaceFlag = false;
    });

    Vue.navigation = Vue.prototype.$navigation = {
      on: (event: any, callback: any) => {
        bus.$on(event, callback);
      },
      once: (event: any, callback: any) => {
        bus.$once(event, callback);
      },
      off: (event: any, callback: any) => {
        bus.$off(event, callback);
      },
      getRoutes: () => Routes.splice(),
      cleanRoutes: () => navigator.reset()
    };
  }
};
