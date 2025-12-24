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

export const startCouponsListTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router,
    toggleMobileMenu,
    isMobileMenuOpen
}: TourProps) => {
    setIsSidebarOpen(true);

    const styleId = 'driver-custom-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .driver-popover.driverjs-theme { width: 90vw; max-width: 400px; }
          @media (min-width: 640px) { .driver-popover.driverjs-theme { min-width: 300px !important; width: auto; } }
          .driver-popover-title { font-size: 16px !important; font-weight: 600 !important; }
        `;
        document.head.appendChild(style);
    }

    const mobileSteps = [
        // 1. Trigger
        {
            element: "#mobile-menu-trigger",
            popover: {
                title: lang === "vi" ? "1. Menu Mobile" : "1. モバイルメニュー",
                description: lang === "vi" ? "Mở menu quản lý tại đây." : "ここで管理メニューを開きます。",
                side: "bottom", align: "start"
            }
        },
        // 2. Open Menu
        {
            element: "#coupons",
            popover: {
                title: lang === "vi" ? "2. Menu Khuyến Mãi" : "2. プロモーションメニュー",
                description: lang === "vi" ? "Chọn mục quản lý khuyến mãi." : "プロモーション管理項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select List
        {
            element: "#menu-subitem-coupons-list",
            popover: {
                title: lang === "vi" ? "3. Danh sách mã" : "3. クーポンリスト",
                description: lang === "vi" ? "Xem danh sách mã giảm giá." : "クーポンリストを表示します。",
                side: "bottom", align: "start"
            }
        }
    ];

    const desktopSteps = [
        // 1. Navigation
        {
            element: "#coupons",
            popover: {
                title: lang === "vi" ? "1. Quản lý khuyến mãi" : "1. プロモーション管理",
                description: lang === "vi" ? "Truy cập tại đây." : "ここからアクセスします。",
                side: "right", align: "start"
            }
        },
        {
            element: "#menu-subitem-coupons-list",
            popover: {
                title: lang === "vi" ? "2. Danh sách mã" : "2. クーポンリスト",
                description: lang === "vi" ? "Xem toàn bộ mã giảm giá hiện có." : "既存のクーポンをすべて表示します。",
                side: "right", align: "start"
            }
        }
    ];

    const commonSteps = [
         // 3. Header
        {
            element: "#coupons-list-header",
            popover: {
                title: lang === "vi" ? "3. Quản lý Coupon" : "3. クーポン管理",
                description: lang === "vi" 
                    ? "Giao diện quản lý các mã giảm giá." 
                    : "クーポン管理インターフェース。",
                side: "bottom", align: "start"
            }
        },
        // 4. Language Switcher
        {
            element: "#coupons-lang-switcher",
            popover: {
                title: lang === "vi" ? "4. Ngôn ngữ" : "4. 言語",
                description: lang === "vi"
                    ? "Chuyển đổi ngôn ngữ hiển thị cho danh sách (Tiếng Việt / Tiếng Nhật)."
                    : "リストの表示言語を切り替えます（ベトナム語/日本語）。",
                side: "bottom", align: "start"
            }
        },
        // 5. List Item
        {
            element: isMobile ? "#coupon-card-0" : "#coupon-item-0",
            popover: {
                title: lang === "vi" ? "5. Chi tiết mã" : "5. コードの詳細",
                description: lang === "vi"
                    ? "Thông tin chi tiết của từng mã giảm giá."
                    : "各割引コードの詳細。",
                side: "top", align: "center"
            }
        },
        // 6. Code
        {
            element: isMobile ? "#coupon-code-mobile-0" : "#coupon-code-0",
             popover: {
                title: lang === "vi" ? "6. Mã Code" : "6. クーポンコード",
                description: lang === "vi"
                    ? "Mã giảm giá (nhấn để sao chép)."
                    : "割引コード（クリックしてコピー）。",
                side: "top", align: "center"
            }
        },
        // 7. Program Name
        {
            element: isMobile ? "#coupon-name-mobile-0" : "#coupon-name-0",
            popover: {
                title: lang === "vi" ? "7. Tên chương trình" : "7. プログラム名",
                description: lang === "vi"
                    ? "Tên hiển thị của chương trình khuyến mãi."
                    : "プロモーションの表示名。",
                side: "top", align: "center"
            }
        },
        // 8. Value
         {
            element: isMobile ? "#coupon-card-value-0" : "#coupon-value-0",
            popover: {
                title: lang === "vi" ? "8. Giá trị" : "8. 値",
                description: lang === "vi"
                    ? "Giá trị giảm (VND/JPY hoặc %)."
                    : "割引額（VND / JPYまたは％）。",
                side: "top", align: "center"
            }
        },
        // 9. Limit/Used
         {
            element: isMobile ? "#coupon-card-limit-0" : "#coupon-limit-0",
            popover: {
                title: lang === "vi" ? "9. Giới hạn / Đã dùng" : "9. 制限 / 使用済み",
                description: lang === "vi"
                    ? "Số lượng mã đã sử dụng và giới hạn tối đa."
                    : "使用されたコードの数と最大制限。",
                side: "top", align: "center"
            }
        },
        // 10. Status
        {
            element: isMobile ? "#coupon-status-mobile-0" : "#coupon-status-0", 
            popover: {
                title: lang === "vi" ? "10. Trạng thái" : "10. ステータス",
                description: lang === "vi"
                    ? "Trạng thái hoạt động của mã (Hoạt động/Tạm dừng)."
                    : "コードのアクティブステータス（アクティブ/一時停止）。",
                side: "top", align: "center"
            }
        },
        // 11. Actions
        {
            element: isMobile ? "#coupon-card-actions-0" : "#coupon-actions-0",
            popover: {
                title: lang === "vi" ? "11. Thao tác" : "11. アクション",
                description: lang === "vi"
                    ? "Các hành động: Sửa thông tin hoặc Xóa mã."
                    : "アクション：情報を編集またはコードを削除。",
                side: "top", align: "center"
            }
        },
        // 12. Edit Button (Final)
        {
             element: isMobile ? "#btn-edit-coupon-mobile-0" : "#btn-edit-coupon-0",
             popover: {
                 title: lang === "vi" ? "12. Sửa mã" : "12. コードを編集",
                 description: lang === "vi"
                     ? "Đi tới trang chỉnh sửa mã giảm giá này."
                     : "この割引コードの編集ページに移動します。",
                 side: "top", align: "center"
             }
        }
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),
        ...commonSteps,
         { element: "body", popover: {} } // Dummy step
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
             const url = new URL(window.location.href);
             if (url.searchParams.has("tour")) {
                 url.searchParams.delete("tour");
                 router.replace(`${url.pathname}${url.search}`);
             }
             driverObj.current.destroy();
        },
        onHighlightStarted: (element:any, step:any, options:any) => {
             if (step.element === "#menu-subitem-coupons-list") {
                 const group = document.getElementById("coupons");
                 const sub = document.getElementById("menu-subitem-coupons-list");
                 if (group && (!sub || sub.offsetParent === null)) group.click();
             }
        },
        onNextClick: (element:any, step:any) => {
             if (step.element === "#mobile-menu-trigger") {
                  if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                  waitForElement("#coupons").then(() => driverObj.current.moveNext());
             }
             else if (step.element === "#coupons") {
                 if (isMobile) {
                      const menu = document.getElementById("coupons");
                      if (menu) menu.click();
                      waitForElement("#menu-subitem-coupons-list").then(() => {
                          setTimeout(() => driverObj.current?.moveNext(), 500);
                      });
                 } else {
                     const getSubItem = () => document.getElementById("menu-subitem-coupons-list");
                     const sidebar = document.getElementById("admin-sidebar");
                     const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                     if (getSubItem()) {
                          driverObj.current?.moveNext();
                     } else {
                          const menu = document.getElementById("coupons");
                          if (menu) {
                              if (isSidebarCollapsed) {
                                  menu.click();
                                  setTimeout(() => {
                                      menu.click();
                                      waitForElement("#menu-subitem-coupons-list").then(() => {
                                          setTimeout(() => driverObj.current?.moveNext(), 200);
                                      });
                                  }, 250);
                              } else {
                                  menu.click();
                                  waitForElement("#menu-subitem-coupons-list").then(() => {
                                      setTimeout(() => driverObj.current?.moveNext(), 200);
                                  });
                              }
                          } else {
                               driverObj.current?.moveNext();
                          }
                     }
                 }
             }
             else if (step.element === "#menu-subitem-coupons-list") {
                  const btn = document.getElementById("menu-subitem-coupons-list");
                  if (btn) btn.click();
                  waitForElement("#coupons-list-header").then(() => driverObj.current?.moveNext());
             }
             else if (step.element === (isMobile ? "#btn-edit-coupon-mobile-0" : "#btn-edit-coupon-0")) {
                 // Explicitly handle the edit transition
                     const targetId = isMobile ? "#btn-edit-coupon-mobile-0" : "#btn-edit-coupon-0";
                     const btn = document.querySelector(targetId) as HTMLElement;
                     if (btn) {
                         localStorage.setItem('tour_pending_coupon_edit', 'true');
                         btn.click();
                         driverObj.current.destroy();
                         setTimeout(() => {
                             startCouponsEditTour({
                                 lang,
                                 isMobile,
                                 setIsSidebarOpen,
                                 driverObj,
                                 router,
                                 toggleMobileMenu,
                                 isMobileMenuOpen
                             });
                         }, 500);
                     } else {
                         driverObj.current.destroy();
                     }
             }
             else {
                 driverObj.current?.moveNext();
             }
        }
    });

    driverObj.current.drive();
};

export const startCouponsEditTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router
}: TourProps) => {
    setIsSidebarOpen(false);

    const steps = [
        {
            element: "#coupon-add-header",
             popover: {
                title: lang === "vi" ? "12.1. Thông tin chung" : "12.1. 一般情報",
                description: lang === "vi" 
                    ? "Tiêu đề trang chỉnh sửa hoặc thêm mới." 
                    : "編集または新規追加ページのタイトル。",
                side: "bottom", align: "start"
            }
        },
        {
            element: "#coupon-code-input",
             popover: {
                title: lang === "vi" ? "12.2. Mã Code" : "12.2. クーポンコード",
                description: lang === "vi" 
                    ? "Nhập mã giảm giá (viết liền, không dấu). Để trống để tự động tạo." 
                    : "割引コードを入力（スペースなし）。空白のままにすると自動生成されます。",
                side: "bottom", align: "start"
            }
        },
        {
            element: "#coupon-name-group",
             popover: {
                title: lang === "vi" ? "12.3. Tên chương trình" : "12.3. プログラム名",
                description: lang === "vi" 
                    ? "Đặt tên chương trình hiển thị cho khách hàng (có hỗ trợ đa ngôn ngữ)." 
                    : "顧客に表示されるプログラム名を設定します（多言語対応）。",
                side: "bottom", align: "start"
            }
        },
        {
            element: "#coupon-type-group",
             popover: {
                title: lang === "vi" ? "12.4. Loại giảm giá" : "12.4. 割引タイプ",
                description: lang === "vi" 
                    ? "Chọn giảm theo Phần trăm (%) hoặc Số tiền cố định." 
                    : "パーセント（％）または固定額による割引を選択します。",
                side: "top", align: "start"
            }
        },
        {
            element: "#coupon-limit-group",
             popover: {
                title: lang === "vi" ? "12.5. Giới hạn" : "12.5. 制限",
                description: lang === "vi" 
                    ? "Số lượng mã tối đa có thể sử dụng." 
                    : "使用できるクーポンの最大数。",
                side: "top", align: "start"
            }
        },
        {
            element: "#coupon-value-group",
             popover: {
                title: lang === "vi" ? "12.6. Giá trị giảm" : "12.6. 割引額",
                description: lang === "vi" 
                    ? "Nhập giá trị giảm tương ứng cho từng loại tiền tệ (VND / JPY)." 
                    : "各通貨（VND / JPY）に対応する割引額を入力します。",
                side: "top", align: "start"
            }
        },
        {
            element: "#coupon-status-group",
             popover: {
                title: lang === "vi" ? "12.7. Trạng thái" : "12.7. ステータス",
                description: lang === "vi" 
                    ? "Bật/tắt kích hoạt mã ngay lập tức." 
                    : "コードの有効化をすぐにオン/オフします。",
                side: "top", align: "start"
            }
        },
        {
             element: "#btn-save-coupon",
             popover: {
                 title: lang === "vi" ? "12.8. Lưu lại" : "12.8. 保存",
                 description: lang === "vi" 
                     ? "Nhấn để hoàn tất việc tạo hoặc chỉnh sửa." 
                     : "作成または編集を完了するにはクリックしてください。",
                 side: "left", align: "center"
             }
        },
        {
             element: "#btn-cancel-coupon",
             popover: {
                 title: lang === "vi" ? "12.9. Hủy bỏ" : "12.9. キャンセル",
                 description: lang === "vi" 
                     ? "Nhấn để hủy và quay lại danh sách." 
                     : "キャンセルしてリストに戻るにはクリックしてください。",
                 side: "top", align: "center",
                 nextBtnText: lang === "vi" ? "Quay về" : "戻る",
                 onNextClick: () => {
                     const btn = document.getElementById("btn-cancel-coupon");
                     if (btn) {
                         btn.click();
                         driverObj.current.destroy();
                         setTimeout(() => {
                            startCouponsDeleteTour({
                                lang,
                                isMobile,
                                setIsSidebarOpen,
                                driverObj,
                                router
                             });
                         }, 800);
                     }
                 }
             }
        }
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps as any[],
        onDestroyStarted: () => {
             const url = new URL(window.location.href);
             if (url.searchParams.has("tour")) {
                 url.searchParams.delete("tour");
                 router.replace(`${url.pathname}${url.search}`);
             }
             localStorage.removeItem('tour_pending_coupon_edit');
             driverObj.current.destroy();
        }
    });

    driverObj.current.drive();
};

export const startCouponsDeleteTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router
}: TourProps) => {
    setIsSidebarOpen(true);
    
    // Target the first delete button
    const targetId = isMobile ? "#btn-delete-coupon-mobile-0" : "#btn-delete-coupon-0";

    const steps = [
        {
            element: targetId,
            popover: {
                title: lang === "vi" ? "13. Xóa mã" : "13. 削除",
                description: lang === "vi"
                    ? "Nhấn vào đây để xóa mã giảm giá này."
                    : "このクーポンを削除するにはここをクリックしてください。",
                side: "left", align: "center",
                nextBtnText: "Done"
            }
        }
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps as any[],
        onDestroyStarted: () => {
             const url = new URL(window.location.href);
             if (url.searchParams.has("tour")) {
                 url.searchParams.delete("tour");
                 window.history.replaceState(null, "", url.toString());
             }
             driverObj.current.destroy();
        }
    });

    driverObj.current.drive();
};

export const startCouponsAddTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router,
    toggleMobileMenu,
    isMobileMenuOpen
}: TourProps) => {
    setIsSidebarOpen(true);
    const styleId = 'driver-custom-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .driver-popover.driverjs-theme { width: 90vw; max-width: 400px; z-index: 10000000000 !important; }
          @media (min-width: 640px) { .driver-popover.driverjs-theme { min-width: 300px !important; width: auto; } }
          .driver-popover-title { font-size: 16px !important; font-weight: 600 !important; }
        `;
        document.head.appendChild(style);
    }

    const mobileSteps = [
        // 1. Trigger
        {
            element: "#mobile-menu-trigger",
            popover: {
                title: lang === "vi" ? "1. Menu Mobile" : "1. モバイルメニュー",
                description: lang === "vi" ? "Mở menu quản lý tại đây." : "ここで管理メニューを開きます。",
                side: "bottom", align: "start"
            }
        },
        // 2. Open Menu
        {
            element: "#mobile-coupons",
            popover: {
                title: lang === "vi" ? "2. Menu Khuyến Mãi" : "2. プロモーションメニュー",
                description: lang === "vi" ? "Chọn mục quản lý khuyến mãi." : "プロモーション管理項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select Add
        {
            element: "#mobile-menu-subitem-coupons-add",
            popover: {
                title: lang === "vi" ? "3. Chọn Thêm mới" : "3. 新規追加を選択",
                description: lang === "vi" 
                    ? "Nhấn vào đây để mở trang thêm mã giảm giá." 
                    : "ここをクリックしてクーポン追加ページを開きます。",
                side: "bottom", align: "start"
            }
        }
    ];

    const desktopSteps = [
        {
            element: "#coupons",
            popover: {
                title: lang === "vi" ? "1. Menu Khuyến mãi" : "1. プロモーションメニュー",
                description: lang === "vi" ? "Bắt đầu thêm mới từ menu này." : "このメニューから新規追加を開始します。",
                side: "right", align: "start"
            }
        },
        {
            element: "#menu-subitem-coupons-add",
             popover: {
                title: lang === "vi" ? "2. Chọn Thêm mới" : "2. 新規追加を選択",
                description: lang === "vi" 
                    ? "Nhấn vào đây để mở trang thêm mã giảm giá." 
                    : "ここをクリックしてクーポン追加ページを開きます。",
                side: "right", align: "start"
            }
        }
    ];

    const commonSteps = [
        {
            element: "#coupon-add-header",
             popover: {
                title: lang === "vi" ? "3. Form tạo mới" : "3. 新規作成フォーム",
                description: lang === "vi" 
                    ? "Giao diện tạo mới mã giảm giá." 
                    : "新しいクーポン作成インターフェース。",
                side: "bottom", align: "start"
            }
        },
        {
            element: "#coupon-code-input",
             popover: {
                title: lang === "vi" ? "4. Mã Code" : "4. クーポンコード",
                description: lang === "vi" 
                    ? "Nhập mã giảm giá mới. Để trống sẽ tự động tạo." 
                    : "新しいクーポンコードを入力します。空白の場合は自動生成されます。",
                side: "bottom", align: "start"
            }
        },
        {
            element: "#coupon-name-group",
             popover: {
                title: lang === "vi" ? "5. Tên chương trình" : "5. プログラム名",
                description: lang === "vi" 
                    ? "Đặt tên cho chương trình khuyến mãi." 
                    : "プロモーションの名前を設定します。",
                side: "bottom", align: "start"
            }
        },
        {
            element: "#coupon-type-group",
             popover: {
                title: lang === "vi" ? "6. Loại giảm giá" : "6. 割引タイプ",
                description: lang === "vi" 
                    ? "Chọn loại giảm giá (Phần trăm hoặc Số tiền)." 
                    : "割引タイプを選択します（パーセントまたは固定額）。",
                side: "top", align: "start"
            }
        },
        {
            element: "#coupon-limit-group",
             popover: {
                title: lang === "vi" ? "7. Giới hạn" : "7. 制限",
                description: lang === "vi" 
                    ? "Thiết lập số lượng giới hạn." 
                    : "数量制限を設定します。",
                side: "top", align: "start"
            }
        },
         {
            element: "#coupon-value-group",
             popover: {
                title: lang === "vi" ? "8. Giá trị" : "8. 値",
                description: lang === "vi" 
                    ? "Nhập giá trị khuyến mãi." 
                    : "プロモーション値を入力します。",
                side: "top", align: "start"
            }
        },
         {
            element: "#coupon-status-group",
             popover: {
                title: lang === "vi" ? "9. Kích hoạt" : "9. 有効化",
                description: lang === "vi" 
                    ? "Bật để mã có hiệu lực ngay sau khi lưu." 
                    : "保存後すぐにコードを有効にするにはオンにします。",
                side: "top", align: "start"
            }
        },
        {
             element: "#btn-save-coupon",
             popover: {
                 title: lang === "vi" ? "10. Lưu lại" : "10. 保存",
                 description: lang === "vi" 
                     ? "Lưu mã giảm giá mới." 
                     : "新しいクーポンを保存します。",
                 side: "left", align: "center"
             }
        },
         {
             element: "#btn-cancel-coupon",
             popover: {
                 title: lang === "vi" ? "11. Hủy bỏ" : "11. キャンセル",
                 description: lang === "vi" 
                     ? "Hủy thao tác và quay về danh sách." 
                     : "操作をキャンセルしてリストに戻ります。",
                 side: "top", align: "center",
                 nextBtnText: "Done",
                 onNextClick: () => {
                      // 1. Clean URL state (Router + History)
                      const url = new URL(window.location.href);
                      if (url.searchParams.has("tour")) {
                          url.searchParams.delete("tour");
                          // Update Next.js Router state to clear useSearchParams hook
                          router.replace(`${url.pathname}${url.search}`); 
                          // Update History immediately
                          window.history.replaceState(null, "", url.toString());
                      }
                      
                      localStorage.removeItem('tour_pending_coupon_add');
                      driverObj.current.destroy();

                      // 2. Trigger Navigation after cleanup
                      setTimeout(() => {
                          const btn = document.getElementById("btn-cancel-coupon");
                          if (btn) btn.click();
                      }, 100);
                 }
             }
        }
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),
        ...commonSteps
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps as any[],
        onHighlightStarted: (element:any, step:any, options:any) => {
             if (step.element === "#menu-subitem-coupons-add") {
                 const group = document.getElementById("coupons");
                 const sub = document.getElementById("menu-subitem-coupons-add");
                 if (group && (!sub || sub.offsetParent === null)) group.click();
             }
        },
        onDestroyStarted: () => {
             const url = new URL(window.location.href);
             if (url.searchParams.has("tour")) {
                 url.searchParams.delete("tour");
                 window.history.replaceState(null, "", url.toString());
             }
             localStorage.removeItem('tour_pending_coupon_add');
             driverObj.current.destroy();
        },
        onNextClick: (element:any, step:any, options:any) => {
             // Link the click actions
             if (step.element === "#mobile-menu-trigger") {
                 // Open Mobile Menu
                 if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                 waitForElement("#coupons").then(() => driverObj.current.moveNext());
             } else if (step.element === "#coupons" || step.element === "#mobile-coupons") {
                 if (isMobile) {
                     // Expand Group in Mobile Menu (Target unique mobile ID)
                     const btn = document.getElementById("mobile-coupons");
                     if (btn) btn.click();
                     waitForElement("#mobile-menu-subitem-coupons-add").then(() => {
                         // Increased delay to 800ms to ensure animation completes and element position is stable
                         setTimeout(() => driverObj.current.moveNext(), 800);
                     });
                 } else {
                     // Desktop Logic (Robust)
                     const getSubItem = () => document.getElementById("menu-subitem-coupons-add");
                     const sidebar = document.getElementById("admin-sidebar");
                     const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                     if (getSubItem()) {
                          driverObj.current?.moveNext();
                     } else {
                          const menu = document.getElementById("coupons");
                          if (menu) {
                              if (isSidebarCollapsed) {
                                  // Case 1: Sidebar Collapsed
                                  menu.click();
                                  setTimeout(() => {
                                      menu.click();
                                      waitForElement("#menu-subitem-coupons-add").then(() => {
                                          setTimeout(() => driverObj.current?.moveNext(), 200);
                                      });
                                  }, 250);
                              } else {
                                  // Case 2: Sidebar Expanded but submenu closed
                                  menu.click();
                                  waitForElement("#menu-subitem-coupons-add").then(() => {
                                      setTimeout(() => driverObj.current?.moveNext(), 200);
                                  });
                              }
                          } else {
                              driverObj.current?.moveNext();
                          }
                     }
                 }
             } else if (step.element === "#menu-subitem-coupons-add" || step.element === "#mobile-menu-subitem-coupons-add") {
                 // Click link and wait for transition
                 const targetId = isMobile ? "mobile-menu-subitem-coupons-add" : "menu-subitem-coupons-add";
                 const link = document.getElementById(targetId);
                 if (link) link.click();
                 waitForElement("#coupon-add-header").then(() => {
                     // Add delay to ensure mobile menu is fully closed and page is stable
                     setTimeout(() => driverObj.current.moveNext(), 500); 
                 });
             } else {
                 driverObj.current.moveNext();
             }
        }
    });

    driverObj.current.drive();
};
