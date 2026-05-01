import { useRef, type PointerEvent, type ReactNode, type RefObject } from "react";
import { WINDOW_OPEN_EVENT } from "../../constants";
import usePositionedOverlay from "../../hooks/usePositionedOverlay";
import useWindowEvent from "../../hooks/useWindowEvent";
import type { PageType } from "../../types/page";
import { WindowFocusEvent, type Position } from "../../types/window";
import PositionedOverlay from "./PositionedOverlay";

/** Width-height ratio. Each one has a matching `/assets/frames/Frame_<w>_<h>.svg`. */
export type WindowAspectRatio = "1-1" | "3-4" | "4-3" | "10-16" | "16-10";

const FALLBACK_SIZE = { width: 420, height: 260 };

type WindowProps = {
  id: PageType;
  children: ReactNode;
  containerRef: RefObject<HTMLDivElement | null>;
  zIndex: number;
  aspectRatio?: WindowAspectRatio;
};

export default function Window({
  id,
  children,
  containerRef,
  zIndex,
  aspectRatio = "1-1",
}: WindowProps) {
  const { position, setPosition, isClosing, closeOverlay } = usePositionedOverlay();
  const windowRef = useRef<HTMLDivElement>(null);
  const lastPositionRef = useRef<Position | null>(null);
  const [ratioWidth, ratioHeight] = aspectRatio.split("-").map(Number);

  const moveTo = (next: Position) => {
    setPosition(next);
    lastPositionRef.current = next;
  };

  const emitFocus = () => window.dispatchEvent(new WindowFocusEvent({ type: id }));

  /** Keeps the window fully inside the container. */
  const clamp = (x: number, y: number): Position => {
    const container = containerRef.current;
    const element = windowRef.current;
    if (!container || !element) return { x, y };

    return {
      x: Math.min(Math.max(0, x), Math.max(0, container.clientWidth - element.offsetWidth)),
      y: Math.min(Math.max(0, y), Math.max(0, container.clientHeight - element.offsetHeight)),
    };
  };

  const randomPosition = (): Position => {
    const container = containerRef.current;
    if (!container) return { x: 24, y: 24 };

    const width = windowRef.current?.offsetWidth ?? FALLBACK_SIZE.width;
    const height = windowRef.current?.offsetHeight ?? FALLBACK_SIZE.height;
    return {
      x: Math.round(Math.random() * Math.max(0, container.clientWidth - width)),
      y: Math.round(Math.random() * Math.max(0, container.clientHeight - height)),
    };
  };

  const centerPosition = () => {
    const container = containerRef.current;
    const element = windowRef.current;
    const freeWidth =
      Math.max(0, container?.clientWidth ?? innerWidth) -
      Math.max(1, element?.offsetWidth ?? FALLBACK_SIZE.width);
    const freeHeight =
      Math.max(0, container?.clientHeight ?? innerHeight) -
      Math.max(1, element?.offsetHeight ?? FALLBACK_SIZE.height);

    return clamp(Math.round(freeWidth / 2), Math.round(freeHeight / 2));
  };

  useWindowEvent(WINDOW_OPEN_EVENT, ({ detail }) => {
    if (detail.type !== id) return;

    if (detail.openMode === "center") {
      moveTo(centerPosition());
      // Center again once the window has rendered and its real size is known.
      requestAnimationFrame(() => moveTo(centerPosition()));
    } else {
      moveTo(lastPositionRef.current ?? randomPosition());
    }
    emitFocus();
  });

  useWindowEvent("resize", () =>
    setPosition((current) => {
      if (!current) return current;
      const clamped = clamp(current.x, current.y);
      lastPositionRef.current = clamped;
      return clamped;
    }),
  );

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !position) return;

    const { x: startX, y: startY } = position;
    const { clientX: pointerX, clientY: pointerY } = event;

    const onMove = (move: globalThis.PointerEvent) =>
      moveTo(clamp(startX + move.clientX - pointerX, startY + move.clientY - pointerY));
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  if (!position) return null;

  return (
    <PositionedOverlay
      ref={windowRef}
      position={position}
      isClosing={isClosing}
      onDragStart={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        emitFocus();
        // Only the frame is a drag handle, the content stays interactive.
        if (!(event.target as HTMLElement).closest("[data-window-content]")) startDrag(event);
      }}
      className="absolute w-105 max-w-[calc(100%-1rem)] min-w-48 min-h-48 cursor-move rounded-md bg-yellow-light p-10 flex flex-col justify-start"
      style={{ zIndex, aspectRatio: ratioWidth / ratioHeight }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -m-10 inset-0 z-20 bg-no-repeat bg-center bg-[length:100%_100%]"
        style={{ backgroundImage: `url('/assets/frames/Frame_${ratioWidth}_${ratioHeight}.svg')` }}
      />
      <div
        data-window-content
        className="window-scroll-green flex flex-col flex-1 cursor-auto rounded-md border border-green-light bg-yellow-surface p-3 overflow-auto"
      >
        <div className="flex-1">{children}</div>
        <div className="mt-6 flex justify-center pb-2">
          <button
            type="button"
            onClick={closeOverlay}
            className="cursor-pointer rounded-full border border-purple-dark px-5 py-1 text-purple-dark"
          >
            Close window
          </button>
        </div>
      </div>
    </PositionedOverlay>
  );
}
