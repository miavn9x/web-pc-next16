import type { Metadata, Viewport } from "next";
import "../shared/styles/globals.css";

import { AuthModalProvider } from "@/features/auth/shared/contexts/AuthModalContext";
import { AuthModalWrapper } from "@/features/auth/components/AuthModalWrapper";
import { CartProvider } from "@/features/client/cart/context/CartContext";
import { Suspense } from "react";

/** ✅ Chuyển themeColor sang viewport (chuẩn Next 15) */
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

/** ✅ Metadata gốc site */
export const metadata: Metadata = {
  metadataBase: new URL("https://vuabanhtrangjb.com"),
  applicationName: "Vua Bánh Tráng JB",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    languages: {
      "vi-VN": "/",
    },
  },
};

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ... imports

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthModalProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <AuthModalWrapper />
            </Suspense>
            {children}
            <ToastContainer
              position="top-right"
              theme="colored"
              autoClose={2000}
              limit={3}
            />
          </CartProvider>
        </AuthModalProvider>
      </body>
    </html>
  );
}
