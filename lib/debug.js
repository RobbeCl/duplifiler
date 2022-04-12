import debug from "debug";

const debugMsg = debug("duplifiler");

export function debugLog(msg) {
  debugMsg(msg);
}
