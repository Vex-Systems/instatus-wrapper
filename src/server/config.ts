export const IFRAME_SRC = process.env.IFRAME_SRC || "https://vex-systems.instatus.com/"

export function getIframeUrl(): URL {
  return new URL(IFRAME_SRC)
}

