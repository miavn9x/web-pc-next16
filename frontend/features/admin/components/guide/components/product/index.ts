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

export const startProductTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router,
    toggleMobileMenu,
    isMobileMenuOpen
}: TourProps) => {
    setIsSidebarOpen(true);
    
    // Inject styles
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
        // 2. Open Menu & Select Product Group
        {
            element: "#products",
            popover: {
                title: lang === "vi" ? "2. Menu Sản phẩm" : "2. 商品メニュー",
                description: lang === "vi" ? "Chọn mục sản phẩm." : "商品項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select Product List
        {
            element: "#menu-subitem-products-list",
            popover: {
                title: lang === "vi" ? "3. Danh sách sản phẩm" : "3. 商品リスト",
                description: lang === "vi" ? "Chọn danh sách sản phẩm." : "商品リストを選択します。",
                side: "bottom", align: "start"
            }
        },
        // 4. Close Menu - REMOVED (Menu closes automatically on navigation)

    ];

    const desktopSteps = [
        // 1. Navigation
        {
            element: "#products",
            popover: {
                title: lang === "vi" ? "1. Quản lý sản phẩm" : "1. 商品管理",
                description: lang === "vi" ? "Truy cập tại đây." : "ここからアクセスします。",
                side: "right", align: "start"
            }
        },
        {
            element: "#menu-subitem-products-list",
            popover: {
                title: lang === "vi" ? "2. Danh sách sản phẩm" : "2. 商品リスト",
                description: lang === "vi" ? "Vào trang danh sách." : "リストページに入ります。",
                side: "right", align: "start"
            }
        }
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),

        // 3. Language (Image 2)
        {
            element: "#btn-list-lang-toggle",
            popover: {
                title: lang === "vi" ? "3. Ngôn ngữ hiển thị" : "3. 表示言語",
                description: lang === "vi" ? "Chuyển đổi ngôn ngữ hiển thị (Việt/Nhật)." : "表示言語を切り替えます（ベトナム語/日本語）。",
                side: "left", align: "center"
            }
        },
        // 4. Filter (Image 3)
        {
            element: "#select-filter-category",
            popover: {
                title: lang === "vi" ? "4. Lọc danh mục" : "4. カテゴリフィルタ",
                description: lang === "vi" ? "Lọc nhanh sản phẩm theo nhóm." : "商品をグループですばやくフィルタリングします。",
                side: "bottom", align: "start"
            }
        },
        // 5. Search (Image 4)
        {
            element: "#input-search-product",
            popover: {
                title: lang === "vi" ? "5. Tìm kiếm" : "5. 検索",
                description: lang === "vi" ? "Nhập tên hoặc mã để tìm." : "名前またはコードを入力して検索します。",
                side: "bottom", align: "start"
            }
        },
        // 6. Pagination
        {
            element: "#pagination-container",
            popover: {
                title: lang === "vi" ? "6. Phân trang" : "6. ページネーション",
                description: lang === "vi" ? "Các nút điều hướng trang." : "ページナビゲーションボタン。",
                side: "top", align: "center"
            }
        },
        // 7. Product Info (Image 0)
        {
            element: isMobile ? "#mobile-product-info-0" : "#cell-product-0",
            popover: {
                title: lang === "vi" ? "7. Thông tin sản phẩm" : "7. 商品情報",
                description: lang === "vi" ? "Hình ảnh, tên và mã sản phẩm." : "画像、名前、商品コード。",
                side: "bottom", align: "start"
            }
        },
        // 8. Category (Image 1)
        {
            element: isMobile ? "#mobile-product-category-0" : "#cell-category-0",
            popover: {
                title: lang === "vi" ? "8. Danh mục" : "8. カテゴリ",
                description: lang === "vi" ? "Loại sản phẩm." : "商品の種類。",
                side: "bottom", align: "center"
            }
        },
        // 9. Price (Image 2)
        {
            element: isMobile ? "#mobile-product-price-0" : "#cell-price-0",
            popover: {
                title: lang === "vi" ? "9. Giá bán" : "9. 販売価格",
                description: lang === "vi" ? "Giá hiện tại của sản phẩm." : "商品の現在の価格。",
                side: "bottom", align: "center"
            }
        },
        // 10. Actions (Image 3)
        {
            element: isMobile ? "#mobile-product-actions-0" : "#cell-actions-0",
            popover: {
                title: lang === "vi" ? "10. Hành động" : "10. アクション",
                description: lang === "vi" 
                    ? "Các nút chức năng: Xem chi tiết (xanh), Sửa (xanh), Xóa (đỏ)." 
                    : "機能ボタン：詳細表示（青）、編集（青）、削除（赤）。",
                side: "left", align: "center"
            }
        },
        // 11. View Detail
        {
            element: isMobile ? "#mobile-btn-view-product-0" : "#btn-view-product-0",
            popover: {
                title: lang === "vi" ? "11. Xem chi tiết" : "11. 詳細表示",
                description: lang === "vi" 
                    ? "Click để xem popup chi tiết. (Tour sẽ tự động click)" 
                    : "詳細ポップアップを表示します。（ツアーが自動的にクリックします）",
                side: "left", align: "center"
            }
        },
        // 11.1 Main Image
        {
            element: "#detail-main-image",
            popover: {
                title: lang === "vi" ? "11.1 Hình ảnh" : "11.1 商品画像",
                description: lang === "vi" ? "Hình ảnh chính của sản phẩm." : "商品のメイン画像。",
                side: "right", align: "center"
            }
        },
        // 11.2 Description
        {
            element: "#detail-description",
            popover: {
                title: lang === "vi" ? "11.2 Mô tả" : "11.2 商品説明",
                description: lang === "vi" ? "Thông tin mô tả chi tiết." : "詳細な商品説明。",
                side: "left", align: "center"
            }
        },
        // 11.3 Gallery
        {
            element: "#detail-gallery-section",
            popover: {
                title: lang === "vi" ? "11.3 Thư viện ảnh" : "11.3 ギャラリー",
                description: lang === "vi" ? "Các hình ảnh khác của sản phẩm." : "その他の商品画像。",
                side: "bottom", align: "center"
            }
        },
        // 11.4 Variants
        {
            element: "#detail-variants-section",
            popover: {
                title: lang === "vi" ? "11.4 Các phiên bản" : "11.4 バリエーション",
                description: lang === "vi" ? "Danh sách các phiên bản sản phẩm." : "商品バリエーションのリスト。",
                side: "top", align: "center"
            }
        },
        // 11.5 Weight (Variant Label on Mobile)
        {
            element: isMobile ? "#mobile-detail-variant-label-0" : "#detail-th-weight",
            popover: {
                title: lang === "vi" ? "11.5 Trọng lượng/Phiên bản" : "11.5 重量/バリエーション",
                description: lang === "vi" ? "Thông tin trọng lượng hoặc phiên bản." : "重量またはバリエーション情報。",
                side: "top", align: "center"
            }
        },
        // 11.6 Original Price
        {
            element: isMobile ? "#mobile-detail-original-0" : "#detail-th-original",
            popover: {
                title: lang === "vi" ? "11.6 Giá gốc" : "11.6 元値",
                description: lang === "vi" ? "Giá niêm yết ban đầu." : "元の定価。",
                side: "top", align: "center"
            }
        },
        // 11.7 Discount
        {
            element: isMobile ? "#mobile-detail-discount-0" : "#detail-th-discount",
            popover: {
                title: lang === "vi" ? "11.7 Giảm giá" : "11.7 割引",
                description: lang === "vi" ? "Phần trăm giảm giá." : "割引率。",
                side: "top", align: "center"
            }
        },
        // 11.8 Sale Price
        {
            element: isMobile ? "#mobile-detail-sale-0" : "#detail-th-sale",
            popover: {
                title: lang === "vi" ? "11.8 Giá bán" : "11.8 販売価格",
                description: lang === "vi" ? "Giá bán thực tế sau khi giảm." : "割引後の実際の販売価格。",
                side: "top", align: "center"
            }
        },
        // 11.9 Edit in Modal
        {
            element: "#detail-btn-edit",
            popover: {
                title: lang === "vi" ? "11.9 Sửa" : "11.9 編集",
                description: lang === "vi" ? "Nút sửa nhanh trong popup." : "ポップアップ内のクイック編集ボタン。",
                side: "top", align: "center"
            }
        },
        // 11.10 Close Modal
        {
            element: "#detail-btn-close",
            popover: {
                title: lang === "vi" ? "11.10 Đóng" : "11.10 閉じる",
                description: lang === "vi" 
                    ? "Đóng popup để quay lại danh sách. (Tour sẽ tự động click)" 
                    : "リストに戻るためにポップアップを閉じます。（ツアーが自動的にクリックします）",
                side: "top", align: "center"
            }
        },
        // 12. Transition to Edit Page (Link from List)
        {
            element: isMobile ? "#mobile-btn-edit-product-0" : "#btn-edit-product-0",
            popover: {
                title: lang === "vi" ? "12. Chỉnh sửa" : "12. 編集",
                description: lang === "vi"
                   ? "Chúng tôi sẽ nhấn nút Sửa để hướng dẫn bạn trang tiếp theo."
                   : "次のページを案内するために編集ボタンをクリックします。",
                side: "left", align: "center"
            }
        },
         // Edit Page Flow - Starts after transition
        {
            element: "#product-edit-form",
            popover: {
                title: lang === "vi" ? "12.1 Form chỉnh sửa" : "12.1 編集フォーム",
                description: lang === "vi" ? "Giao diện sửa sản phẩm chi tiết." : "詳細な商品編集インターフェース。",
                side: "bottom", align: "center"
            }
        },
        // 12.2 Product Name
        {
            element: "#field-product-name",
            popover: {
                title: lang === "vi" ? "12.2 Tên sản phẩm" : "12.2 商品名",
                description: lang === "vi" ? "Nhập tên sản phẩm (VN/JA)." : "商品名を入力します (VN/JA)。",
                side: "bottom", align: "start"
            }
        },
        // 12.3 Description
        {
            element: "#field-product-desc",
            popover: {
                title: lang === "vi" ? "12.3 Mô tả sản phẩm" : "12.3 商品説明",
                description: lang === "vi" ? "Nhập mô tả chi tiết." : "詳細な説明を入力します。",
                side: "top", align: "center"
            }
        },
        // 12.4 Category
        {
            element: "#field-product-category",
            popover: {
                title: lang === "vi" ? "12.4 Danh mục" : "12.4 カテゴリ",
                description: lang === "vi" ? "Chọn danh mục sản phẩm." : "商品カテゴリを選択します。",
                side: "top", align: "center"
            }
        },
        // 12.5 Cover Image
        {
            element: "#field-product-cover",
            popover: {
                title: lang === "vi" ? "12.5 Hình ảnh chính *" : "12.5 メイン画像 (カバー) *",
                description: lang === "vi" ? "Upload ảnh bìa sản phẩm." : "商品のカバー画像をアップロードします。",
                side: "top", align: "center"
            }
        },
        // 12.6 Has Variants Toggle
        {
            element: "#hasVariants-checkbox",
            popover: {
                title: lang === "vi" ? "12.6 Sản phẩm có biến thể" : "12.6 バリエーションあり",
                description: lang === "vi" ? "Tích chọn nếu sản phẩm có nhiều phiên bản." : "商品にバリエーションがある場合はチェックします。",
                side: "right", align: "center"
            }
        },
        // 12.7 Add Variant Button
        {
            element: "#btn-add-variant",
            popover: {
                title: lang === "vi" ? "12.7 Thêm phiên bản" : "12.7 バリエーション追加",
                description: lang === "vi" ? "Nhấn để thêm phiên bản mới." : "新しいバリエーションを追加します。",
                side: "top", align: "center"
            }
        },
        // 12.8 Variant 1 Size/Weight
        {
            element: "#variant-size-0",
            popover: {
                title: lang === "vi" ? "12.8 Kích thước (trọng lượng) *" : "12.8 サイズ (重量) *",
                description: lang === "vi" ? "VD: 500g, Size L..." : "例: 500g, Size L...",
                side: "top", align: "center"
            }
        },
        // 12.9 Original Price VN
        {
            element: "#variant-price-vi-0",
            popover: {
                title: lang === "vi" ? "12.9 Giá gốc (VNĐ) *" : "12.9 元値 (VNĐ) *",
                description: lang === "vi" ? "Nhập giá gốc bằng VNĐ." : "VNĐで元値を入力します。",
                side: "top", align: "center"
            }
        },
        // 12.10 Discount % VN
        {
            element: "#variant-discount-vi-0",
            popover: {
                title: lang === "vi" ? "12.10 Giảm giá (%)" : "12.10 割引 (%)",
                description: lang === "vi" ? "Nhập phần trăm giảm giá." : "割引率を入力します。",
                side: "top", align: "center"
            }
        },
        // 12.11 Original Price JA
        {
            element: "#variant-price-ja-0",
            popover: {
                title: lang === "vi" ? "12.11 Giá gốc (¥) *" : "12.11 元値 (¥) *",
                description: lang === "vi" ? "Nhập giá gốc bằng Yên Nhật." : "日本円で元値を入力します。",
                side: "top", align: "center"
            }
        },
        // 12.12 Discount % JA
        {
            element: "#variant-discount-ja-0",
            popover: {
                title: lang === "vi" ? "12.12 Giảm giá (%)" : "12.12 割引 (%)",
                description: lang === "vi" ? "Nhập phần trăm giảm giá (JA)." : "割引率を入力します (JA)。",
                side: "top", align: "center"
            }
        },
        // 12.13 Actions
        {
            element: "#btn-cancel-edit",
            popover: {
                title: lang === "vi" ? "12.13 Hủy" : "12.13 キャンセル",
                description: lang === "vi" ? "Hủy bỏ thay đổi và quay lại." : "変更をキャンセルして戻ります。",
                side: "top", align: "center"
            }
        },
        {
            element: "#btn-update-edit",
            popover: {
                title: lang === "vi" ? "12.14 Cập nhật" : "12.14 更新",
                description: lang === "vi"
                    ? "Lưu lại. (Tour sẽ tự động nhấn Hủy để quay về danh sách)"
                    : "保存します。（ツアーは自動的にキャンセルをクリックしてリストに戻ります）",
                side: "top", align: "center"
            }
        },
        // 13. Delete
        {
            element: isMobile ? "#mobile-btn-delete-product-0" : "#btn-delete-product-0",
            popover: {
                title: lang === "vi" ? "13. Xóa sản phẩm" : "13. 商品を削除",
                description: lang === "vi" ? "Xóa sản phẩm khỏi danh sách. Hành động này không thể hoàn tác. Vui lòng cân nhắc kỹ." : "リストから商品を削除します。この操作は取り消せません。慎重に検討してください。",
                side: "left", align: "center"
            }
        }
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
             router.replace("/wfourtech", { scroll: false });
             driverObj.current.destroy();
        },
        onHighlightStarted: (element:any, step:any, options:any) => {
             if (step.element === "#menu-subitem-products-list") {
                 const group = document.getElementById("products");
                 const sub = document.getElementById("menu-subitem-products-list");
                 if (group && (!sub || sub.offsetParent === null)) group.click();
             }
        },
        onNextClick: (element:any, step:any, options:any) => {
             // Link the click actions
             if (step.element === "#mobile-menu-trigger") {
                 // Open Mobile Menu
                 if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                 waitForElement("#products").then(() => driverObj.current.moveNext());
             } else if (step.element === "#products") {
                 if (isMobile) {
                     // Expand Product Group in Mobile Menu
                     const btn = document.getElementById("products");
                     if (btn) btn.click();
                     waitForElement("#menu-subitem-products-list").then(() => {
                         setTimeout(() => driverObj.current.moveNext(), 500);
                     });
                 } else {
                     // Desktop Logic (Robust)
                     const getSubItem = () => document.getElementById("menu-subitem-products-list");
                     const sidebar = document.getElementById("admin-sidebar");
                     const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                     if (getSubItem()) {
                          driverObj.current?.moveNext();
                     } else {
                          const productsMenu = document.getElementById("products");
                          if (productsMenu) {
                              if (isSidebarCollapsed) {
                                  // Case 1: Sidebar Collapsed -> Click to open sidebar -> Wait -> Click to open submenu
                                  productsMenu.click();
                                  setTimeout(() => {
                                      productsMenu.click();
                                      waitForElement("#menu-subitem-products-list").then(() => {
                                          setTimeout(() => driverObj.current?.moveNext(), 200);
                                      });
                                  }, 250);
                              } else {
                                  // Case 2: Sidebar Expanded but submenu closed -> Click to open submenu
                                  productsMenu.click();
                                  waitForElement("#menu-subitem-products-list").then(() => {
                                      setTimeout(() => driverObj.current?.moveNext(), 200);
                                  });
                              }
                          } else {
                              driverObj.current?.moveNext();
                          }
                     }
                 }
             } else if (step.element === "#menu-subitem-products-list") {
                 // Click link and wait for transition (Mobile menu auto-closes)
                 const link = document.getElementById("menu-subitem-products-list");
                 if (link) link.click();
                 waitForElement("#btn-list-lang-toggle").then(() => driverObj.current.moveNext()); 
             } else if (step.element === "#btn-view-product-0" || step.element === "#mobile-btn-view-product-0") {
                 // Open View Modal
                 const btn = document.getElementById(isMobile ? "mobile-btn-view-product-0" : "btn-view-product-0");
                 if (btn) btn.click();
                 waitForElement("#detail-main-image").then(() => driverObj.current.moveNext());
             } else if (step.element === "#detail-btn-close") {
                 // Close View Modal
                 const btn = document.getElementById("detail-btn-close");
                 if (btn) btn.click();
                 const nextSelector = isMobile ? "#mobile-btn-view-product-0" : "#btn-view-product-0";
                 waitForElement(nextSelector).then(() => driverObj.current.moveNext());
             } else if (step.element === "#btn-edit-product-0" || step.element === "#mobile-btn-edit-product-0") {
                 // Go to Edit Page
                 const btn = document.getElementById(isMobile ? "mobile-btn-edit-product-0" : "btn-edit-product-0");
                 if (btn) btn.click();
                 waitForElement("#product-edit-form").then(() => driverObj.current.moveNext());
             } else if (step.element === "#btn-update-edit") {
                 // Return to List by clicking Cancel (safer for tour)
                 const btn = document.getElementById("btn-cancel-edit");
                 if (btn) btn.click();
                 const nextSelector = isMobile ? "#mobile-btn-delete-product-0" : "#btn-delete-product-0";
                 waitForElement(nextSelector).then(() => {
                     setTimeout(() => driverObj.current.moveNext(), 500);
                 });
             } else {
                 driverObj.current.moveNext();
             }
        }
    });
    driverObj.current.drive();
};

export const startProductAddTour = ({
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
        // 2. Open Menu & Select Product Group
        {
            element: "#products",
            popover: {
                title: lang === "vi" ? "2. Menu Sản phẩm" : "2. 商品メニュー",
                description: lang === "vi" ? "Chọn mục sản phẩm." : "商品項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select Add New
        {
            element: "#menu-subitem-products-add",
            popover: {
                title: lang === "vi" ? "3. Chọn Thêm mới" : "3. 新規追加を選択",
                description: lang === "vi" ? "Nhấn vào đây để mở trang thêm sản phẩm." : "ここをクリックして商品追加ページを開きます。",
                side: "bottom", align: "start"
            }
        }
    ];

    const desktopSteps = [
        // 1. Navigation to Products
        {
            element: "#products",
            popover: {
                title: lang === "vi" ? "1. Menu Sản phẩm" : "1. 商品メニュー",
                description: lang === "vi" ? "Bắt đầu thêm mới từ menu này." : "このメニューから新規追加を開始します。",
                side: "right", align: "start"
            }
        },
        // 2. Select Add New
        {
            element: "#menu-subitem-products-add",
            popover: {
                title: lang === "vi" ? "2. Chọn Thêm mới" : "2. 新規追加を選択",
                description: lang === "vi" ? "Nhấn vào đây để mở trang thêm sản phẩm." : "ここをクリックして商品追加ページを開きます。",
                side: "right", align: "start"
            }
        }
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),
        // 3. Language Toggle
        {
            element: "#btn-language-toggle",
            popover: {
                title: lang === "vi" ? "3. Ngôn ngữ nhập liệu" : "3. 入力言語",
                description: lang === "vi" ? "Chuyển đổi giữa tiếng Việt và tiếng Nhật khi nhập liệu." : "入力時にベトナム語と日本語を切り替えます。",
                side: "left", align: "center"
            }
        },
        // 4. Basic Info Section (Outside)
        {
            element: "#section-basic-info",
            popover: {
                title: lang === "vi" ? "4. Thông tin cơ bản" : "4. 基本情報",
                description: lang === "vi"
                    ? "Đây là phần thông tin cơ bản của sản phẩm. Bạn cần nhập tên sản phẩm bằng cả tiếng Việt và tiếng Nhật. Đây là trường bắt buộc (*) và sẽ hiển thị trên trang chủ."
                    : "これは製品の基本情報セクションです。ベトナム語と日本語の両方で商品名を入力する必要があります。これは必須フィールド（*）で、ホームページに表示されます。",
                side: "top", align: "start"
            }
        },
        // 4.1 Name VN (Inside)
        {
            element: "#group-name-vi",
            popover: {
                title: lang === "vi" ? "4.1 Tên sản phẩm (VN) *" : "4.1 商品名 (VN) *",
                description: lang === "vi"
                    ? "Nhập tên sản phẩm bằng tiếng Việt. Tên này sẽ hiển thị cho khách hàng Việt Nam. Ví dụ: \"Bánh tráng trộn sa tế\", \"Mực rim me\". Đây là trường bắt buộc."
                    : "ベトナム語で商品名を入力します。この名前はベトナムの顧客に表示されます。例：\"Bánh tráng trộn sa tế\"、\"Mực rim me\"。必須フィールドです。",
                side: "bottom", align: "start"
            }
        },
        // 4.2 Name JA (Inside)
        {
            element: "#group-name-ja",
            popover: {
                title: lang === "vi" ? "4.2 Tên sản phẩm (JA) *" : "4.2 商品名 (JA) *",
                description: lang === "vi"
                    ? "Nhập tên sản phẩm bằng tiếng Nhật. Tên này sẽ hiển thị cho khách hàng Nhật Bản. Ví dụ: \"ライスペーパーサラダ\", \"イカの甘辛煮\". Đây là trường bắt buộc."
                    : "日本語で商品名を入力します。この名前は日本の顧客に表示されます。例：\"ライスペーパーサラダ\"、\"イカの甘辛煮\"。必須フィールドです。",
                side: "bottom", align: "start"
            }
        },
        // 5. Description Section (Outside)
        {
            element: "#section-description",
            popover: {
                title: lang === "vi" ? "5. Mô tả sản phẩm" : "5. 商品説明",
                description: lang === "vi"
                    ? "Phần mô tả chi tiết về sản phẩm. Bạn có thể thêm hình ảnh, định dạng văn bản (in đậm, nghiêng), và các thông tin chi tiết giúp khách hàng hiểu rõ hơn về sản phẩm."
                    : "製品の詳細説明セクションです。画像の追加、テキストの書式設定（太字、斜体）、製品の詳細情報を追加できます。",
                side: "top", align: "start"
            }
        },
        // 5.1 Description VN (Inside)
        {
            element: "#group-desc-vi",
            popover: {
                title: lang === "vi" ? "5.1 Mô tả (VN)" : "5.1 説明 (VN)",
                description: lang === "vi"
                    ? "Nhập mô tả chi tiết bằng tiếng Việt. Bạn có thể sử dụng thanh công cụ phía trên để định dạng văn bản, thêm link, hình ảnh. Mô tả tốt giúp tăng tỷ lệ mua hàng."
                    : "ベトナム語で詳細な説明を入力します。上部のツールバーを使用してテキストの書式設定、リンク、画像の追加ができます。良い説明は購入率を高めます。",
                side: "top", align: "center"
            }
        },
        // 5.2 Description JA (Inside)
        {
            element: "#group-desc-ja",
            popover: {
                title: lang === "vi" ? "5.2 Mô tả (JA)" : "5.2 説明 (JA)",
                description: lang === "vi"
                    ? "Nhập mô tả chi tiết bằng tiếng Nhật. Nội dung nên tương đương với mô tả tiếng Việt để khách hàng Nhật Bản có thể hiểu rõ về sản phẩm."
                    : "日本語で詳細な説明を入力します。内容はベトナム語の説明と同等にし、日本の顧客が製品を理解できるようにしてください。",
                side: "top", align: "center"
            }
        },
        // 6. Category Section (Outside)
        {
            element: "#section-category",
            popover: {
                title: lang === "vi" ? "6. Danh mục" : "6. カテゴリ",
                description: lang === "vi"
                    ? "Phần phân loại sản phẩm theo danh mục. Việc chọn đúng danh mục giúp khách hàng dễ dàng tìm kiếm và lọc sản phẩm trên website."
                    : "製品をカテゴリ別に分類するセクションです。正しいカテゴリを選択すると、顧客がウェブサイトで製品を簡単に検索・フィルタリングできます。",
                side: "top", align: "start"
            }
        },
        // 6.1 Category VN (Inside)
        {
            element: "#group-category-vi",
            popover: {
                title: lang === "vi" ? "6.1 Danh mục (VN) *" : "6.1 カテゴリ (VN) *",
                description: lang === "vi"
                    ? "Chọn danh mục phù hợp với sản phẩm từ danh sách. Ví dụ: Bánh tráng, Các loại khô, Đồ ăn vặt, Trái cây. Danh mục tiếng Nhật sẽ tự động cập nhật."
                    : "リストから製品に適したカテゴリを選択します。例：ライスペーパー、乾物、スナック、果物。日本語のカテゴリは自動的に更新されます。",
                side: "top", align: "center"
            }
        },
        // 6.2 Category JA (Inside)
        {
            element: "#group-category-ja",
            popover: {
                title: lang === "vi" ? "6.2 Danh mục (JA)" : "6.2 カテゴリ (JA)",
                description: lang === "vi"
                    ? "Trường này tự động cập nhật dựa trên danh mục tiếng Việt mà bạn đã chọn. Bạn không cần nhập thủ công."
                    : "このフィールドは選択したベトナム語カテゴリに基づいて自動的に更新されます。手動で入力する必要はありません。",
                side: "top", align: "center"
            }
        },
        // 7. Price Section (Outside)
        {
            element: "#section-price",
            popover: {
                title: lang === "vi" ? "7. Giá sản phẩm" : "7. 価格",
                description: lang === "vi"
                    ? "Phần thiết lập khoảng giá sản phẩm. Nếu sản phẩm có nhiều phiên bản với giá khác nhau, hãy nhập mức giá thấp nhất và cao nhất. Giá được hiển thị theo cả VNĐ và Yên Nhật."
                    : "製品の価格帯を設定するセクションです。製品に異なる価格のバリエーションがある場合は、最低価格と最高価格を入力してください。価格はVNĐと日本円の両方で表示されます。",
                side: "top", align: "start"
            }
        },
        // 7.1 Price VN Min
        {
            element: "#input-price-vi-min",
            popover: {
                title: lang === "vi" ? "7.1 Giá VNĐ (Tối thiểu)" : "7.1 VNĐ価格 (最小)",
                description: lang === "vi"
                    ? "Nhập giá thấp nhất bằng VNĐ. Ví dụ: nếu sản phẩm có các gói 50.000đ, 70.000đ, 100.000đ thì nhập 50000."
                    : "VNĐでの最低価格を入力します。例：製品に50,000đ、70,000đ、100,000đのパックがある場合は50000と入力します。",
                side: "top", align: "center"
            }
        },
        // 7.2 Price VN Max
        {
            element: "#input-price-vi-max",
            popover: {
                title: lang === "vi" ? "7.2 Giá VNĐ (Tối đa)" : "7.2 VNĐ価格 (最大)",
                description: lang === "vi"
                    ? "Nhập giá cao nhất bằng VNĐ. Tiếp tục ví dụ trên, bạn sẽ nhập 100000. Khoảng giá sẽ hiển thị là \"50,000đ - 100,000đ\"."
                    : "VNĐでの最高価格を入力します。上記の例では、100000と入力します。価格帯は\"50,000đ - 100,000đ\"と表示されます。",
                side: "top", align: "center"
            }
        },
        // 7.3 Price JA Min
        {
            element: "#input-price-ja-min",
            popover: {
                title: lang === "vi" ? "7.3 Giá Yên (Tối thiểu)" : "7.3 円価格 (最小)",
                description: lang === "vi"
                    ? "Nhập giá thấp nhất bằng Yên Nhật. Ví dụ: nếu giá quy đổi từ 50.000đ là khoảng 700¥, hãy nhập 700."
                    : "日本円での最低価格を入力します。例：50,000đからの換算が約700¥の場合、700と入力します。",
                side: "top", align: "center"
            }
        },
        // 7.4 Price JA Max
        {
            element: "#input-price-ja-max",
            popover: {
                title: lang === "vi" ? "7.4 Giá Yên (Tối đa)" : "7.4 円価格 (最大)",
                description: lang === "vi"
                    ? "Nhập giá cao nhất bằng Yên Nhật. Ví dụ: nếu giá 100.000đ quy đổi là 1.400¥, hãy nhập 1400."
                    : "日本円での最高価格を入力します。例：100,000đの換算が1,400¥の場合、1400と入力します。",
                side: "top", align: "center"
            }
        },
        // 8. Image Section (Outside)
        {
            element: "#section-image",
            popover: {
                title: lang === "vi" ? "8. Hình ảnh sản phẩm" : "8. 商品画像",
                description: lang === "vi"
                    ? "Phần tải lên hình ảnh sản phẩm. Ảnh đẹp và rõ ràng sẽ thu hút khách hàng hơn. Bạn cần ít nhất 1 ảnh bìa và có thể thêm tối đa 6 ảnh chi tiết."
                    : "製品画像をアップロードするセクションです。美しく鮮明な画像は顧客をより引き付けます。少なくとも1つのカバー画像が必要で、最大6つの詳細画像を追加できます。",
                side: "top", align: "start"
            }
        },
        // 8.1 Cover Image
        {
            element: "#input-image-cover",
            popover: {
                title: lang === "vi" ? "8.1 Ảnh bìa *" : "8.1 カバー画像 *",
                description: lang === "vi"
                    ? "Chọn ảnh bìa - ảnh chính đại diện cho sản phẩm. Ảnh này sẽ hiển thị trên danh sách sản phẩm và trang chủ. Nên chọn ảnh chất lượng cao, rõ nét."
                    : "カバー画像を選択します - 製品を代表するメイン画像。この画像は製品リストとホームページに表示されます。高品質で鮮明な画像を選択してください。",
                side: "top", align: "center"
            }
        },
        // 8.2 Gallery Images
        {
            element: "#input-image-gallery",
            popover: {
                title: lang === "vi" ? "8.2 Ảnh chi tiết" : "8.2 詳細画像",
                description: lang === "vi"
                    ? "Thêm các ảnh chi tiết khác về sản phẩm (tối đa 6 ảnh). Ví dụ: ảnh từ nhiều góc độ, ảnh đóng gói, ảnh thành phần. Ảnh chi tiết giúp khách hàng đưa ra quyết định mua hàng."
                    : "製品に関する追加の詳細画像（最大6枚）。例：さまざまな角度からの写真、パッケージ写真、成分写真。詳細画像は顧客の購入決定を助けます。",
                side: "top", align: "center"
            }
        },
        // 9. Variants Section
        {
            element: "#checkbox-has-variants",
            popover: {
                title: lang === "vi" ? "9. Sản phẩm có biến thể" : "9. バリエーションあり",
                description: lang === "vi"
                    ? "Bật tùy chọn này nếu sản phẩm có nhiều phiên bản khác nhau về kích thước, trọng lượng hoặc giá. Ví dụ: gói 200g, 500g, 1kg với giá khác nhau."
                    : "製品にサイズ、重量、価格が異なる複数のバリエーションがある場合、このオプションをオンにします。例：200g、500g、1kgのパックで価格が異なる場合。",
                side: "right", align: "center"
            }
        },
        // 9.1 Add Variant Button
        {
            element: "#btn-add-variant",
            popover: {
                title: lang === "vi" ? "9.1 Thêm phiên bản" : "9.1 バリエーション追加",
                description: lang === "vi"
                    ? "Nhấn nút này để thêm một phiên bản mới. Mỗi phiên bản có thể có kích thước và giá riêng. Tour sẽ tự động click để bạn thấy form nhập liệu xuất hiện."
                    : "このボタンをクリックして新しいバリエーションを追加します。各バリエーションには独自のサイズと価格を設定できます。ツアーが自動的にクリックして入力フォームを表示します。",
                side: "top", align: "center"
            }
        },
        // 9.2 Variant Size
        {
            element: "#variant-size-0",
            popover: {
                title: lang === "vi" ? "9.2 Kích thước" : "9.2 サイズ",
                description: lang === "vi"
                    ? "Nhập kích thước hoặc trọng lượng của phiên bản này. Ví dụ: \"200g\", \"500g\", \"1kg\", \"Hộp nhỏ\", \"Hộp lớn\". Thông tin này giúp khách hàng chọn đúng sản phẩm."
                    : "このバリエーションのサイズまたは重量を入力します。例：\"200g\"、\"500g\"、\"1kg\"、\"小箱\"、\"大箱\"。この情報は顧客が適切な製品を選択するのに役立ちます。",
                side: "top", align: "center"
            }
        },
        // 9.3 Variant Price VN
        {
            element: "#variant-price-vi-0",
            popover: {
                title: lang === "vi" ? "9.3 Giá (VNĐ)" : "9.3 価格 (VNĐ)",
                description: lang === "vi"
                    ? "Nhập giá gốc bằng VNĐ cho phiên bản này. Đây là giá trước khi giảm. Ví dụ: gói 500g có thể giá 70000."
                    : "このバリエーションのVNĐでの元の価格を入力します。これは割引前の価格です。例：500gパックの価格は70000。",
                side: "top", align: "center"
            }
        },
        // 9.4 Variant Discount VN
        {
            element: "#variant-discount-vi-0",
            popover: {
                title: lang === "vi" ? "9.4 Giảm (%)" : "9.4 割引 (%)",
                description: lang === "vi"
                    ? "Nhập phần trăm giảm giá (0-100). Ví dụ: giảm 10% thì nhập 10. Nếu không giảm giá thì để 0. Giá sau giảm sẽ tự động tính."
                    : "割引率（0-100）を入力します。例：10%割引の場合は10と入力します。割引がない場合は0のままにします。割引後の価格は自動計算されます。",
                side: "top", align: "center"
            }
        },
        // 9.5 Variant Price JA
        {
            element: "#variant-price-ja-0",
            popover: {
                title: lang === "vi" ? "9.5 Giá (¥)" : "9.5 価格 (¥)",
                description: lang === "vi"
                    ? "Nhập giá gốc bằng Yên Nhật cho phiên bản này. Ví dụ: gói 500g có thể giá 1000¥. Giá này hiển thị cho khách hàng Nhật."
                    : "このバリエーションの日本円での元の価格を入力します。例：500gパックの価格は1000¥。この価格は日本の顧客に表示されます。",
                side: "top", align: "center"
            }
        },
        // 9.6 Variant Discount JA
        {
            element: "#variant-discount-ja-0",
            popover: {
                title: lang === "vi" ? "9.6 Giảm (%) (JA)" : "9.6 割引 (%) (JA)",
                description: lang === "vi"
                    ? "Nhập phần trăm giảm giá cho giá Yên (0-100). Tương tự như giảm giá VNĐ. Có thể khác với tỷ lệ giảm VNĐ nếu cần."
                    : "日本円価格の割引率（0-100）を入力します。VNĐの割引と同様です。必要に応じてVNĐの割引率と異なる値にできます。",
                side: "top", align: "center"
            }
        },
        // 10. Cancel Button
        {
            element: "#btn-cancel-add",
            popover: {
                title: lang === "vi" ? "10. Hủy" : "10. キャンセル",
                description: lang === "vi"
                    ? "Nhấn nút này để hủy bỏ việc thêm sản phẩm mới và quay lại danh sách. Tất cả thông tin đã nhập sẽ không được lưu."
                    : "このボタンをクリックすると、新規製品の追加をキャンセルしてリストに戻ります。入力した情報はすべて保存されません。",
                side: "top", align: "center"
            }
        },
        //11. Save Button
        {
            element: "#btn-save-add",
            popover: {
                title: lang === "vi" ? "11. Lưu sản phẩm" : "11. 保存",
                description: lang === "vi"
                    ? "Nhấn nút này để lưu sản phẩm mới vào hệ thống. Đảm bảo đã điền đầy đủ các trường bắt buộc (*) trước khi lưu."
                    : "このボタンをクリックして新しい製品をシステムに保存します。保存する前に、必須フィールド（*）がすべて入力されていることを確認してください。",
                side: "top", align: "center"
            }
        }
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
             router.replace("/wfourtech", { scroll: false });
             driverObj.current.destroy();
        },
        onNextClick: (element:any, step:any) => {
            if (step.element === "#mobile-menu-trigger") {
                 if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                 waitForElement("#products").then(() => driverObj.current.moveNext());
            } else if (step.element === "#products") {
                 if (isMobile) {
                      const btn = document.getElementById("products");
                      if (btn) btn.click();
                      waitForElement("#menu-subitem-products-add").then(() => {
                          setTimeout(() => driverObj.current.moveNext(), 500);
                      });
                 } else {
                      // Desktop Logic (Robust)
                      const getSubItem = () => document.getElementById("menu-subitem-products-add");
                      const sidebar = document.getElementById("admin-sidebar");
                      const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                      if (getSubItem()) {
                           driverObj.current?.moveNext();
                      } else {
                           const productsMenu = document.getElementById("products");
                           if (productsMenu) {
                               if (isSidebarCollapsed) {
                                   productsMenu.click();
                                   setTimeout(() => {
                                       productsMenu.click();
                                       waitForElement("#menu-subitem-products-add").then(() => {
                                           setTimeout(() => driverObj.current?.moveNext(), 200);
                                       });
                                   }, 250);
                               } else {
                                   productsMenu.click();
                                   waitForElement("#menu-subitem-products-add").then(() => {
                                       setTimeout(() => driverObj.current?.moveNext(), 200);
                                   });
                               }
                           } else {
                               driverObj.current?.moveNext();
                           }
                      }
                 }
            } else if (step.element === "#menu-subitem-products-add") {
                 const link = document.getElementById("menu-subitem-products-add");
                 if (link) link.click();
                 waitForElement("#section-basic-info").then(() => driverObj.current.moveNext());
            } else if (step.element === "#checkbox-has-variants") {
                const checkbox = document.getElementById("checkbox-has-variants") as HTMLInputElement;
                if (checkbox && !checkbox.checked) {
                    checkbox.click();
                }
                waitForElement("#btn-add-variant").then(() => driverObj.current.moveNext());
            } else if (step.element === "#btn-add-variant") {
                 // Only click add if no variant exists yet (to avoid duplicates if user goes back/forth)
                 const existingVariant = document.getElementById("variant-size-0");
                 if (!existingVariant) {
                     const btn = document.getElementById("btn-add-variant");
                     if (btn) btn.click();
                 }
                 waitForElement("#variant-size-0").then(() => driverObj.current.moveNext());
            } else {
                driverObj.current.moveNext();
            }
        }
    });
    driverObj.current.drive();
};
