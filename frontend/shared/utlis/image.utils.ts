export const getProductImageUrl = (url?: string | null): string => {
  if (!url) return "/img/logow.jpeg";
  if (url.startsWith("http")) return url;

  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};
