const routes: any = [];

export const findRouteIndex = (value: string) => {
  return routes.findIndex((item: any) => {
    return item.path && item.path.includes(value);
  });
};

export const findRoutesByName = (value: string) => {
  console.log("routes", routes);
  return routes.filter((item: any) => {
    return item.path && item.path.includes(value);
  });
};

export const getCurrentRoute = () => {
  return routes[0];
};

export const clearRoutes = () => {
  routes.splice(0, routes.length);
};

export const getLastRoute = () => {
  return routes[1];
};

export default routes;
