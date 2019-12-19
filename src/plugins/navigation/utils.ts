export function genKey() {
  const t = "xxxxx";
  return t.replace(/[xy]/g, (c: string) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getKey(route: any, keyName: string) {
  return `${
    route.fullPath ? route.fullPath : `${route.path}?${route.query[keyName]}`
  }`;
}

export function matches(pattern: any, name: any) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === "string") {
    return pattern.split(",").indexOf(name) > -1;
  } else if (RegExp(pattern)) {
    return pattern.test(name);
  }
  return false;
}

export function isObjEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) {
    return true;
  } else {
    const keys1 = Object.getOwnPropertyNames(obj1);
    const keys2 = Object.getOwnPropertyNames(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
    return true;
  }
}
