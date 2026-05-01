import { useEffect, useState } from "react";

const TARGET_TIME = new Date("2026-05-01T18:00:00+03:00").getTime();
const END_OF_DAY = new Date("2026-05-02T00:00:00+03:00").getTime();

const BIG_TEXT_CLASS =
  "text-outline-green-light font-black leading-none text-green-dark text-[clamp(3rem,10vw,6rem)] [@supports(font-size:1cqw)]:text-[min(16cqw,6rem)]";

function getTimeRemainingParts(msLeft: number) {
  const totalSeconds = Math.floor(msLeft / 1000);

  return [
    { label: "days", value: Math.floor(totalSeconds / 86400) },
    { label: "hours", value: Math.floor((totalSeconds % 86400) / 3600) },
    { label: "minutes", value: Math.floor((totalSeconds % 3600) / 60) },
    { label: "seconds", value: totalSeconds % 60 },
  ];
}

export default function Countdown() {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const timerId = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timerId);
  }, []);

  if (now >= TARGET_TIME) {
    return (
      <p className={`${BIG_TEXT_CLASS} text-center uppercase`}>
        {now < END_OF_DAY ? "Enjoy your meal!" : "See you next year"}
      </p>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-6">
      {getTimeRemainingParts(TARGET_TIME - now).map(({ label, value }) => (
        <div
          key={label}
          className="flex min-w-17 flex-col items-center px-2 py-1 sm:min-w-20 sm:px-3"
        >
          <span className={BIG_TEXT_CLASS}>{String(value).padStart(2, "0")}</span>
          <span className="text-outline-pink-light mt-1 font-bold uppercase tracking-[0.08em] text-purple-dark leading-none text-[clamp(0.95rem,2.8vw,1.25rem)] [@supports(font-size:1cqw)]:text-[min(4.6cqw,1.25rem)]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
