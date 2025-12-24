import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { MutableRefObject } from "react";

interface StartDashboardTourProps {
  lang: "vi" | "ja";
  isMobile: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  router: AppRouterInstance;
  driverObj: MutableRefObject<any>;
}

export const startDashboardTour = ({
  lang,
  isMobile,
  setIsSidebarOpen,
  router,
  driverObj,
}: StartDashboardTourProps) => {
  // Ensure sidebar is open to show labels (only on desktop)
  setIsSidebarOpen(true);

  // Inject custom styles with responsive handling
  const styleId = "driver-custom-styles";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.innerHTML = `
      .driver-popover.driverjs-theme {
        width: 90vw;
        max-width: 400px;
      }
      @media (min-width: 640px) {
        .driver-popover.driverjs-theme {
          min-width: 300px !important;
          width: auto;
        }
      }
      .driver-popover-title {
        font-size: 16px !important;
        font-weight: 600 !important;
      }
    `;
    document.head.appendChild(style);
  }

  const steps = {
    vi: [
      {
        element: isMobile ? "#mobile-menu-trigger" : "#admin-sidebar",
        popover: {
          title: "1. Thanh Điều Hướng",
          description: isMobile
            ? "Chạm vào đây để mở menu các chức năng quản lý."
            : "Menu chính để truy cập vào các chức năng quản lý của hệ thống.",
          side: isMobile ? "bottom" : "right",
          align: "start",
        },
      },
      {
        element: "#dashboard-stats",
        popover: {
          title: "2. Tổng Quan Dashboard",
          description:
            "Cái nhìn toàn cảnh về hoạt động kinh doanh của cửa hàng.",
          side: "bottom",
        },
      },
      {
        element: "#stat-0",
        popover: {
          title: "3. Doanh Thu",
          description:
            "Tổng doanh thu bán hàng được thống kê theo thời gian thực.",
        },
      },
      {
        element: "#stat-1",
        popover: {
          title: "4. Đơn Hàng",
          description:
            "Số lượng đơn hàng mới và tổng số đơn hàng trong hệ thống.",
        },
      },
      {
        element: "#stat-2",
        popover: {
          title: "5. Sản Phẩm",
          description: "Tổng số sản phẩm hiện có và đang kinh doanh.",
        },
      },
      {
        element: "#stat-3",
        popover: {
          title: "6. Khách Hàng",
          description: "Số lượng khách hàng đã đăng ký và mua hàng.",
        },
      },
      {
        element: "#chart-revenue",
        popover: {
          title: "7. Biểu Đồ Doanh Thu",
          description:
            "Biểu đồ trực quan giúp theo dõi xu hướng kinh doanh theo ngày, tuần, tháng.",
          side: "top",
        },
      },
      {
        element: "#section-recent-orders",
        popover: {
          title: "8. Đơn Hàng Gần Đây",
          description: "Danh sách các đơn hàng mới nhất cần được xử lý.",
          side: "left",
        },
      },
      {
        element: "#section-shortcuts-container",
        popover: {
          title: "9. Truy Cập Nhanh",
          description: "Các lối tắt đến những chức năng thường dùng nhất.",
        },
      },
      {
        element: "#shortcut-0",
        popover: {
          title: "10. Quản Lý Sản Phẩm",
          description:
            "Truy cập nhanh vào danh sách sản phẩm để thêm hoăc sửa đổi.",
        },
      },
      {
        element: "#shortcut-1",
        popover: {
          title: "11. Quản Lý Đơn Hàng",
          description: "Xem và xử lý các đơn hàng đang chờ xác nhận.",
        },
      },
      {
        element: "#shortcut-2",
        popover: {
          title: "12. Quản Lý Nội Dung",
          description: "Đăng bài viết mới và quản lý tin tức.",
        },
      },
      {
        element: "#shortcut-3",
        popover: {
          title: "13. Quản Lý Mã Giảm Giá",
          description:
            "Tạo và quản lý các loại mã khuyến mãi cho khách hàng.",
        },
      },
      {
        element: "#admin-header-user",
        popover: {
          title: "14. Tài Khoản",
          description:
            "Xem thông tin cá nhân của bạn tại đây (ân vao sẻ hiên đăng xuất).",
          side: "left",
        },
      },
      {
        element: "#header-logout-btn",
        popover: {
          title: "15. Đăng Xuất",
          description:
            "Chức năng đăng xuất khỏi hệ thống nằm trong menu này.",
          side: "left",
        },
      },
    ],
    ja: [
      {
        element: isMobile ? "#mobile-menu-trigger" : "#admin-sidebar",
        popover: {
          title: "1. ナビゲーションバー",
          description: isMobile
            ? "ここをタップして管理メニューを開きます。"
            : "システムの管理機能にアクセスするためのメインメニューです。",
          side: isMobile ? "bottom" : "right",
          align: "start",
        },
      },
      {
        element: "#dashboard-stats",
        popover: {
          title: "2. ダッシュボード概要",
          description: "店舗の事業活動の全体像。",
          side: "bottom",
        },
      },
      {
        element: "#stat-0",
        popover: {
          title: "3. 売上高",
          description: "リアルタイムで集計された総売上高です。",
        },
      },
      {
        element: "#stat-1",
        popover: {
          title: "4. 注文数",
          description: "新規注文数およびシステム内の総注文数です。",
        },
      },
      {
        element: "#stat-2",
        popover: {
          title: "5. 商品数",
          description: "現在販売中の製品の総数です。",
        },
      },
      {
        element: "#stat-3",
        popover: {
          title: "6. 顧客数",
          description: "登録済みおよび購入済みの顧客数です。",
        },
      },
      {
        element: "#chart-revenue",
        popover: {
          title: "7. 売上推移グラフ",
          description:
            "日次、週次、月次でのビジネストレンドを追跡するための視覚的なグラフです。",
          side: "top",
        },
      },
      {
        element: "#section-recent-orders",
        popover: {
          title: "8. 最近の注文",
          description: "処理が必要な最新の注文リストです。",
          side: "left",
        },
      },
      {
        element: "#section-shortcuts-container",
        popover: {
          title: "9. クイックアクセス",
          description: "最も頻繁に使用される機能へのショートカットです。",
        },
      },
      {
        element: "#shortcut-0",
        popover: {
          title: "10. 商品管理",
          description:
            "商品リストに素早くアクセスして、追加または修正を行います。",
        },
      },
      {
        element: "#shortcut-1",
        popover: {
          title: "11. 注文管理",
          description: "確認待ちの注文を表示および処理します。",
        },
      },
      {
        element: "#shortcut-2",
        popover: {
          title: "12. コンテンツ管理",
          description: "新しい記事を投稿し、ニュースを管理します。",
        },
      },
      {
        element: "#shortcut-3",
        popover: {
          title: "13. クーポン管理",
          description:
            "顧客向けのプロモーションコードを作成および管理します。",
        },
      },
      {
        element: "#admin-header-user",
        popover: {
          title: "14. アカウント",
          description: "ここで個人情報を確認できます。",
          side: "left",
        },
      },
      {
        element: "#header-logout-btn",
        popover: {
          title: "15. ログアウト",
          description:
            "システムからログアウトする機能はこのメニュー内にあります。",
          side: "left",
        },
      },
    ],
  };

  driverObj.current = driver({
    showProgress: true,
    steps: (steps[lang] || steps.vi) as any,
    onDestroyStarted: () => {
      router.replace("/wfourtech", { scroll: false });
      driverObj.current.destroy();
    },
    onHighlightStarted: (element: any, step: any, options: any) => {
      if (
        step.popover?.title?.includes("15.") ||
        step.element === "#header-logout-btn"
      ) {
        const userBtn = document.querySelector(
          "#admin-header-user button"
        ) as HTMLButtonElement;
        const dropdown = document.getElementById("user-dropdown-menu");

        if (userBtn && dropdown) {
          if (dropdown.classList.contains("opacity-0")) {
            userBtn.click();
          }
        }
      }
    },
  });

  driverObj.current.drive();
};
