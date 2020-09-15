import {Frame} from "@nativescript/core";

export function redirect(name) {
  const topmost = Frame.topmost();
  topmost.navigate(name);
}
