"use client";

import "driver.js/dist/driver.css";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAdminPage } from "../contexts/AdminPageContext";
import { useSidebar } from "../contexts/SidebarContext";
import { startDashboardTour } from "../components/guide/components/DashboardTour";
import { startProductTour, startProductAddTour } from "../components/guide/components/product";
import { startOrdersTour } from "../components/guide/components/Order";
import { startCustomersTour } from "../components/guide/components/Customer";
import { startPostsListTour, startCreatePostTour, startEditPostTour, startDeleteTour } from "../components/guide/components/Content";
import { startCouponsListTour, startCouponsAddTour } from "../components/guide/components/Promotion";

const TourGuide = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const driverObj = useRef<any>(null);
  const { setIsSidebarOpen, isMobile, toggleMobileMenu, isMobileMenuOpen } = useSidebar();
  const { currentPage } = useAdminPage();

  // Move steps definition inside to access isMobile

  useEffect(() => {
    // Force reset driver if params change
    if (driverObj.current) {
      if (driverObj.current.isActive && driverObj.current.isActive()) {
        driverObj.current.destroy();
        driverObj.current = null;
      }
    }

    const tourType = searchParams.get("tour");
    const lang = (searchParams.get("lang") as "vi" | "ja") || "vi";

    // Check for pending tour resumption (e.g., after navigation to Edit Post)
    if (localStorage.getItem("tour_pending_edit_post") === "true") {
         // Only start if we are actually ON the edit page content
         if (currentPage === "content-edit-post") {
             setTimeout(() => {
                 startEditPostTour({
                    lang,
                    driverObj,
                    router
                 });
             }, 1000); 
             return; 
         }
    }

    // Check for pending tour resumption (Back to List -> Delete Step)
    if (localStorage.getItem("tour_pending_back_to_list") === "true") {
         // Only start if we are actually ON the list page content
         // Assuming 'content-posts' is the key for list view based on typical pattern, 
         // but if currentPage logic is complex, checking valid element existence inside startDeleteTour handles safety too.
         if (currentPage === "content-posts" || currentPage === "dashboard") { 
             // "dashboard" fallback might be wrong if "content-posts" is sub-view.
             // But let's trust the flag mostly.
             setTimeout(() => {
                 startDeleteTour({
                    lang,
                    driverObj,
                    router
                 });
             }, 1200); 
             return;
         }
    }


    // Check for pending coupon add tour
    if (localStorage.getItem("tour_pending_coupon_add") === "true") {
         if (currentPage === "coupons-add" || pathname?.includes("/admin/khuyen-mai/")) {
             setTimeout(() => {
                 startCouponsAddTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                 });
                 localStorage.removeItem("tour_pending_coupon_add");
             }, 1000);
             return;
         }
    }

    if (tourType) {
        setTimeout(() => {
            if (tourType === "dashboard" && pathname === "/wfourtech") {
                startDashboardTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    router,
                    driverObj
                });
            } else if (tourType === "products") {
                startProductTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "products-add") {
                startProductAddTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "orders") {
                startOrdersTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "customers") {
                startCustomersTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "posts-list") {
                startPostsListTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "content-create-post") {
                console.log("Starting Create Post Tour");
                startCreatePostTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "coupons-list") {
                startCouponsListTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            } else if (tourType === "coupons-add") {
                startCouponsAddTour({
                    lang,
                    isMobile,
                    setIsSidebarOpen,
                    driverObj,
                    router,
                    toggleMobileMenu,
                    isMobileMenuOpen
                });
            }
        }, 800);
    }
  }, [searchParams, pathname, currentPage]);

  return null; 
};

export default TourGuide;
