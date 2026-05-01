const COMPRESSED_PREFIX = "COMPRESSED_";

export type GalleryImage = {
  name: string;
  compressedUrl: string;
  fullSizeUrl: string;
};

/** Every photo in src/assets/gallery, resolved to its URL at build time. */
const photoUrls = import.meta.glob<string>("../assets/gallery/*.{jpg,jpeg,png,JPG,JPEG,PNG}", {
  eager: true,
  query: "?url",
  import: "default",
});

const fileName = (path: string) => path.slice(path.lastIndexOf("/") + 1);

/**
 * Each photo `X.JPG` is shown via its smaller `COMPRESSED_X.JPG` copy and downloaded at full size.
 * Photos without a compressed copy use the full-size file for both.
 */
export const galleryImages: GalleryImage[] = Object.entries(photoUrls)
  .filter(([path]) => !fileName(path).startsWith(COMPRESSED_PREFIX))
  .map(([path, fullSizeUrl]) => {
    const name = fileName(path);
    const compressedPath = path.slice(0, -name.length) + COMPRESSED_PREFIX + name;
    return { name, fullSizeUrl, compressedUrl: photoUrls[compressedPath] ?? fullSizeUrl };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
