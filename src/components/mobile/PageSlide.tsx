import type { CSSProperties, ReactNode } from "react";

const BORDER_STYLE: CSSProperties = {
  backgroundImage: "url('/assets/border.svg')",
  backgroundSize: "auto 100%",
};

const CORNER_CLASSES = [
  "left-0 top-0",
  "right-0 top-0 scale-x-[-1]",
  "left-0 bottom-0 scale-y-[-1]",
  "bottom-0 right-0 scale-[-1]",
];

export default function PageSlide({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 z-30 overflow-auto bg-yellow-light text-lg text-purple">
      <div className="relative min-h-full px-20 pt-14 pb-40">
        <div className="pointer-events-none mx-auto mt-4 w-full max-w-[30rem]">
          <img
            src="/assets/wavy_logo_colors.svg"
            className="mx-auto w-full object-contain"
            alt="The Grill logo"
          />
        </div>
        <div className="relative z-20 mt-6 flex w-full items-center justify-center">
          <div className="w-full">
            <div className="flex items-center justify-center">{children}</div>
          </div>
        </div>

        {/* Decorative border: a repeating strip on each edge, rotated to face inward. */}
        <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
          <div
            className="absolute inset-x-0 bottom-0 h-12 bg-repeat-x bg-bottom"
            style={BORDER_STYLE}
          />
          <div
            className="absolute inset-x-0 top-0 h-12 bg-repeat-x bg-top"
            style={{ ...BORDER_STYLE, transform: "rotate(180deg)" }}
          />
          <div className="absolute top-0 bottom-0 left-0 w-12 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-12 w-[20000px] bg-repeat-x"
              style={{
                ...BORDER_STYLE,
                transformOrigin: "top left",
                transform: "translateX(3rem) rotate(90deg)",
              }}
            />
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-12 overflow-hidden">
            <div
              className="absolute right-0 top-0 h-12 w-[20000px] bg-repeat-x"
              style={{
                ...BORDER_STYLE,
                transformOrigin: "top right",
                transform: "translateX(-3rem) rotate(-90deg)",
              }}
            />
          </div>
          {CORNER_CLASSES.map((corner) => (
            <img
              key={corner}
              src="/assets/Placeholder.svg"
              className={`absolute h-14 w-14 object-contain ${corner}`}
              alt=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}
