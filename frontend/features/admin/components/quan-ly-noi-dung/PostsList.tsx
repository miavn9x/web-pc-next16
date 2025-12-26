"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  RefreshCw,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import { usePosts } from "@/features/admin/components/quan-ly-noi-dung/hooks/usePosts";

const t = {
  postsList: "Danh sách bài viết",
  managePosts: "Quản lý bài viết của bạn",
  totalPosts: "tổng cộng",
  refresh: "Làm mới",
  newPost: "Bài viết mới",
  errorLoadingPosts: "Lỗi tải bài viết",
  tryAgain: "Thử lại",
  searchPlaceholder: "Tìm kiếm bài viết theo tiêu đề hoặc mô tả...",
  noPostsFound: "Không tìm thấy bài viết nào",
  noPostsYet: "Chưa có bài viết nào",
  adjustSearch:
    "Hãy thử điều chỉnh các điều khoản tìm kiếm của bạn hoặc xóa tìm kiếm để xem tất cả các bài viết.",
  getStarted: "Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.",
  createFirstPost: "Tạo bài viết đầu tiên của bạn",
  editPost: "Chỉnh sửa bài viết",
  deletePost: "Xóa bài viết",
  confirmDelete: "Bạn có chắc chắn muốn xóa bài viết này không?",
  failedToDelete: "Xóa bài viết thất bại. Vui lòng thử lại.",
  loadingPosts: "Đang tải bài viết...",
  postTitle: "Tiêu đề bài viết",
  postDescription: "Mô tả bài viết",
};

export default function PostsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const { setCurrentPage } = useAdminPage();
  const { posts, isLoading, error, deletePost, refreshPosts } = usePosts();
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>(
    {}
  );

  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const handleDeletePost = async (postCode: string) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deletePost(postCode);
      } catch  {
        alert(t.failedToDelete);
      }
    }
  };

  const handleEditPost = (postCode: string) => {
    localStorage.setItem("editPostCode", postCode);
    setCurrentPage("content-edit-post");
  };

  const handleRefresh = async () => {
    try {
      await refreshPosts();
    } catch  {
      alert(t.failedToDelete); // Reusing the same error message for simplicity
    }
  };

  // Handle image error by setting fallback image for specific post
  const handleImageError = (postCode: string) => {
    setImageSources((prev) => ({
      ...prev,
      [postCode]: "/img/user.png", // Keeping the original fallback image
    }));
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 sm:px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.postsList}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t.loadingPosts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div id="posts-list-header" className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 sm:px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div id="posts-page-title-section" className="mb-4 sm:mb-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {t.postsList}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {t.managePosts} ({posts.length} {t.totalPosts})
              </p>
            </div>
            <div id="posts-toolbar-section" className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              <button
                id="btn-refresh-posts"
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                title={t.refresh}
              >
                <RefreshCw className="w-4 h-4" />
                {t.refresh}
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{t.errorLoadingPosts}</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-2 text-sm text-red-700 hover:text-red-800 underline"
              >
                {t.tryAgain}
              </button>
            </div>
          )}
          <div id="posts-search-section" className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                id="input-search-posts"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? t.noPostsFound : t.noPostsYet}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? t.adjustSearch : t.getStarted}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setCurrentPage("content-create-post")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200"
                >
                  <Plus className="w-4 h-4" />
                  {t.createFirstPost}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <div
                  key={post.code}
                  id={`post-item-${index}`}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      {/* Cover Image */}
                      <div id={`post-img-${index}`} className="shrink-0 relative group w-24 h-24">
                        {post.cover?.url ? (
                          <Image
                            src={
                              imageSources[post.code] ||
                              `${
                                process.env.NEXT_PUBLIC_IMAGE_URL ||
                                "/placeholder.svg"
                              }${post.cover.url}`
                            }
                            alt={post.title || t.postTitle}
                            width={96}
                            height={96}
                            className="w-24 h-24 object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                            onError={() => handleImageError(post.code)}
                          />
                        ) : (
                          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-opacity duration-300"></div>
                      </div>
                      {/* Post Content */}
                      <div id={`post-content-${index}`} className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 id={`post-title-${index}`} className="text-xl font-semibold text-gray-900 truncate">
                            {post.title}
                          </h3>
                        </div>
                        <p id={`post-desc-${index}`} className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                          <div id={`post-date-${index}`} className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div id={`post-actions-${index}`} className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4 shrink-0">
                      <button
                        id={`btn-edit-post-${index}`}
                        onClick={() => handleEditPost(post.code)}
                        className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        title={t.editPost}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        id={`btn-delete-post-${index}`}
                        onClick={() => handleDeletePost(post.code)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title={t.deletePost}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
