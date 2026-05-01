import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { getPageTypeFromPath, isPageType } from "../../utils/misc.util";
import BackgroundVideo from "../BackgroundVideo";
import pageRegistry from "../pages/registry";
import HomeSlide from "./HomeSlide";
import PageSlide from "./PageSlide";

type SwipeDirection = -1 | 1;

type Transition = {
  next: number;
  dir: SwipeDirection;
  /** False for the first frame, so the slides render in their start pose before animating. */
  started: boolean;
};

const SLIDES = [
  { id: "home", content: <HomeSlide /> },
  ...pageRegistry.map(({ id, Component }) => ({
    id,
    content: (
      <PageSlide>
        <Component />
      </PageSlide>
    ),
  })),
];

const TRANSITION_CSS = "transform 260ms cubic-bezier(0.2, 0.65, 0.15, 1)";
const SWIPE_THRESHOLD_PX = 50;

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

/** The active slide rotates away from the swipe, the next one rotates in from the other side. */
function getSlideStyle(index: number, active: number, t: Transition | null): CSSProperties {
  if (index === active) {
    return {
      transform: `rotateY(${t?.started ? -t.dir * 90 : 0}deg)`,
      transformOrigin: t?.dir === 1 ? "left center" : "right center",
      transition: t ? TRANSITION_CSS : "none",
    };
  }

  if (t?.next === index) {
    return {
      transform: `rotateY(${t.started ? 0 : t.dir * 90}deg)`,
      transformOrigin: t.dir === 1 ? "right center" : "left center",
      transition: TRANSITION_CSS,
    };
  }

  return { transform: "rotateY(180deg)", transition: "none", visibility: "hidden", zIndex: 0 };
}

export default function PageCarousel() {
  const [active, setActive] = useState(() =>
    Math.max(
      0,
      SLIDES.findIndex((slide) => slide.id === getPageTypeFromPath(location.pathname)),
    ),
  );
  const [transition, setTransition] = useState<Transition | null>(null);
  const queuedDir = useRef<SwipeDirection | null>(null);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    if (transition?.started) return;
    const id = requestAnimationFrame(() => setTransition((t) => t && { ...t, started: true }));
    return () => cancelAnimationFrame(id);
  }, [transition?.next, transition?.started]);

  const startSwipe = (dir: SwipeDirection, from = active) =>
    setTransition({ next: wrapIndex(from + dir, SLIDES.length), dir, started: false });

  const triggerSwipe = (dir: SwipeDirection) => {
    if (transition) queuedDir.current = dir;
    else startSwipe(dir);
  };

  const finishSwipe = () => {
    if (!transition) return;
    const { next } = transition;
    setActive(next);
    setTransition(null);

    const nextId = SLIDES[next].id;
    const nextPath = isPageType(nextId) ? `/${nextId}` : "/";
    if (location.pathname !== nextPath) history.replaceState(null, "", nextPath);

    const queued = queuedDir.current;
    queuedDir.current = null;
    if (queued !== null) startSwipe(queued, next);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // No pointer capture here: it would retarget the tap's click to the carousel,
    // so buttons inside slides (like gallery images) would never receive it.
    pointerStartX.current = e.clientX;
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const delta = pointerStartX.current !== null ? e.clientX - pointerStartX.current : 0;
    pointerStartX.current = null;
    if (Math.abs(delta) >= SWIPE_THRESHOLD_PX) triggerSwipe(delta < 0 ? 1 : -1);
  };

  return (
    <section
      className="relative size-full overflow-hidden bg-teal-900"
      style={{ perspective: "1200px" }}
    >
      <BackgroundVideo />
      <div className="absolute bottom-0 inset-x-0 z-40 w-full text-center [container-type:inline-size] flex flex-row">
        <div className="relative w-1/2 overflow-hidden" onClick={() => triggerSwipe(-1)}>
          <img src="/assets/swipe.svg" alt="Swipe left indicator" className="scale-x-[-1]" />
        </div>
        <div className="relative w-1/2 overflow-hidden" onClick={() => triggerSwipe(1)}>
          <img src="/assets/swipe.svg" alt="Swipe right indicator" />
        </div>
      </div>

      <div
        className="relative size-full touch-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (pointerStartX.current = null)}
      >
        {SLIDES.map((slide, index) => (
          <article
            key={slide.id}
            className="absolute inset-0 overflow-hidden [transform-style:preserve-3d] [backface-visibility:hidden]"
            style={getSlideStyle(index, active, transition)}
            onTransitionEnd={index === active ? finishSwipe : undefined}
          >
            {slide.content}
          </article>
        ))}
      </div>
    </section>
  );
}
