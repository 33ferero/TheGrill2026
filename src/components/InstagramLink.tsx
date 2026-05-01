export default function InstagramLink({ className = "" }: { className?: string }) {
  return (
    <a
      href="https://www.instagram.com/thegrill.live/"
      target="_blank"
      rel="noopener noreferrer"
      className={`w-full flex justify-center z-30 mt-6 text-green-dark text-outline-green-light text-xl ${className}`}
      aria-label="Visit our Instagram"
    >
      <img
        src="/assets/instagram.svg"
        alt="Instagram"
        className="w-7 h-7 invert icon-green-outline"
      />
      <span className="font-semibold ml-2">@thegrill.live</span>
    </a>
  );
}
