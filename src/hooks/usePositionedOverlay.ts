import { useState } from "react";
import { CLOSE_ANIMATION_MS } from "../constants";
import type { Position } from "../types/window";

export default function usePositionedOverlay() {
  const [position, setPosition] = useState<Position | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const closeOverlay = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setPosition(null);
    }, CLOSE_ANIMATION_MS);
  };

  return { position, setPosition, isClosing, closeOverlay };
}
