export function getImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("https")) return url;

  // Static files (uploads) KHÔNG đi qua /api-proxy
  // Phải truy cập trực tiếp backend tunnel
  const imageBaseUrl =
    process.env.NEXT_PUBLIC_IMAGE_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace("/api-proxy", "") ||
    "http://localhost:4000";

  // Ensure url starts with /
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${imageBaseUrl}${path}`;
}
