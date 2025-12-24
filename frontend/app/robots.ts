// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"], // nếu có, bạn có thể tinh chỉnh
    },
    sitemap: "https://vuabanhtrangjb.com/sitemap.xml",
    host: "https://vuabanhtrangjb.com",
  };
}
