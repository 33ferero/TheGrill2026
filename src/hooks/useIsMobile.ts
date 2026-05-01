import { useState } from "react";
import useWindowEvent from "./useWindowEvent";

/** Whether the viewport is narrower than `breakpoint` pixels. */
export default function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useWindowEvent("resize", () => setIsMobile(window.innerWidth < breakpoint));

  return isMobile;
}
