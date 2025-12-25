
import type { Metadata, Viewport } from "next";
// import Footer from "@/features/client/footer/footer";

import "../shared/styles/globals.css";

// import NavigationMenu from "@/features/client/menu/NavigationMenu";
import { AuthModalProvider } from "@/features/auth/shared/contexts/AuthModalContext";
import { AuthModalWrapper } from "@/features/auth/components/AuthModalWrapper";
import { Suspense } from "react";
import BackToTop from "@/shared/backtotop/BackToTop";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
      </head>
      <body>
        <AuthModalProvider>
          <Suspense fallback={null}>
            <AuthModalWrapper />
          </Suspense>
          {/* <NavigationMenu /> */}
          <main>{children}</main>
          {/* <Footer /> */}
          <BackToTop />
        </AuthModalProvider>
      </body>
    </html>
  );
}
