
export const getImageUrl = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("https")) return url;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
  // Remove '/api' suffix to get base URL
  const baseUrl = apiUrl.replace(/\/api$/, "");
  
  // Ensure URL starts with /
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  
  return `${baseUrl}${cleanUrl}`;
};
