import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import type { Position } from "../../types/window";

type PositionedOverlayProps = {
  position: Position | null;
  isClosing: boolean;
} & ComponentProps<"div">;

export default function PositionedOverlay({
  position,
  isClosing,
  className,
  style,
  ...props
}: PositionedOverlayProps) {
  if (!position && !isClosing) return null;

  return (
    <div
      {...props}
      className={twMerge(isClosing ? "animate-window-close" : "animate-window-open", className)}
      style={{
        left: position?.x,
        top: position?.y,
        pointerEvents: isClosing ? "none" : "auto",
        ...style,
      }}
    />
  );
}
