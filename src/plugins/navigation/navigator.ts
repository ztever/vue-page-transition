import Routes from "./routes";
import { getKey } from "./utils";

export default (eventBus: any, keyName: string) => {
  const updateSessionStatck = (routes: any) => {
    console.log("%c【Router Stack】 ：", "color:rgb(238, 158, 46)", routes);
  };

  const isChildRouteJump = (toRoute: any, fromRoute: any) => {
    if (toRoute && fromRoute) {
      const toRoutePathArr = toRoute.path.split("/");
      const fromRoutePathArr = fromRoute.path.split("/");
      if (
        toRoutePathArr.length === fromRoutePathArr.length &&
        toRoutePathArr.length > 2 &&
        fromRoutePathArr.length > 2 &&
        toRoutePathArr[length - 2] === fromRoutePathArr[length - 2]
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const forward = (toRoute: any, fromRoute: any) => {
    Routes.unshift(toRoute);
    eventBus.$emit("forward", toRoute, fromRoute);
    updateSessionStatck(Routes);
  };
  const back = (toIndex: number, toRoute: any, fromRoute: any) => {
    Routes.splice(0, toIndex);
    eventBus.$emit("back", toRoute, fromRoute);
    updateSessionStatck(Routes);
  };
  const replace = (toRoute: any, fromRoute: any, isChildRoute: boolean) => {
    Routes.splice(0, 1, toRoute);
    eventBus.$emit("replace", toRoute, fromRoute, isChildRoute);
    updateSessionStatck(Routes);
  };
  const refresh = (toRoute: any, fromRoute: any) => {
    Routes[0] = toRoute;
    eventBus.$emit("refresh", toRoute, fromRoute);
    updateSessionStatck(Routes);
  };
  const reset = () => {
    Routes.splice(0, Routes.length);
    eventBus.$emit("reset");
    updateSessionStatck([]);
  };

  const record = (toRoute: any, fromRoute: any, replaceFlag: boolean) => {
    const fullPath = getKey(toRoute, keyName);
    const toIndex = Routes.findIndex((route: any) => {
      return route.fullPath === fullPath;
    });
    let isChildRoute: boolean = false;
    if (isChildRouteJump(toRoute, fromRoute)) {
      console.log("isChildRouteJudge");
      isChildRoute = true;
    }
    if (replaceFlag || isChildRoute) {
      replace(toRoute, fromRoute, isChildRoute);
    } else {
      if (toIndex === -1) {
        forward(toRoute, fromRoute);
      } else if (toIndex === 0) {
        refresh(toRoute, fromRoute);
      } else {
        back(toIndex, toRoute, fromRoute);
      }
    }
  };

  return {
    record,
    reset
  };
};
