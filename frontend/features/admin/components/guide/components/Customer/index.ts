import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { waitForElement } from "../../utils";

interface TourProps {
    lang: "vi" | "ja";
    isMobile: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    driverObj: any;
    router: any;
    toggleMobileMenu?: () => void;
    isMobileMenuOpen?: boolean;
}

export const startCustomersTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router,
    toggleMobileMenu,
    isMobileMenuOpen
}: TourProps) => {

      const steps: any[] = [
        // 1. Navigate to Customers Menu (Mobile: open menu / Desktop: show menu)
        {
            element: isMobile ? "#mobile-menu-trigger" : "#customers",
            popover: {
                title: lang === "vi" ? "1. Menu Khách hàng" : "1. 顧客メニュー",
                description: lang === "vi" 
                    ? isMobile ? "Mở menu để bắt đầu quản lý khách hàng." : "Bắt đầu quản lý khách hàng từ menu này."
                    : isMobile ? "メニューを開いて顧客管理を開始します。" : "このメニューから顧客管理を開始します。",
                side: "right", align: "start"
            }
        },
        // 2. Click Customers Menu Item
        {
            element: "#customers",
            popover: {
                title: lang === "vi" ? "2. Chọn Khách hàng" : "2. 顧客を選択",
                description: lang === "vi"
                    ? "Click vào đây để mở trang quản lý khách hàng."
                    : "ここをクリックして顧客管理ページを開きます。",
                side: "right", align: "start"
            }
        },
        // 3. Page Overview
        {
            element: "#customers-page",
            popover: {
                title: lang === "vi" ? "3. Trang Quản lý khách hàng" : "3. 顧客管理ページ",
                description: lang === "vi"
                    ? "Tổng hợp thông tin khách hàng từ lịch sử đơn hàng. Hiển thị chi tiết liên hệ, địa chỉ và tổng chi tiêu."
                    : "注文履歴から顧客情報を集計。連絡先、住所、総支出額を表示します。",
                side: "bottom", align: "start"
            }
        },
        // 4. Header
        {
            element: "#customers-header",
            popover: {
                title: lang === "vi" ? "4. Phần header" : "4. ヘッダーセクション",
                description: lang === "vi"
                    ? "Tiêu đề và mô tả của trang quản lý khách hàng."
                    : "顧客管理ページのタイトルと説明。",
                side: "bottom", align: "start"
            }
        },
        // 5. Language Toggle
        {
            element: "#customers-lang-toggle",
            popover: {
                title: lang === "vi" ? "5. Đổi ngôn ngữ" : "5. 言語切り替え",
                description: lang === "vi"
                    ? "Chọn hiển thị tiếng Việt hoặc tiếng Nhật cho giao diện."
                    : "ベトナム語または日本語でインターフェースを表示します。",
                side: "bottom", align: "start"
            }
        },
        // 6. Search Input
        {
            element: "#input-search-customer",
            popover: {
                title: lang === "vi" ? "6. Tìm kiếm khách hàng" : "6. 顧客検索",
                description: lang === "vi"
                    ? "Tìm kiếm theo tên, email hoặc số điện thoại khách hàng."
                    : "顧客名、メール、電話番号で検索します。",
                side: "bottom", align: "start"
            }
        },
        // 7. Refresh Button
        {
            element: "#btn-refresh-customers",
            popover: {
                title: lang === "vi" ? "7. Làm mới dữ liệu" : "7. データ更新",
                description: lang === "vi"
                    ? "Tải lại danh sách khách hàng mới nhất từ server."
                    : "サーバーから最新の顧客リストを再読み込みします。",
                side: "left", align: "center"
            }
        }
      ];

      // Only add table steps on desktop (mobile uses card view)
      if (!isMobile) {
        steps.push(
          // 8. Table Structure
          {
              element: "#customers-table",
              popover: {
                  title: lang === "vi" ? "8. Bảng khách hàng" : "8. 顧客テーブル",
                  description: lang === "vi"
                      ? "Hiển thị danh sách tất cả khách hàng với đầy đủ thông tin."
                      : "すべての顧客を詳細情報とともに表示します。",
                  side: "top", align: "center"
              }
          },
          // 8.1 Customer Column
          {
              element: "#th-customer",
              popover: {
                  title: lang === "vi" ? "8.1 Cột Khách hàng" : "8.1 顧客カラム",
                  description: lang === "vi"
                      ? "Tên khách hàng và ngày mua gần nhất."
                      : "顧客名と最終購入日。",
                  side: "bottom", align: "start"
              }
          },
          // 8.2 Contact Info Column
          {
              element: "#th-contact",
              popover: {
                  title: lang === "vi" ? "8.2 Thông tin liên hệ" : "8.2 連絡先",
                  description: lang === "vi"
                      ? "Email và số điện thoại của khách hàng."
                      : "顧客のメールと電話番号。",
                  side: "bottom", align: "start"
              }
          },
          // 8.3 Address Column
          {
              element: "#th-address",
              popover: {
                  title: lang === "vi" ? "8.3 Địa chỉ" : "8.3 住所",
                  description: lang === "vi"
                      ? "Địa chỉ giao hàng của khách hàng."
                      : "顧客の配送住所。",
                  side: "bottom", align: "start"
              }
          },
          // 8.4 Orders Column
          {
              element: "#th-orders",
              popover: {
                  title: lang === "vi" ? "8.4 Số đơn hàng" : "8.4 注文数",
                  description: lang === "vi"
                      ? "Tổng số đơn hàng khách đã đặt."
                      : "顧客が注文した総数。",
                  side: "bottom", align: "center"
              }
          },
          // 8.5 Total Spent Column
          {
              element: "#th-total-spent",
              popover: {
                  title: lang === "vi" ? "8.5 Tổng chi tiêu" : "8.5 総支出額",
                  description: lang === "vi"
                      ? "Tổng số tiền khách đã chi tiêu (VNĐ và Yên)."
                      : "顧客の総支出額（VNĐと円）。",
                  side: "bottom", align: "end"
              }
          },
          // 9. Sample Customer Row
          {
              element: "#customer-row-0",
              popover: {
                  title: lang === "vi" ? "9. Dòng khách hàng" : "9. 顧客行",
                  description: lang === "vi"
                      ? "Mỗi dòng hiển thị đầy đủ thông tin của một khách hàng."
                      : "各行は顧客の完全な情報を表示します。",
                  side: "left", align: "center"
              }
          },
          // 10. Pagination
          {
              element: "#customers-pagination",
              popover: {
                  title: lang === "vi" ? "10. Phân trang" : "10. ページネーション",
                  description: lang === "vi"
                      ? "Điều hướng giữa các trang danh sách khách hàng."
                      : "顧客リストのページ間を移動します。",
                  side: "top", align: "center"
              }
          }
        );
      } else {
        // Mobile: Detailed Card View & Pagination
        steps.push(
          // 8. Individual Customer Card
          {
              element: "#mobile-customer-card-0",
              popover: {
                  title: lang === "vi" ? "8. Thẻ khách hàng" : "8. 顧客カード",
                  description: lang === "vi"
                      ? "Thông tin khách hàng được hiển thị chi tiết trong thẻ này."
                      : "顧客情報はカード形式で詳細に表示されます。",
                  side: "top", align: "center"
              }
          },
          // 8.1 Name
          {
              element: "#mobile-customer-name-0",
              popover: {
                  title: lang === "vi" ? "8.1 Tên khách hàng" : "8.1 顧客名",
                  description: lang === "vi"
                      ? "Họ và tên đầy đủ của khách hàng."
                      : "顧客の氏名。",
                  side: "bottom", align: "center"
              }
          },
           // 8.2 Last Purchase
          {
              element: "#mobile-customer-last-purchase-0",
              popover: {
                  title: lang === "vi" ? "8.2 Mua gần nhất" : "8.2 最終購入",
                  description: lang === "vi"
                      ? "Ngày khách hàng thực hiện đơn hàng gần nhất."
                      : "顧客が最後に注文した日付。",
                  side: "bottom", align: "center"
              }
          },
          // 8.3 Total Orders
          {
              element: "#mobile-customer-order-count-0",
              popover: {
                  title: lang === "vi" ? "8.3 Tổng đơn" : "8.3 総注文数",
                  description: lang === "vi"
                      ? "Tổng số đơn hàng khách đã đặt thành công."
                      : "顧客が正常に注文した合計数。",
                  side: "left", align: "center"
              }
          },
          // 8.4 Email
          {
              element: "#mobile-customer-email-0",
              popover: {
                  title: lang === "vi" ? "8.4 Email" : "8.4 メールアドレス",
                  description: lang === "vi"
                      ? "Địa chỉ email liên hệ của khách hàng."
                      : "顧客の連絡先メールアドレス。",
                  side: "top", align: "center"
              }
          },
          // 8.5 Phone
          {
              element: "#mobile-customer-phone-0",
              popover: {
                  title: lang === "vi" ? "8.5 Số điện thoại" : "8.5 電話番号",
                  description: lang === "vi"
                      ? "Số điện thoại liên lạc của khách hàng."
                      : "顧客の電話番号。",
                  side: "top", align: "center"
              }
          },
          // 8.6 Address
          {
              element: "#mobile-customer-address-0",
              popover: {
                  title: lang === "vi" ? "8.6 Địa chỉ" : "8.6 住所",
                  description: lang === "vi"
                      ? "Địa chỉ giao hàng mặc định."
                      : "デフォルトの配送先住所。",
                  side: "top", align: "center"
              }
          },
          // 8.7 Total Spent
          {
              element: "#mobile-customer-total-spent-0",
              popover: {
                  title: lang === "vi" ? "8.7 Tổng chi tiêu" : "8.7 総支出額",
                  description: lang === "vi"
                      ? "Tổng số tiền khách đã mua sắm (theo VNĐ và Yên)."
                      : "顧客が使用した総額（VNĐおよび円）。",
                  side: "top", align: "center"
              }
          },
          // 9. Pagination (Mobile)
          {
              element: "#customers-pagination",
              popover: {
                  title: lang === "vi" ? "9. Phân trang" : "9. ページネーション",
                  description: lang === "vi"
                      ? "Điều hướng giữa các trang danh sách khách hàng."
                      : "顧客リストのページ間を移動します。",
                  side: "top", align: "center"
              }
          }
        );
      }

      driverObj.current = driver({
          showProgress: true,
          steps: steps,
          onDestroyStarted: () => {
             router.replace("/wfourtech", { scroll: false });
             driverObj.current.destroy();
          },
          onNextClick: (element:any, step:any) => {
              if (isMobile) {
                  // Step 2 mobile: Click Customers menu item to expand submenu/navigate
                  if (step.element === "#customers" || step.element === "#mobile-menu-trigger") {
                       if (step.element === "#mobile-menu-trigger") {
                           if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                       }
                      const customersMenu = document.getElementById("customers");
                      if (customersMenu) customersMenu.click();
                      
                      waitForElement("#customers-page").then(() => driverObj.current.moveNext());
                  }  
                  else {
                      driverObj.current.moveNext();
                  }
              } else {
                  // Desktop Logic
                  if (step.element === "#customers") {
                      const customersMenu = document.getElementById("customers");
                      if (customersMenu) customersMenu.click();
                      
                      waitForElement("#customers-page").then(() => driverObj.current.moveNext());
                  } else {
                      driverObj.current.moveNext();
                  }
              }
          }
      });
      driverObj.current.drive();
  };
