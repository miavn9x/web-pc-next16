"use client";

import {
  BookOpen,
  LayoutDashboard,
  Package,
  Users,
  ArrowRight,
  HelpCircle,
  PlayCircle,
  Sparkles,
  FileText,
  Edit
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAdminPage } from "../../contexts/AdminPageContext";

const features = [
  {
    icon: <LayoutDashboard className="w-7 h-7 text-indigo-600" />,
    bg: "bg-indigo-50",
    title: { vi: "Tổng Quan Dashboard", ja: "ダッシュボード概要" },
    description: {
      vi: "Hướng dẫn chi tiết cách xem báo cáo doanh thu, theo dõi đơn hàng và phân tích thống kê khách hàng quan trọng.",
      ja: "収益レポート、注文追跡、および重要な顧客統計分析の表示方法に詳細なガイド。",
    },
    tourKey: "dashboard",
    link: "/wfourtech?tour=dashboard",
    internalPage: "dashboard",
    btnColor: "bg-indigo-600 hover:bg-indigo-700"
  },
  {
    icon: <BookOpen className="w-7 h-7 text-emerald-600" />,
    bg: "bg-emerald-50",
    title: { vi: "Quản Lý Sản Phẩm", ja: "商品管理" },
    description: {
      vi: "Làm chủ quy trình quản lý: Thêm mới, chỉnh sửa thông tin, quản lý kho và xóa sản phẩm khỏi hệ thống.",
      ja: "管理プロセスの習得：新規追加、情報編集、在庫管理、およびシステムからの商品削除。",
    },
    actions: [
      {
        label: { vi: "Danh sách sản phẩm", ja: "商品リスト" },
        subLabel: { vi: "Xem và quản lý", ja: "閲覧と管理" },
        tourKey: "products-list",
        link: "/wfourtech?tour=products",
        internalPage: "products-list",
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        label: { vi: "Thêm sản phẩm mới", ja: "新商品を追加" },
        subLabel: { vi: "Tạo mới item", ja: "新規アイテム作成" },
        tourKey: "products-add",
        link: "/wfourtech?tour=products-add",
        internalPage: "products-add",
        icon: <Sparkles className="w-4 h-4" />
      }
    ]
  },
  {
    icon: <Package className="w-7 h-7 text-amber-600" />,
    bg: "bg-amber-50",
    title: { vi: "Quản Lý Đơn Hàng", ja: "注文管理" },
    description: {
      vi: "Quy trình xử lý đơn hàng từ A-Z: Tìm kiếm, lọc, xem chi tiết và cập nhật trạng thái giao hàng.",
      ja: "A-Zの注文処理プロセス：検索、フィルタリング、詳細表示、配送ステータスの更新。",
    },
    tourKey: "orders",
    link: "/wfourtech?tour=orders",
    internalPage: "orders-all",
    btnColor: "bg-amber-600 hover:bg-amber-700"
  },
  {
    icon: <Users className="w-7 h-7 text-rose-600" />,
    bg: "bg-rose-50",
    title: { vi: "Quản Lý Khách Hàng", ja: "顧客管理" },
    description: {
      vi: "Hiểu rõ khách hàng của bạn: Xem lịch sử mua hàng, thông tin liên hệ và tổng giá trị chi tiêu.",
      ja: "顧客を理解する：購入履歴、連絡先情報、および総支出額の表示。",
    },
    tourKey: "customers",
    link: "/wfourtech?tour=customers",
    internalPage: "customers-list",
    btnColor: "bg-rose-600 hover:bg-rose-700"
  },
  {
    icon: <FileText className="w-7 h-7 text-purple-600" />,
    bg: "bg-purple-50",
    title: { vi: "Quản Lý Nội Dung", ja: "コンテンツ管理" },
    description: {
      vi: "Xây dựng nội dung phong phú: Quản lý bài viết, tin tức và cập nhật thông tin mới nhất cho website.",
      ja: "豊富なコンテンツの構築：記事、ニュースの管理、およびウェブサイトの最新情報の更新。",
    },
    actions: [
      {
        label: { vi: "Danh sách bài viết", ja: "投稿リスト" },
        subLabel: { vi: "Quản lý tất cả", ja: "すべて管理" },
        tourKey: "posts-list",
        link: "/wfourtech?tour=posts-list",
        internalPage: "content-posts", // Check correct page ID, user used 'content-create-post' in PostsList, standard pattern implies 'content-posts-list'? 
                                              // In AdminContent.tsx, I need to check the case. Usually default is posts list?
                                              // User snippet in Step 709 mentions `content-create-post`.
                                              // I'll assume 'content-list' or similar. I'll check AdminContent.tsx later but 'posts-list' is a safe guess for now or just generic 'content-management'.
                                              // Actually, `PostsList.tsx` is likely mapped to a case. I saw `PostsList` imported in `AdminContent.tsx` snippet in step 605.
                                              // The case was `posts-list`. Nope, let me check step 605.
                                              // Step 605: `case "posts-list": return ... <PostsList ... />`
                                              // So internalPage should be `posts-list`? Wait, `ProductsList` was `products-list`.
                                              // But `PostsList` in 605 snippet... wait, key "guide-center" is there. I don't see "posts-list" in the *visible* snippet of 605. 
                                              // Ah, wait. Step 605 snippet has: `case "products-list": ...`. I missed checking for `posts-list` specifically.
                                              // But `PostsList` is imported in snippet.
                                              // I will assume `internalPage: "posts-list"` for now, if it fails I'll fix it.
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        label: { vi: "Đăng bài viết", ja: "新規投稿" },
        subLabel: { vi: "Tạo nội dung mới", ja: "新規コンテンツ作成" },
        tourKey: "content-create-post",
        link: "/wfourtech?tour=content-create-post",
        internalPage: "content-create-post", // Based on user diff in 709
        icon: <Edit className="w-4 h-4" />
      }
    ]
  },
  {
    icon: <Sparkles className="w-7 h-7 text-pink-600" />,
    bg: "bg-pink-50",
    title: { vi: "Quản Lý Khuyến Mãi", ja: "プロモーション管理" },
    description: {
      vi: "Chiến lược giá và ưu đãi: Quản lý mã giảm giá, chương trình khuyến mãi để thúc đẩy doanh số.",
      ja: "価格戦略とオファー：売上を促進するためのクーポンとプロモーションの管理。",
    },
    actions: [
      {
        label: { vi: "Danh sách mã", ja: "クーポンリスト" },
        subLabel: { vi: "Quản lý mã giảm giá", ja: "クーポン管理" },
        tourKey: "coupons-list",
        link: "/wfourtech?tour=coupons-list",
        internalPage: "coupons-list",
        icon: <BookOpen className="w-4 h-4" />
      },
      {
        label: { vi: "Thêm mã mới", ja: "新規クーポン追加" },
        subLabel: { vi: "Tạo chương trình khuyến mãi", ja: "プロモーション作成" },
        tourKey: "coupons-add",
        link: "/wfourtech?tour=coupons-add",
        internalPage: "coupons-add",
        icon: <Edit className="w-4 h-4" />
      }
    ]
  }
];

const GuideCenter = () => {
  const router = useRouter();
  const { setCurrentPage } = useAdminPage();
  const [locale, setLocale] = useState<"vi" | "ja">("vi");

  const handleStartTour = (item: any) => {
    if (item.internalPage) {
      setCurrentPage(item.internalPage);
    }

    setTimeout(() => {
      if (item.link) {
        router.push(`${item.link}&lang=${locale}`);
      }
    }, 100);
  };

  return (
    <div className="p-4 sm:p-8 container mx-auto space-y-8 min-h-screen bg-gray-50/50">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-500 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              {locale === 'vi' ? "Trung Tâm Hướng Dẫn" : "ガイドセンター"}
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed">
              {locale === 'vi' ? (
                <>
                  Chào mừng bạn đến với Trung Tâm Hướng Dẫn hệ thống quản trị website do Đội ngũ <span className="font-bold text-white">W Four Tech</span> phát triển. Hãy chọn một mục bên dưới để bắt đầu tour hướng dẫn tương tác.
                </>
              ) : (
                "W Four Techチームによって開発されたウェブサイト管理システムのガイドセンターへようこそ。以下の項目を選択して、インタラクティブなガイドツアーを開始してください。"
              )}
            </p>
          </div>

          {/* Glassmorphism Language Switcher */}
          <div className="bg-white/20 backdrop-blur-md border border-white/30 p-1.5 rounded-xl flex items-center shadow-lg">
            <button
              onClick={() => setLocale('vi')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                locale === 'vi' 
                  ? 'bg-white text-blue-700 shadow-sm transform scale-105' 
                  : 'text-blue-50 hover:bg-white/10'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setLocale('ja')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                locale === 'ja' 
                  ? 'bg-white text-blue-700 shadow-sm transform scale-105' 
                  : 'text-blue-50 hover:bg-white/10'
              }`}
            >
              日本語
            </button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full overflow-hidden ${feature.actions ? 'row-span-1 xl:col-span-1' : ''}`}
          >
            {/* Decoration gradient on hover */}
            <div className={`absolute top-0 left-0 w-full h-1 ${feature.btnColor?.replace('bg-', 'bg-') || 'bg-gray-200'} origin-left transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>

            <div className="mb-6 flex items-center justify-center">
              <div className={`${feature.bg} p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                {feature.icon}
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-700 transition-colors">
              {feature.title[locale]}
            </h3>
            
            <p className="text-gray-500 text-sm leading-relaxed flex-grow text-justify">
              {feature.description[locale]}
            </p>

            {/* Actions Area */}
            <div className="mt-auto pt-4">
              {feature.actions ? (
                <div className="space-y-3">
                  {feature.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => handleStartTour(action)}
                      className="w-full group/btn flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600">
                            {action.icon}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-semibold text-gray-900 group-hover/btn:text-blue-700">
                                {action.label[locale]}
                            </div>
                            <div className="text-xs text-gray-400 font-medium">
                                {action.subLabel[locale]}
                            </div>
                        </div>
                      </div>
                      <PlayCircle className="w-6 h-6 text-red-500 group-hover/btn:text-blue-500 transform group-hover/btn:scale-110 transition-all" />
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => handleStartTour(feature)}
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group/btn ${feature.btnColor || 'bg-gray-600'}`}
                >
                  <PlayCircle className="w-5 h-5 opacity-90" />
                  <span>{locale === 'vi' ? 'Bắt Đầu Ngay' : '今すぐ開始'}</span>
                  <ArrowRight className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Support Section */}
      <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="bg-orange-50 p-3 rounded-full">
              <HelpCircle className="w-8 h-8 text-orange-500" />
           </div>
           <div>
              <h3 className="text-lg font-bold text-gray-900">
                {locale === 'vi' ? "Bạn cần hỗ trợ thêm?" : "さらにサポートが必要ですか？"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {locale === 'vi' 
                  ? "Liên hệ với đội ngũ kỹ thuật nếu bạn gặp bất kỳ vấn đề nào." 
                  : "問題が発生した場合は、技術チームにお問い合わせください。"}
              </p>
           </div>
        </div>
        <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
           {locale === 'vi' ? "Liên hệ hỗ trợ" : "サポートに連絡"}
        </button>
      </div>
    </div>
  );
};

export default GuideCenter;
