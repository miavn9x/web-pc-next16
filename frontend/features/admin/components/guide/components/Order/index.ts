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

export const startOrdersTour = ({
    lang,
    isMobile,
    setIsSidebarOpen,
    driverObj,
    router,
    toggleMobileMenu,
    isMobileMenuOpen
}: TourProps) => {
    setIsSidebarOpen(true);
    
    // Inject styles (Matches Product Tour)
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
        // 2. Open Menu & Select Order Group
        {
            element: "#orders",
            popover: {
                title: lang === "vi" ? "2. Menu Đơn hàng" : "2. 注文メニュー",
                description: lang === "vi" 
                    ? "Chọn mục đơn hàng." 
                    : "注文項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select All Orders
        {
            element: "#menu-subitem-orders-all",
            popover: {
                title: lang === "vi" ? "3. Tất cả đơn hàng" : "3. すべての注文",
                description: lang === "vi" 
                    ? "Chọn danh sách tất cả đơn hàng." 
                    : "すべての注文リストを選択します。",
                side: "bottom", align: "start"
            }
        }
    ];

    const desktopSteps = [
        // 1. Navigation
        {
            element: "#orders",
            popover: {
                title: lang === "vi" ? "1. Quản lý đơn hàng" : "1. 注文管理",
                description: lang === "vi" ? "Truy cập tại đây." : "ここからアクセスします。",
                side: "right", align: "start"
            }
        },
        {
            element: "#menu-subitem-orders-all",
            popover: {
                title: lang === "vi" ? "2. Tất cả đơn hàng" : "2. すべての注文",
                description: lang === "vi" ? "Vào trang quản lý đơn hàng." : "注文管理ページに入ります。",
                side: "right", align: "start"
            }
        }
    ];

    const commonSteps = [
         // 4. Page Overview
        {
            element: "#orders-page",
            popover: {
                title: lang === "vi" ? "4. Trang Quản lý đơn hàng" : "4. 注文管理ページ",
                description: lang === "vi" 
                    ? "Đây là trang quản lý tất cả đơn hàng. Bạn có thể xem, tìm kiếm, lọc và cập nhật trạng thái đơn hàng tại đây."
                    : "これはすべての注文を管理するページです。ここで注文の表示、検索、フィルタリング、ステータス更新ができます。",
                side: "bottom", align: "start"
            }
        },
        // 4. Header Section
        {
            element: "#orders-header",
            popover: {
                title: lang === "vi" ? "4. Thanh điều khiển" : "4. コントロールバー",
                description: lang === "vi"
                    ? "Khu vực này chứa tiêu đề trang, bộ đổi ngôn ngữ và nút làm mới dữ liệu."
                    : "このエリアにはページタイトル、言語切り替え、データ更新ボタンがあります。",
                side: "bottom", align: "center"
            }
        },
        // 4.1 Language Toggle
        {
            element: "#btn-language-toggle-orders",
            popover: {
                title: lang === "vi" ? "4.1 Đổi ngôn ngữ" : "4.1 言語切り替え",
                description: lang === "vi"
                    ? "Chọn hiển thị tiếng Việt hoặc tiếng Nhật. Nội dung trang sẽ cập nhật theo ngôn ngữ được chọn."
                    : "ベトナム語または日本語で表示します。ページコンテンツは選択した言語に応じて更新されます。",
                side: "bottom", align: "center"
            }
        },
        // 4.2 Refresh Button
        {
            element: "#btn-refresh-orders",
            popover: {
                title: lang === "vi" ? "4.2 Làm mới" : "4.2 更新",
                description: lang === "vi"
                    ? "Tải lại danh sách đơn hàng mới nhất từ server. Hữu ích khi cần cập nhật dữ liệu thời gian thực."
                    : "サーバーから最新の注文リストを再読み込みします。リアルタイムデータを更新するのに便利です。",
                side: "bottom", align: "end"
            }
        },
        // 6. Filter Section
        {
            element: "#orders-filter-section",
            popover: {
                title: lang === "vi" ? "6. Bộ lọc và tìm kiếm" : "6. フィルタと検索",
                description: lang === "vi"
                    ? "Khu vực này cho phép bạn tìm kiếm đơn hàng theo mã và lọc theo trạng thái."
                    : "このエリアで注文番号で検索したり、ステータス別にフィルタリングしたりできます。",
                side: "bottom", align: "start"
            }
        },
        // 6.1 Search Input
        {
            element: "#input-search-order",
            popover: {
                title: lang === "vi" ? "6.1 Ô tìm kiếm" : "6.1 検索ボックス",
                description: lang === "vi"
                    ? "Nhập mã đơn hàng để tìm kiếm. Ví dụ: OD091225920297. Nhấn Enter hoặc click nút Tìm kiếm."
                    : "注文番号を入力して検索します。例: OD091225920297。Enterを押すか検索ボタンをクリックします。",
                side: "bottom", align: "start"
            }
        },
        // 7.2 Search Button
        {
            element: "#btn-search-order",
            popover: {
                title: lang === "vi" ? "6.2 Nút Tìm kiếm" : "6.2 検索ボタン",
                description: lang === "vi"
                    ? "Click để thực hiện tìm kiếm đơn hàng theo mã đã nhập."
                    : "クリックして入力した番号で注文を検索します。",
                side: "bottom", align: "center"
            }
        },
        // 7.3 Status Filter
        {
            element: "#select-filter-status",
            popover: {
                title: lang === "vi" ? "6.3 Lọc trạng thái" : "6.3 ステータスフィルタ",
                description: lang === "vi"
                    ? "Chọn trạng thái: Tất cả, Chờ xử lý, Đã xác nhận, Hoàn thành, hoặc Đã hủy để lọc đơn hàng."
                    : "ステータスを選択: すべて、処理待ち、確認済み、完了、またはキャンセル済みで注文をフィルタリングします。",
                side: "bottom", align: "start"
            }
        },
    ];

    // Desktop: Table View & Modals
    const desktopTableSteps = [
          // 8. Orders Table
          {
              element: "#orders-table",
              popover: {
                  title: lang === "vi" ? "8. Bảng đơn hàng" : "8. 注文テーブル",
                  description: lang === "vi"
                      ? "Hiển thị danh sách tất cả đơn hàng với thông tin: mã, tổng tiền, trạng thái và các thao tác."
                      : "すべての注文を一覧表示します：番号、合計金額、ステータス、アクション。",
                  side: "top", align: "center"
              }
          },
          // 9. First Order Row
          {
              element: "#order-row-0",
              popover: {
                  title: lang === "vi" ? "9. Dòng đơn hàng đầu tiên" : "9. 最初の注文行",
                  description: lang === "vi"
                      ? "Mỗi dòng hiển thị thông tin cơ bản của đơn hàng. Click vào các nút để xem chi tiết, sửa hoặc xóa."
                      : "各行には注文の基本情報が表示されます。ボタンをクリックして詳細表示、編集、削除ができます。",
                  side: "top", align: "center"
              }
          },
          // 10. View Button
          {
              element: "#btn-view-order-0",
              popover: {
                  title: lang === "vi" ? "10. Xem chi tiết" : "10. 詳細を見る",
                  description: lang === "vi"
                      ? "Click để xem chi tiết đầy đủ của đơn hàng: thông tin khách hàng, sản phẩm đã đặt, và trạng thái."
                      : "クリックして注文の詳細を表示します：顧客情報、注文商品、ステータス。",
                  side: "left", align: "center"
              }
          },
          // 10.1-10.6 Detail Modal steps...
          {
              element: "#modal-order-detail",
              popover: {
                  title: lang === "vi" ? "10.1 Modal chi tiết" : "10.1 詳細モーダル",
                  description: lang === "vi"
                      ? "Popup hiển thị tất cả thông tin chi tiết về đơn hàng."
                      : "注文のすべての詳細情報を表示するポップアップ。",
                  side: "left", align: "center"
              }
          },
          {
              element: "#detail-customer-section",
              popover: {
                  title: lang === "vi" ? "10.2 Thông tin khách hàng" : "10.2 顧客情報",
                  description: lang === "vi"
                      ? "Hiển thị email, số điện thoại và địa chỉ giao hàng của khách. Có nút sao chép tiện lợi."
                      : "顧客の電子メール、電話番号、配送住所を表示します。コピーボタンがあります。",
                  side: "right", align: "center"
              }
          },
          {
              element: "#detail-order-section",
              popover: {
                  title: lang === "vi" ? "10.3 Thông tin đơn hàng" : "10.3 注文情報",
                  description: lang === "vi"
                      ? "Mã đơn, ngày tạo, trạng thái và tổng tiền.  Tổng tiền hiển thị theo cả VNĐ và Yên."
                      : "注文番号、作成日、ステータス、合計金額。合計金額はVNĐと円の両方で表示されます。",
                  side: "right", align: "center"
              }
          },
          {
              element: "#detail-products-section",
              popover: {
                  title: lang === "vi" ? "10.4 Sản phẩm đã đặt" : "10.4 注文商品",
                  description: lang === "vi"
                      ? "Danh sách các sản phẩm trong đơn hàng kèm theo số lượng, giá và giảm giá (nếu có)."
                      : "注文内の商品リスト、数量、価格、割引（ある場合）を含みます。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#btn-update-status-detail",
              popover: {
                  title: lang === "vi" ? "10.5 Cập nhật trạng thái" : "10.5 ステータス更新",
                  description: lang === "vi"
                      ? "Dropdown để thay đổi trạng thái đơn hàng trực tiếp từ modal chi tiết."
                      : "詳細モーダルから直接注文ステータスを変更するドロップダウン。",
                  side: "left", align: "center"
              }
          },
          {
              element: "#detail-close",
              popover: {
                  title: lang === "vi" ? "10.6 Đóng modal" : "10.6 モーダルを閉じる",
                  description: lang === "vi"
                      ? "Click để đóng modal chi tiết và quay lại danh sách đơn hàng."
                      : "クリックして詳細モーダルを閉じて注文リストに戻ります。",
                  side: "left", align: "center"
              }
          },
          // 11. Edit Status Button
          {
              element: "#btn-edit-status-0",
              popover: {
                  title: lang === "vi" ? "11. Nút Cập nhật trạng thái" : "11. ステータス更新ボタン",
                  description: lang === "vi"
                      ? "Click vào đây để mở modal cập nhật trạng thái đơn hàng nhanh chóng."
                      : "ここをクリックして注文ステータスを素早く更新します。",
                  side: "left", align: "center"
              }
          },
          // 11.1-11.6 Status Modal steps...
          {
              element: "#modal-status-update",
              popover: {
                  title: lang === "vi" ? "11.1 Modal cập nhật trạng thái" : "11.1 ステータス更新モーダル",
                  description: lang === "vi"
                      ? "Popup chuyên dụng để cập nhật trạng thái đơn hàng một cách nhanh chóng."
                      : "注文ステータスを素早く更新するための専用ポップアップ。",
                  side: "left", align: "center"
              }
          },
          {
              element: "#status-update-order-code",
              popover: {
                  title: lang === "vi" ? "11.2 Mã đơn hàng" : "11.2 注文番号",
                  description: lang === "vi"
                      ? "Hiển thị mã đơn hàng đang được cập nhật."
                      : "更新中の注文番号を表示します。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#status-update-current",
              popover: {
                  title: lang === "vi" ? "11.3 Trạng thái hiện tại" : "11.3 現在のステータス",
                  description: lang === "vi"
                      ? "Trạng thái hiện tại của đơn hàng trước khi cập nhật."
                      : "更新前の現在の注文ステータス。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#status-update-new",
              popover: {
                  title: lang === "vi" ? "11.4 Trạng thái mới" : "11.4 新しいステータス",
                  description: lang === "vi"
                      ? "Chọn trạng thái mới cho đơn hàng: Chờ xử lý, Đã xác nhận, Hoàn thành, hoặc Đã hủy."
                      : "新しい注文ステータスを選択: 処理待ち、確認済み、完了、またはキャンセル済み。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#btn-save-status",
              popover: {
                  title: lang === "vi" ? "11.5 Nút Cập nhật" : "11.5 更新ボタン",
                  description: lang === "vi"
                      ? "Click để lưu trạng thái mới. Thay đổi sẽ được áp dụng ngay lập tức."
                      : "クリックして新しいステータスを保存します。変更はすぐに適用されます。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#btn-cancel-status",
              popover: {
                  title: lang === "vi" ? "11.6 Đóng modal" : "11.6 モーダルを閉じる",
                  description: lang === "vi"
                      ? "Click để đóng modal cập nhật trạng thái và quay lại danh sách."
                      : "クリックしてステータス更新モーダルを閉じてリストに戻ります。",
                  side: "top", align: "center"
              }
          },
          // 12. Delete Button
          {
              element: "#btn-delete-order-0",
              popover: {
                  title: lang === "vi" ? "12. Xóa đơn hàng" : "12. 注文削除",
                  description: lang === "vi"
                      ? "⚠️ CẢNH BÁO: KHÔNG NÊN xóa đơn hàng! Chỉ xóa khi thực sự cần thiết. Hành động này KHÔNG THỂ HOÀN TÁC và sẽ xóa vĩnh viễn toàn bộ dữ liệu đơn hàng!"
                      : "⚠️ 警告: 注文を削除しないでください！本当に必要な場合のみ削除してください。このアクションは元に戻せず、すべての注文データが永久に削除されます！",
                  side: "left", align: "center"
              }
          }
    ];

    // Mobile: Simplified steps (card view, no modals)
    const mobileCardSteps = [
          // 9. Order List Card View
          {
              element: "#mobile-order-card-0",
              popover: {
                  title: lang === "vi" ? "9. Thẻ đơn hàng" : "9. 注文カード",
                  description: lang === "vi"
                      ? "Mỗi đơn hàng được hiển thị trong một thẻ bao gồm: Mã đơn, Tổng tiền, Trạng thái và 3 nút thao tác: Xem chi tiết (👁️), Cập nhật trạng thái (✏️) và Xóa (🗑️)."
                      : "各注文はカード形式で表示されます：注文番号、合計金額、ステータス、および3つのアクションボタン：詳細表示(👁️)、ステータス更新(✏️)、削除(🗑️)。",
                  side: "top", align: "center"
              }
          },
          // 10. View Button (Mobile)
          {
              element: "#btn-mobile-view-0",
              popover: {
                  title: lang === "vi" ? "10. Xem chi tiết" : "10. 詳細を見る",
                  description: lang === "vi"
                      ? "Click để xem chi tiết đầy đủ của đơn hàng: thông tin khách hàng, sản phẩm đã đặt, và trạng thái."
                      : "クリックして注文の詳細を表示します：顧客情報、注文商品、ステータス。",
                  side: "top", align: "center"
              }
          },
          // 10.1-10.6 Detail Modal steps (Same as PC)
          {
              element: "#modal-order-detail",
              popover: {
                  title: lang === "vi" ? "10.1 Modal chi tiết" : "10.1 詳細モーダル",
                  description: lang === "vi"
                      ? "Popup hiển thị tất cả thông tin chi tiết về đơn hàng."
                      : "注文のすべての詳細情報を表示するポップアップ。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#detail-customer-section",
              popover: {
                  title: lang === "vi" ? "10.2 Thông tin khách hàng" : "10.2 顧客情報",
                  description: lang === "vi"
                      ? "Hiển thị email, số điện thoại và địa chỉ giao hàng của khách. Có nút sao chép tiện lợi."
                      : "顧客の電子メール、電話番号、配送住所を表示します。コピーボタンがあります。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#detail-order-section",
              popover: {
                  title: lang === "vi" ? "10.3 Thông tin đơn hàng" : "10.3 注文情報",
                  description: lang === "vi"
                      ? "Mã đơn, ngày tạo, trạng thái và tổng tiền.  Tổng tiền hiển thị theo cả VNĐ và Yên."
                      : "注文番号、作成日、ステータス、合計金額。合計金額はVNĐと円の両方で表示されます。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#detail-products-section",
              popover: {
                  title: lang === "vi" ? "10.4 Sản phẩm đã đặt" : "10.4 注文商品",
                  description: lang === "vi"
                      ? "Danh sách các sản phẩm trong đơn hàng kèm theo số lượng, giá và giảm giá (nếu có)."
                      : "注文内の商品リスト、数量、価格、割引（ある場合）を含みます。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#btn-update-status-detail",
              popover: {
                  title: lang === "vi" ? "10.5 Cập nhật trạng thái" : "10.5 ステータス更新",
                  description: lang === "vi"
                      ? "Dropdown để thay đổi trạng thái đơn hàng trực tiếp từ modal chi tiết."
                      : "詳細モーダルから直接注文ステータスを変更するドロップダウン。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#detail-close",
              popover: {
                  title: lang === "vi" ? "10.6 Đóng modal" : "10.6 モーダルを閉じる",
                  description: lang === "vi"
                      ? "Click để đóng modal chi tiết và quay lại danh sách đơn hàng."
                      : "クリックして詳細モーダルを閉じて注文リストに戻ります。",
                  side: "top", align: "center"
              }
          },
          // 11. Edit Status Button (Mobile)
          {
              element: "#btn-mobile-edit-0",
              popover: {
                  title: lang === "vi" ? "11. Nút Cập nhật trạng thái" : "11. ステータス更新ボタン",
                  description: lang === "vi"
                      ? "Click vào đây để mở modal cập nhật trạng thái đơn hàng nhanh chóng."
                      : "ここをクリックして注文ステータスを素早く更新します。",
                  side: "top", align: "center"
              }
          },
          // 11.1-11.6 Status Modal steps (Same as PC)
          {
              element: "#modal-status-update",
              popover: {
                  title: lang === "vi" ? "11.1 Modal cập nhật trạng thái" : "11.1 ステータス更新モーダル",
                  description: lang === "vi"
                      ? "Popup chuyên dụng để cập nhật trạng thái đơn hàng một cách nhanh chóng."
                      : "注文ステータスを素早く更新するための専用ポップアップ。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#status-update-order-code",
              popover: {
                  title: lang === "vi" ? "11.2 Mã đơn hàng" : "11.2 注文番号",
                  description: lang === "vi"
                      ? "Hiển thị mã đơn hàng đang được cập định."
                      : "更新中の注文番号を表示します。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#status-update-current",
              popover: {
                  title: lang === "vi" ? "11.3 Trạng thái hiện tại" : "11.3 現在のステータス",
                  description: lang === "vi"
                      ? "Trạng thái hiện tại của đơn hàng trước khi cập nhật."
                      : "更新前の現在の注文ステータス。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#status-update-new",
              popover: {
                  title: lang === "vi" ? "11.4 Trạng thái mới" : "11.4 新しいステータス",
                  description: lang === "vi"
                      ? "Chọn trạng thái mới cho đơn hàng: Chờ xử lý, Đã xác nhận, Hoàn thành, hoặc Đã hủy."
                      : "新しい注文ステータスを選択: 処理待ち、確認済み、完了、またはキャンセル済み。",
                  side: "bottom", align: "center"
              }
          },
          {
              element: "#btn-save-status",
              popover: {
                  title: lang === "vi" ? "11.5 Nút Cập nhật" : "11.5 更新ボタン",
                  description: lang === "vi"
                      ? "Click để lưu trạng thái mới. Thay đổi sẽ được áp dụng ngay lập tức."
                      : "クリックして新しいステータスを保存します。変更はすぐに適用されます。",
                  side: "top", align: "center"
              }
          },
          {
              element: "#btn-cancel-status",
              popover: {
                  title: lang === "vi" ? "11.6 Đóng modal" : "11.6 モーダルを閉じる",
                  description: lang === "vi"
                      ? "Click để đóng modal cập nhật trạng thái và quay lại danh sách."
                      : "クリックしてステータス更新モーダルを閉じてリストに戻ります。",
                  side: "top", align: "center"
              }
          },
          // 12. Delete Button (Mobile)
          {
              element: "#btn-mobile-delete-0",
              popover: {
                  title: lang === "vi" ? "12. Xóa đơn hàng" : "12. 注文削除",
                  description: lang === "vi"
                      ? "⚠️ CẢNH BÁO: KHÔNG NÊN xóa đơn hàng! Chỉ xóa khi thực sự cần thiết. Hành động này KHÔNG THỂ HOÀN TÁC và sẽ xóa vĩnh viễn toàn bộ dữ liệu đơn hàng!"
                      : "⚠️ 警告: 注文を削除しないでください！本当に必要な場合のみ削除してください。このアクションは元に戻せず、すべての注文データが永久に削除されます！",
                  side: "top", align: "center"
              }
          }
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),
        ...commonSteps,
        ...(isMobile ? mobileCardSteps : desktopTableSteps)
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
             router.replace("/wfourtech", { scroll: false });
             driverObj.current.destroy();
        },
        onHighlightStarted: (element:any, step:any, options:any) => {
             if (step.element === "#menu-subitem-orders-all") {
                 const group = document.getElementById("orders");
                 const sub = document.getElementById("menu-subitem-orders-all");
                 if (group && (!sub || sub.offsetParent === null)) group.click();
             }
        },
        onNextClick: (element:any, step:any) => {
            if (step.element === "#mobile-menu-trigger") {
                 if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                 waitForElement("#orders").then(() => driverObj.current.moveNext());
            } else if (step.element === "#orders") {
                 if (isMobile) {
                      const btn = document.getElementById("orders");
                      if (btn) btn.click();
                      waitForElement("#menu-subitem-orders-all").then(() => {
                          setTimeout(() => driverObj.current.moveNext(), 500);
                      });
                 } else {
                      // Desktop Logic (Robust)
                      const getSubItem = () => document.getElementById("menu-subitem-orders-all");
                      const sidebar = document.getElementById("admin-sidebar");
                      const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                      if (getSubItem()) {
                           driverObj.current?.moveNext();
                      } else {
                           const ordersMenu = document.getElementById("orders");
                           if (ordersMenu) {
                               if (isSidebarCollapsed) {
                                   ordersMenu.click();
                                   setTimeout(() => {
                                       ordersMenu.click();
                                       waitForElement("#menu-subitem-orders-all").then(() => {
                                           setTimeout(() => driverObj.current?.moveNext(), 200);
                                       });
                                   }, 250);
                               } else {
                                   ordersMenu.click();
                                   waitForElement("#menu-subitem-orders-all").then(() => {
                                       setTimeout(() => driverObj.current?.moveNext(), 200);
                                   });
                               }
                           } else {
                               driverObj.current?.moveNext();
                           }
                      }
                 }
            } else if (step.element === "#menu-subitem-orders-all") {
                 const link = document.getElementById("menu-subitem-orders-all");
                 if (link) link.click();
                 waitForElement("#orders-page").then(() => driverObj.current.moveNext());
            } else if (step.element === "#btn-view-order-0" || step.element === "#btn-mobile-view-0") {
                  const id = isMobile ? "btn-mobile-view-0" : "btn-view-order-0";
                  const viewBtn = document.getElementById(id);
                  if (viewBtn) viewBtn.click();
                  waitForElement("#modal-order-detail").then(() => driverObj.current.moveNext());
            } else if (step.element === "#detail-close") {
                  const closeBtn = document.getElementById("detail-close");
                  if (closeBtn) closeBtn.click();
                  const nextSelector = isMobile ? "#btn-mobile-edit-0" : "#btn-edit-status-0";
                  waitForElement(nextSelector).then(() => driverObj.current.moveNext());
            } else if (step.element === "#btn-edit-status-0" || step.element === "#btn-mobile-edit-0") {
                  const id = isMobile ? "btn-mobile-edit-0" : "btn-edit-status-0";
                  const editBtn = document.getElementById(id);
                  if (editBtn) editBtn.click();
                  waitForElement("#modal-status-update").then(() => driverObj.current.moveNext());
            } else if (step.element === "#btn-cancel-status") {
                  const closeStatusBtn = document.getElementById("btn-cancel-status");
                  if (closeStatusBtn) closeStatusBtn.click();
                  const nextSelector = isMobile ? "#btn-mobile-delete-0" : "#btn-delete-order-0";
                  waitForElement(nextSelector).then(() => driverObj.current.moveNext());
            } else {
                  driverObj.current.moveNext();
            }
        }
    });
    driverObj.current.drive();
};

