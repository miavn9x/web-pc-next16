import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Trình duyệt hỗ trợ sẽ nhận AVIF/WebP; còn lại fallback jpg/png
    formats: ["image/avif", "image/webp"],

    // Thêm mốc 1536 để Next Image phát biến thể 1536w (tránh nhảy 1920w)
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1280, 1366, 1440, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cho phép tải ảnh từ các domain bên ngoài
    remotePatterns: [
      { protocol: "https", hostname: "decorandmore.vn", pathname: "/**" },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "vuabanhtrangjb.com", pathname: "/**" },

      // Dev API local phục vụ ảnh
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/**",
      },
      // Allow images from other device IPs during development
      {
        protocol: "http",
        hostname: "192.168.1.9",
        port: "4000",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  // @ts-ignore
  allowedDevOrigins: [
    "localhost:3000",
    "http://localhost:3000",
    "192.168.1.9:3000",
    "http://192.168.1.9:3000",
    "192.168.1.9", // Thêm IP gốc không port
    "*.devtunnels.ms",
    "*.ngrok-free.app",
  ],
};

export default nextConfig;
