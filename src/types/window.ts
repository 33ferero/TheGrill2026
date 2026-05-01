import { WINDOW_FOCUS_EVENT, WINDOW_OPEN_EVENT } from "../constants";
import type { PageType } from "./page";

export type Position = {
  x: number;
  y: number;
};

type WindowOpenPayload = {
  type: PageType;
  openMode?: "default" | "center";
};

export class WindowOpenEvent extends CustomEvent<WindowOpenPayload> {
  constructor(detail: WindowOpenPayload) {
    super(WINDOW_OPEN_EVENT, { detail });
  }
}

export class WindowFocusEvent extends CustomEvent<{ type: PageType }> {
  constructor(detail: { type: PageType }) {
    super(WINDOW_FOCUS_EVENT, { detail });
  }
}

declare global {
  interface WindowEventMap {
    [WINDOW_OPEN_EVENT]: WindowOpenEvent;
    [WINDOW_FOCUS_EVENT]: WindowFocusEvent;
  }
}
