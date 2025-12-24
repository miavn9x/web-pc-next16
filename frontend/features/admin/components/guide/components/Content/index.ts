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

// New Tour: Delete Button on List Page
export const startDeleteTour = ({
    lang,
    driverObj,
    router
}: Omit<TourProps, "isMobile" | "setIsSidebarOpen">) => {
    
    localStorage.removeItem("tour_pending_back_to_list");

    const steps: any[] = [
        // 10. Delete Button (List Page - Final Step)
        {
            element: "#btn-delete-post-0",
            popover: {
                title: lang === "vi" ? "10. Xóa bài viết" : "10. 投稿を削除",
                description: lang === "vi"
                    ? "Xóa bài viết từ danh sách. LƯU Ý: Hành động này không thể hoàn tác!"
                    : "リストから投稿を削除します。注意：この操作は元に戻せません！",
                side: "left", align: "center"
            }
        }
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
           // Remove the tour query param to prevent loop
           const url = new URL(window.location.href);
           if (url.searchParams.has("tour")) {
               url.searchParams.delete("tour");
               router.replace(`${url.pathname}${url.search}`);
           }
           driverObj.current.destroy();
        }
    });

    waitForElement("#btn-delete-post-0", 10000).then(() => {
        driverObj.current.drive();
    });
};

export const startEditPostTour = ({
    lang,
    driverObj,
    router
}: Omit<TourProps, "isMobile" | "setIsSidebarOpen">) => {
    
    // Clear the pending flag
    localStorage.removeItem("tour_pending_edit_post");

    const steps: any[] = [
        // 10. Cover Image Section
        {
            element: "#section-cover-image",
            popover: {
                title: lang === "vi" ? "9.1 Ảnh bìa" : "9.1 カバー画像",
                description: lang === "vi"
                    ? "Quản lý ảnh bìa của bài viết (Tải lên/Xóa)."
                    : "投稿のカバー画像を管理します（アップロード/削除）。",
                side: "right", align: "start"
            }
        },
        // 11. VI Content Section
        {
            element: "#section-vi-content",
            popover: {
                title: lang === "vi" ? "9.2 Nội dung Tiếng Việt" : "9.2 ベトナム語コンテンツ",
                description: lang === "vi"
                    ? "Khu vực nhập liệu nội dung Tiếng Việt."
                    : "ベトナム語コンテンツ入力エリア。",
                side: "top", align: "start"
            }
        },
        // 12. VI Title Input
        {
            element: "#input-title-vi",
            popover: {
                title: lang === "vi" ? "9.3 Tiêu đề (VI)" : "9.3 タイトル (VI)",
                description: lang === "vi"
                    ? "Nhập tiêu đề bài viết bằng Tiếng Việt."
                    : "ベトナム語でタイトルを入力します。",
                side: "top", align: "start"
            }
        },
        // 12.1 VI Description Input
        {
            element: "#input-desc-vi",
            popover: {
                title: lang === "vi" ? "9.4 Mô tả (VI)" : "9.4 説明 (VI)",
                description: lang === "vi"
                    ? "Nhập mô tả ngắn cho bài viết bằng Tiếng Việt."
                    : "ベトナム語で短い説明を入力します。",
                side: "top", align: "start"
            }
        },
        // 9.5 VI Content Editor
        {
            element: "#input-content-vi-wrapper",
            popover: {
                title: lang === "vi" ? "9.5 Nội dung chi tiết (VI)" : "9.5 詳細コンテンツ (VI)",
                description: lang === "vi"
                    ? "Soạn thảo nội dung chi tiết bài viết bằng Tiếng Việt."
                    : "ベトナム語で詳細なコンテンツを作成します。",
                side: "top", align: "start"
            }
        },
        // 9.6 JA Content Section
        {
            element: "#section-ja-content",
            popover: {
                title: lang === "vi" ? "9.6 Nội dung Tiếng Nhật" : "9.6 日本語コンテンツ",
                description: lang === "vi"
                    ? "Khu vực nhập liệu nội dung Tiếng Nhật."
                    : "日本語コンテンツ入力エリア。",
                side: "top", align: "start"
            }
        },
        // 9.7 JA Title Input
        {
            element: "#input-title-ja",
            popover: {
                title: lang === "vi" ? "9.7 Tiêu đề (JA)" : "9.7 タイトル (JA)",
                description: lang === "vi"
                    ? "Nhập tiêu đề bài viết bằng Tiếng Nhật."
                    : "日本語でタイトルを入力します。",
                side: "top", align: "start"
            }
        },
        // 9.8 JA Description Input
        {
            element: "#input-desc-ja",
            popover: {
                title: lang === "vi" ? "9.8 Mô tả (JA)" : "9.8 説明 (JA)",
                description: lang === "vi"
                    ? "Nhập mô tả ngắn cho bài viết bằng Tiếng Nhật."
                    : "日本語で短い説明を入力します。",
                side: "top", align: "start"
            }
        },
        // 9.9 JA Content Editor
        {
            element: "#input-content-ja-wrapper",
            popover: {
                title: lang === "vi" ? "9.9 Nội dung chi tiết (JA)" : "9.9 詳細コンテンツ (JA)",
                description: lang === "vi"
                    ? "Soạn thảo nội dung chi tiết bài viết bằng Tiếng Nhật."
                    : "日本語で詳細なコンテンツを作成します。",
                side: "top", align: "start"
            }
        },
        // 9.10 Delete Button (Edit Page)
        {
            element: "#btn-delete-post-header",
            popover: {
                title: lang === "vi" ? "9.10 Xóa bài viết" : "9.10 投稿を削除",
                description: lang === "vi"
                    ? "Xóa bài viết hiện tại (Cần xác nhận)."
                    : "現在の投稿を削除します（確認が必要です）。",
                side: "bottom", align: "center"
            }
        },
        // 9.11 Preview Button
        {
            element: "#btn-preview-post",
            popover: {
                title: lang === "vi" ? "9.11 Xem trước" : "9.11 プレビュー",
                description: lang === "vi"
                    ? "Xem trước bài viết trước khi lưu."
                    : "保存する前に投稿をプレビューします。",
                side: "bottom", align: "center"
            }
        },
        // 9.12 Save Button
        {
            element: "#btn-save-post",
            popover: {
                title: lang === "vi" ? "9.12 Lưu thay đổi" : "9.12 変更を保存",
                description: lang === "vi"
                    ? "Lưu lại các thay đổi của bài viết."
                    : "投稿の変更を保存します。",
                side: "bottom", align: "center"
            }
        },
        // 9.13 Back Button - Return to List
        {
            element: "#btn-back-to-list",
            popover: {
                title: lang === "vi" ? "9.13 Quay lại" : "9.13 戻る",
                description: lang === "vi"
                    ? "Quay trở lại danh sách bài viết."
                    : "投稿リストに戻ります。",
                side: "bottom", align: "start",
                onNextClick: () => {
                   // Set flag for list tour resumption (final delete step)
                   localStorage.setItem("tour_pending_back_to_list", "true");

                   const backBtn = document.querySelector("#btn-back-to-list") as HTMLElement;
                   if (backBtn) backBtn.click();
                   
                   driverObj.current.destroy();
                }
            }
        }
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
           driverObj.current.destroy();
        }
    });

    driverObj.current.drive();
};


export const startPostsListTour = ({
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
        // 2. Open Menu
        {
            element: "#content",
            popover: {
                title: lang === "vi" ? "2. Menu Nội dung" : "2. コンテンツメニュー",
                description: lang === "vi" ? "Chọn mục quản lý nội dung." : "コンテンツ管理項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select Posts List
        {
            element: "#menu-subitem-content-posts",
            popover: {
                title: lang === "vi" ? "3. Danh sách bài viết" : "3. 投稿リスト",
                description: lang === "vi" ? "Chọn danh sách bài viết." : "投稿リストを選択します。",
                side: "bottom", align: "start"
            }
        }
    ];

    const desktopSteps = [
        // 1. Navigation
        {
            element: "#content",
            popover: {
                title: lang === "vi" ? "1. Quản lý nội dung" : "1. コンテンツ管理",
                description: lang === "vi" ? "Truy cập tại đây." : "ここからアクセスします。",
                side: "right", align: "start"
            }
        },
        {
            element: "#menu-subitem-content-posts",
            popover: {
                title: lang === "vi" ? "2. Danh sách bài viết" : "2. 投稿リスト",
                description: lang === "vi" ? "Vào trang danh sách." : "リストページに入ります。",
                side: "right", align: "start"
            }
        }
    ];

    const commonSteps = [
        // 3. Header Container
        {
            element: "#posts-list-header",
            popover: {
                title: lang === "vi" ? "3. Quản lý bài viết" : "3. 投稿管理",
                description: lang === "vi"
                    ? "Giao diện chính để quản lý tất cả bài viết."
                    : "すべての投稿を管理するためのメインインターフェース。",
                side: "bottom", align: "start"
            }
        },
        // 4. Title Section
        {
            element: "#posts-page-title-section",
            popover: {
                title: lang === "vi" ? "4. Tiêu đề trang" : "4. ページタイトル",
                description: lang === "vi"
                    ? "Hiển thị tên trang và tổng số bài viết hiện có."
                    : "ページ名と現在の総投稿数を表示します。",
                side: "bottom", align: "start"
            }
        },
        // 5. Toolbar Section
        {
            element: "#posts-toolbar-section",
            popover: {
                title: lang === "vi" ? "5. Công cụ quản lý" : "5. 管理ツール",
                description: lang === "vi"
                    ? "Các công cụ tiện ích: Đổi ngôn ngữ, làm mới dữ liệu."
                    : "ユーティリティツール：言語切り替え、データの更新。",
                side: "bottom", align: "start"
            }
        },
        // 6. Language Switcher
        {
            element: "#posts-lang-switcher",
            popover: {
                title: lang === "vi" ? "6. Ngôn ngữ hiển thị" : "6. 表示言語",
                description: lang === "vi"
                    ? "Chuyển đổi ngôn ngữ hiển thị (Tiếng Việt / Tiếng Nhật)."
                    : "表示言語を切り替えます（ベトナム語/日本語）。",
                side: "bottom", align: "start"
            }
        },
        // 7. Refresh Button
        {
            element: "#btn-refresh-posts",
            popover: {
                title: lang === "vi" ? "7. Làm mới" : "7. 更新",
                description: lang === "vi"
                    ? "Tải lại danh sách để cập nhật dữ liệu mới nhất."
                    : "リストを再読み込みして最新データを更新します。",
                side: "bottom", align: "center"
            }
        },
        // 8. Search Section
        {
            element: "#posts-search-section",
            popover: {
                title: lang === "vi" ? "8. Khu vực tìm kiếm" : "8. 検索エリア",
                description: lang === "vi"
                    ? "Công cụ tìm kiếm bài viết nhanh chóng."
                    : "投稿をすばやく検索します。",
                side: "top", align: "start"
            }
        },
        // 9. Search Input
        {
            element: "#input-search-posts",
            popover: {
                title: lang === "vi" ? "9. Nhập từ khóa" : "9. キーワード入力",
                description: lang === "vi"
                    ? "Nhập tiêu đề hoặc mô tả cần tìm tại đây."
                    : "ここにタイトルまたは説明を入力して検索します。",
                side: "bottom", align: "start"
            }
        },
        // 10. Post Item Container
        {
            element: "#post-item-0",
            popover: {
                title: lang === "vi" ? "10. Thẻ bài viết" : "10. 投稿カード",
                description: lang === "vi"
                    ? "Mỗi thẻ đại diện cho một bài viết."
                    : "各カードは1つの投稿を表します。",
                side: "top", align: "center"
            }
        },
        // 11. Image
        {
            element: "#post-img-0",
            popover: {
                title: lang === "vi" ? "11. Ảnh bìa" : "11. カバー画像",
                description: lang === "vi"
                    ? "Hình ảnh đại diện của bài viết."
                    : "投稿の代表画像。",
                side: "right", align: "center"
            }
        },
        // 12. Content Area
        {
            element: "#post-content-0",
            popover: {
                title: lang === "vi" ? "12. Nội dung chính" : "12. メインコンテンツ",
                description: lang === "vi"
                    ? "Bao gồm tiêu đề, mô tả và ngày đăng."
                    : "タイトル、説明、投稿日が含まれます。",
                side: "top", align: "start"
            }
        },
        // 13. Title
        {
            element: "#post-title-0",
            popover: {
                title: lang === "vi" ? "13. Tiêu đề bài viết" : "13. 投稿タイトル",
                description: lang === "vi"
                    ? "Tên bài viết (theo ngôn ngữ đã chọn)."
                    : "記事名（選択された言語に基づく）。",
                side: "bottom", align: "start"
            }
        },
        // 14. Description
        {
            element: "#post-desc-0",
            popover: {
                title: lang === "vi" ? "14. Mô tả ngắn" : "14. 短い説明",
                description: lang === "vi"
                    ? "Tóm tắt nội dung bài viết."
                    : "投稿内容の要約。",
                side: "bottom", align: "start"
            }
        },
        // 15. Date
        {
            element: "#post-date-0",
            popover: {
                title: lang === "vi" ? "15. Ngày đăng" : "15. 投稿日",
                description: lang === "vi"
                    ? "Ngày bài viết được tạo/cập nhật."
                    : "投稿の作成/更新日。",
                side: "bottom", align: "start"
            }
        },
        // 16. Actions Container
        {
            element: "#post-actions-0",
            popover: {
                title: lang === "vi" ? "16. Thao tác" : "16. アクション",
                description: lang === "vi"
                    ? "Các hành động có thể thực hiện với bài viết."
                    : "投稿に対して実行可能なアクション。",
                side: "bottom", align: "center"
            }
        },
        // 17. Edit Button
        {
            element: "#btn-edit-post-0",
            popover: {
                title: lang === "vi" ? "17. Chỉnh sửa" : "17. 編集",
                description: lang === "vi"
                    ? "Đi tới trang chỉnh sửa bài viết này."
                    : "この記事の編集ページに移動します。",
                side: "top", align: "center",
                onNextClick: () => {
                    // Start Edit Tour flow
                    localStorage.setItem("tour_pending_edit_post", "true");
                    const editBtn = document.querySelector("#btn-edit-post-0") as HTMLElement;
                    if (editBtn) editBtn.click();
                    driverObj.current.destroy();
                }
            }
        }
        // NOTE: We stop at Edit. Delete is handled in startDeleteTour or separately if requested.
        // User didn't explicitly ask for Delete Tour to be merged, but asked for "Detailed Posts List".
        // Usually clicking Edit navigates away, so we end here.
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),
        ...commonSteps
    ];

    driverObj.current = driver({
        showProgress: true,
        steps: steps,
        onDestroyStarted: () => {
             // Only clear route if not transitioning to Edit
             if (!localStorage.getItem("tour_pending_edit_post")) {
                 const url = new URL(window.location.href);
                 // Clear tour param to prevent loop functionality
                 if (url.searchParams.has("tour")) {
                     url.searchParams.delete("tour");
                     router.replace(`${url.pathname}${url.search}`);
                 }
                 // If users navigated to post list directly via tour param, maybe redirect to base?
                 // But replacing with filtered URL is safer.
             }
             driverObj.current.destroy();
        },
        onHighlightStarted: (element:any, step:any, options:any) => {
             if (step.element === "#menu-subitem-content-posts") {
                 const group = document.getElementById("content");
                 const sub = document.getElementById("menu-subitem-content-posts");
                 if (group && (!sub || sub.offsetParent === null)) group.click();
             }
        },
        onNextClick: (element:any, step:any) => {
             if (step.element === "#mobile-menu-trigger") {
                  if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                  waitForElement("#content").then(() => driverObj.current.moveNext());
             } 
             else if (step.element === "#content") {
                 if (isMobile) {
                      const contentsMenu = document.getElementById("content");
                      if (contentsMenu) contentsMenu.click();
                      waitForElement("#menu-subitem-content-posts").then(() => {
                          setTimeout(() => driverObj.current?.moveNext(), 500);
                      });
                 } else {
                     // Desktop Logic (Robust)
                     const getSubItem = () => document.getElementById("menu-subitem-content-posts");
                     const sidebar = document.getElementById("admin-sidebar");
                     const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                     if (getSubItem()) {
                          driverObj.current?.moveNext();
                     } else {
                          const contentsMenu = document.getElementById("content");
                          if (contentsMenu) {
                              if (isSidebarCollapsed) {
                                  contentsMenu.click();
                                  setTimeout(() => {
                                      contentsMenu.click();
                                      waitForElement("#menu-subitem-content-posts").then(() => {
                                          setTimeout(() => driverObj.current?.moveNext(), 200);
                                      });
                                  }, 250);
                              } else {
                                  contentsMenu.click();
                                  waitForElement("#menu-subitem-content-posts").then(() => {
                                      setTimeout(() => driverObj.current?.moveNext(), 200);
                                  });
                              }
                          } else {
                               driverObj.current?.moveNext();
                          }
                     }
                 }
             }
             else if (step.element === "#menu-subitem-content-posts") {
                  const postsListBtn = document.getElementById("menu-subitem-content-posts");
                  if (postsListBtn) postsListBtn.click();
                  waitForElement("#posts-list-header").then(() => driverObj.current?.moveNext());
             }
             else {
                 driverObj.current?.moveNext();
             }
        }
    });

    driverObj.current.drive();
};

  export const startCreatePostTour = ({
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
        // 2. Open Menu
        {
            element: "#content",
            popover: {
                title: lang === "vi" ? "2. Menu Nội dung" : "2. コンテンツメニュー",
                description: lang === "vi" ? "Chọn mục quản lý nội dung." : "コンテンツ管理項目を選択します。",
                side: "bottom", align: "start"
            }
        },
        // 3. Select Create Post
        {
            element: "#menu-subitem-content-create-post",
            popover: {
                title: lang === "vi" ? "3. Đăng bài viết" : "3. 投稿作成",
                description: lang === "vi" ? "Chọn chức năng đăng bài mới." : "新しい投稿機能を選択します。",
                side: "bottom", align: "start"
            }
        }
    ];

    const desktopSteps = [
        // 1. Navigation
        {
            element: "#content",
            popover: {
                title: lang === "vi" ? "1. Quản lý nội dung" : "1. コンテンツ管理",
                description: lang === "vi" ? "Truy cập tại đây." : "ここからアクセスします。",
                side: "right", align: "start"
            }
        },
        {
            element: "#menu-subitem-content-create-post",
            popover: {
                title: lang === "vi" ? "2. Đăng bài viết" : "2. 投稿作成",
                description: lang === "vi" ? "Vào trang tạo bài viết mới." : "新しい投稿ページに入ります。",
                side: "right", align: "start"
            }
        }
    ];

    const commonSteps = [
        // Header
        {
            element: "#create-post-header",
            popover: {
                title: lang === "vi" ? "3. Tạo bài viết mới" : "3. 新しい投稿を作成",
                description: lang === "vi"
                    ? "Giao diện soạn thảo bài viết mới."
                    : "新しい記事編集インターフェース。",
                side: "bottom", align: "start"
            }
        },
        // Cover Image
        {
            element: "#section-cover-image",
            popover: {
                title: lang === "vi" ? "4. Ảnh bìa" : "4. カバー画像",
                description: lang === "vi"
                    ? "Tải lên ảnh bìa cho bài viết (hỗ trợ kéo thả)."
                    : "投稿のカバー画像をアップロードします（ドラッグ＆ドロップ対応）。",
                side: "right", align: "start"
            }
        },
        // VI Content Section
        {
            element: "#section-vi-content",
            popover: {
                title: lang === "vi" ? "5. Nội dung Tiếng Việt" : "5. ベトナム語コンテンツ",
                description: lang === "vi"
                    ? "Khu vực nhập liệu nội dung Tiếng Việt."
                    : "ベトナム語コンテンツ入力エリア。",
                side: "top", align: "start"
            }
        },
        {
             element: "#input-title-vi",
             popover: {
                 title: lang === "vi" ? "5.1 Tiêu đề (VI)" : "5.1 タイトル (VI)",
                 description: lang === "vi" ? "Nhập tiêu đề bài viết (Tiếng Việt)." : "記事のタイトルを入力します (ベトナム語)。",
                 side: "top", align: "start"
             }
        },
        {
             element: "#input-desc-vi",
             popover: {
                 title: lang === "vi" ? "5.2 Mô tả (VI)" : "5.2 説明 (VI)",
                 description: lang === "vi" ? "Nhập mô tả ngắn (Tiếng Việt)." : "短い説明を入力します (ベトナム語)。",
                 side: "top", align: "start"
             }
        },
        {
             element: "#input-content-vi-wrapper",
             popover: {
                 title: lang === "vi" ? "5.3 Chi tiết (VI)" : "5.3 詳細 (VI)",
                 description: lang === "vi" ? "Soạn thảo nội dung chi tiết (Tiếng Việt)." : "詳細なコンテンツを作成します (ベトナム語)。",
                 side: "top", align: "start"
             }
        },
        // JA Content Section
        {
            element: "#section-ja-content",
            popover: {
                title: lang === "vi" ? "6. Nội dung Tiếng Nhật" : "6. 日本語コンテンツ",
                description: lang === "vi"
                    ? "Khu vực nhập liệu nội dung Tiếng Nhật."
                    : "日本語コンテンツ入力エリア。",
                side: "top", align: "start"
            }
        },
        {
             element: "#input-title-ja",
             popover: {
                 title: lang === "vi" ? "6.1 Tiêu đề (JA)" : "6.1 タイトル (JA)",
                 description: lang === "vi" ? "Nhập tiêu đề bài viết (Tiếng Nhật)." : "記事のタイトルを入力します (日本語)。",
                 side: "top", align: "start"
             }
        },
        {
             element: "#input-desc-ja",
             popover: {
                 title: lang === "vi" ? "6.2 Mô tả (JA)" : "6.2 説明 (JA)",
                 description: lang === "vi" ? "Nhập mô tả ngắn (Tiếng Nhật)." : "短い説明を入力します (日本語)。",
                 side: "top", align: "start"
             }
        },
        {
             element: "#input-content-ja-wrapper",
             popover: {
                 title: lang === "vi" ? "6.3 Chi tiết (JA)" : "6.3 詳細 (JA)",
                 description: lang === "vi" ? "Soạn thảo nội dung chi tiết (Tiếng Nhật)." : "詳細なコンテンツを作成します (日本語)。",
                 side: "top", align: "start"
             }
        },
        // Actions
        {
            element: "#btn-preview-create-post",
            popover: {
                title: lang === "vi" ? "7. Xem trước" : "7. プレビュー",
                description: lang === "vi"
                    ? "Xem trước bài viết trước khi xuất bản."
                    : "公開する前に記事をプレビューします。",
                side: "bottom", align: "center"
            }
        },
        {
            element: "#btn-save-create-post",
            popover: {
                title: lang === "vi" ? "8. Xuất bản" : "8. 公開",
                description: lang === "vi"
                    ? "Lưu và xuất bản bài viết mới."
                    : "新しい記事を保存して公開します。",
                side: "bottom", align: "center"
            }
        }
    ];

    const steps: any[] = [
        ...(isMobile ? mobileSteps : desktopSteps),
        ...commonSteps
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
        },
        onHighlightStarted: (element:any, step:any, options:any) => {
             if (step.element === "#menu-subitem-content-create-post") {
                 const group = document.getElementById("content");
                 const sub = document.getElementById("menu-subitem-content-create-post");
                 if (group && (!sub || sub.offsetParent === null)) group.click();
             }
        },
        onNextClick: (element:any, step:any) => {
             if (step.element === "#mobile-menu-trigger") {
                  if (!isMobileMenuOpen && toggleMobileMenu) toggleMobileMenu();
                  waitForElement("#content").then(() => driverObj.current.moveNext());
             }
             else if (step.element === "#content") {
                 if (isMobile) {
                      const contentsMenu = document.getElementById("content");
                      if (contentsMenu) contentsMenu.click();
                      waitForElement("#menu-subitem-content-create-post").then(() => {
                          setTimeout(() => driverObj.current?.moveNext(), 500);
                      });
                 } else {
                     // Desktop Logic (Robust)
                     const getSubItem = () => document.getElementById("menu-subitem-content-create-post");
                     const sidebar = document.getElementById("admin-sidebar");
                     const isSidebarCollapsed = sidebar && sidebar.clientWidth < 200;

                     if (getSubItem()) {
                          driverObj.current?.moveNext();
                     } else {
                          const contentsMenu = document.getElementById("content");
                          if (contentsMenu) {
                              if (isSidebarCollapsed) {
                                  contentsMenu.click();
                                  setTimeout(() => {
                                      contentsMenu.click();
                                      waitForElement("#menu-subitem-content-create-post").then(() => {
                                          setTimeout(() => driverObj.current?.moveNext(), 200);
                                      });
                                  }, 250);
                              } else {
                                  contentsMenu.click();
                                  waitForElement("#menu-subitem-content-create-post").then(() => {
                                      setTimeout(() => driverObj.current?.moveNext(), 200);
                                  });
                              }
                          } else {
                              driverObj.current?.moveNext();
                          }
                     }
                 }
             }
             else if (step.element === "#menu-subitem-content-create-post") {
                  const createPostBtn = document.getElementById("menu-subitem-content-create-post");
                  if (createPostBtn) createPostBtn.click();
                  
                  waitForElement("#create-post-header").then(() => driverObj.current?.moveNext());
             }
             else {
                 driverObj.current?.moveNext();
             }
        }
    });
    driverObj.current.drive();
  };
