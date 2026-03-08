import { optimizeCloudinaryUrl } from "../utils/imageUtils";

/**
 * Product image with Cloudinary auto-format (WebP), lazy loading, and optional responsive width.
 */
export default function OptimizedImage({
  src,
  alt,
  className = "",
  width,
  lazy = true,
  ...props
}) {
  const optimized = optimizeCloudinaryUrl(src, width ? { width } : {});
  return (
    <img
      src={optimized || src}
      alt={alt ?? ""}
      className={className}
      loading={lazy ? "lazy" : "eager"}
      decoding="async"
      {...props}
    />
  );
}
