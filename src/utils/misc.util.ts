import { PageType } from "../types/page";

const PAGE_TYPES = new Set<string>(Object.values(PageType));

export function isPageType(value: string): value is PageType {
  return PAGE_TYPES.has(value);
}

export function getPageTypeFromPath(pathname: string): PageType | null {
  const normalized = decodeURIComponent(pathname)
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();

  return isPageType(normalized) ? normalized : null;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Starts downloading an image so it is cached before it is displayed. */
export function preloadImage(src: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
}
