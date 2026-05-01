import { useEffect } from "react";
import ContextMenu from "../components/desktop/ContextMenu";
import Navbar from "../components/desktop/Navbar";
import PageManager from "../components/PageManager";
import useIsMobile from "../hooks/useIsMobile";
import { WindowOpenEvent } from "../types/window";
import { galleryImages } from "../utils/gallery.util";
import { getPageTypeFromPath, preloadImage } from "../utils/misc.util";

const STATIC_ASSET_PATHS = [
  "/thegrill2025.mp4",
  "/favicon.svg",
  "/assets/Placeholder.svg",
  "/assets/border.svg",
  "/assets/frames/Frame_16_10.svg",
  "/assets/frames/Frame_4_3.svg",
  "/assets/frames/Frame_1_1.svg",
];

let staticAssetsWarmed = false;

function warmStaticAssets() {
  staticAssetsWarmed = true;

  for (const path of STATIC_ASSET_PATHS) {
    if (path.endsWith(".mp4")) {
      const link = Object.assign(document.createElement("link"), {
        rel: "preload",
        as: "video",
        href: path,
      });
      document.head.appendChild(link);
    } else {
      preloadImage(path);
    }
  }
}

export default function App() {
  const isMobile = useIsMobile();

  useEffect(() => {
    const pageType = getPageTypeFromPath(location.pathname);
    if (pageType) {
      window.dispatchEvent(new WindowOpenEvent({ type: pageType, openMode: "center" }));
    }

    galleryImages.forEach(({ compressedUrl }) => preloadImage(compressedUrl));
  }, []);

  useEffect(() => {
    if (staticAssetsWarmed) return;

    // Wait until the browser is idle so warming up doesn't compete with the first render.
    if ("requestIdleCallback" in window) {
      const idleId = requestIdleCallback(warmStaticAssets);
      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = setTimeout(warmStaticAssets, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative size-full overflow-hidden bg-yellow-dark">
      <PageManager />
      {!isMobile && (
        <>
          <Navbar />
          <ContextMenu />
        </>
      )}
    </div>
  );
}
