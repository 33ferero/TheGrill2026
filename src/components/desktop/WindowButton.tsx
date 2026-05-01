import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { PageType } from "../../types/page";
import { WindowOpenEvent } from "../../types/window";
import { capitalize } from "../../utils/misc.util";

type WindowButtonProps = { event: PageType; icon?: ReactNode } & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
>;

/** Button that opens the window for `event`, labelled with the page name. */
export default function WindowButton({ event, icon, onClick, ...props }: WindowButtonProps) {
  return (
    <button
      {...props}
      type="button"
      onClick={(e) => {
        onClick?.(e);
        window.dispatchEvent(new WindowOpenEvent({ type: event }));
      }}
    >
      {icon && (
        <span className="text-lg leading-none" aria-hidden="true">
          {icon}
        </span>
      )}
      <span>{capitalize(event)}</span>
    </button>
  );
}
