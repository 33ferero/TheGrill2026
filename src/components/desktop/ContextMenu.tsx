import usePositionedOverlay from "../../hooks/usePositionedOverlay";
import useWindowEvent from "../../hooks/useWindowEvent";
import { PageType } from "../../types/page";
import PositionedOverlay from "./PositionedOverlay";
import WindowButton from "./WindowButton";

export default function ContextMenu() {
  const { position, setPosition, isClosing, closeOverlay } = usePositionedOverlay();

  useWindowEvent("contextmenu", (event) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
  });
  useWindowEvent("click", closeOverlay);

  return (
    <PositionedOverlay
      position={position}
      isClosing={isClosing}
      className="pointer-events-auto fixed z-50 w-40 rounded-md border border-green-light bg-yellow-surface p-2"
      onClick={(event) => event.stopPropagation()}
    >
      <WindowButton
        event={PageType.ABOUT}
        className="block w-full cursor-pointer px-2 py-1 text-left text-xs text-purple hover:bg-purple/10 transition"
        onClick={closeOverlay}
      />
    </PositionedOverlay>
  );
}
