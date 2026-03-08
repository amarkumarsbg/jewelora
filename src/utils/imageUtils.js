/**
 * Optimize Cloudinary image URLs: auto format (WebP when supported), auto quality.
 * Use for product images to reduce payload and improve LCP.
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("cloudinary.com")) return url;

  const { width, crop = "scale" } = options;
  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);
  if (crop) transforms.push(`c_${crop}`);

  // Insert transforms after /upload/
  const uploadIdx = url.indexOf("/upload/");
  if (uploadIdx === -1) return url;
  const insertAt = uploadIdx + 8; // after "/upload/"
  return url.slice(0, insertAt) + transforms.join(",") + "/" + url.slice(insertAt);
}
