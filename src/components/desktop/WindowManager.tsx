import { useRef, useState } from "react";
import { WINDOW_FOCUS_EVENT } from "../../constants";
import useWindowEvent from "../../hooks/useWindowEvent";
import type { PageType } from "../../types/page";
import BackgroundVideo from "../BackgroundVideo";
import Countdown from "../Countdown";
import InstagramLink from "../InstagramLink";
import pageRegistry from "../pages/registry";
import Window, { type WindowAspectRatio } from "./Window";

const WINDOW_RATIOS: Record<PageType, WindowAspectRatio> = {
  about: "1-1",
  guidelines: "1-1",
  location: "3-4",
  pictures: "10-16",
};

export default function WindowManager() {
  const containerRef = useRef<HTMLDivElement>(null);
  // Last focused window is last, so its index doubles as its stacking order.
  const [windowOrder, setWindowOrder] = useState(() => pageRegistry.map(({ id }) => id));

  useWindowEvent(WINDOW_FOCUS_EVENT, ({ detail: { type } }) =>
    setWindowOrder((order) => [...order.filter((id) => id !== type), type]),
  );

  return (
    <section className="relative size-full overflow-hidden bg-teal-900 px-0 sm:p-6">
      <div
        ref={containerRef}
        className="relative z-10 size-full overflow-hidden sm:rounded-[100px] sm:border-3 border-green-light bg-yellow"
      >
        <div className="absolute inset-0 z-20 flex flex-col items-center">
          <img
            src="/assets/wavy_logo_colors.svg"
            className="mt-4 w-6/10 h-auto"
            alt="The Grill logo"
          />
          <div className="absolute bottom-32 mt-6 w-6/10 px-4 [container-type:inline-size]">
            <Countdown />
          </div>
          <InstagramLink className="cursor-pointer absolute bottom-22" />
        </div>
        <BackgroundVideo />
        {pageRegistry.map(({ id, Component }) => (
          <Window
            key={id}
            id={id}
            containerRef={containerRef}
            zIndex={windowOrder.indexOf(id) + 30}
            aspectRatio={WINDOW_RATIOS[id]}
          >
            <Component />
          </Window>
        ))}
      </div>
    </section>
  );
}
