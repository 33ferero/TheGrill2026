import Countdown from "../Countdown";
import InstagramLink from "../InstagramLink";

export default function HomeSlide() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 z-20 flex flex-col items-center">
        <div className="relative w-full aspect-[507.9408/186.47556]" aria-hidden="true">
          <img
            src="/assets/wavy_logo_colors_full_background.svg"
            className="absolute w-full object-contain"
            alt="The Grill logo (mobile)"
          />
        </div>
        <div className="mt-4 w-full px-4 [container-type:inline-size]">
          <Countdown />
        </div>
        <InstagramLink />
      </div>
    </div>
  );
}
