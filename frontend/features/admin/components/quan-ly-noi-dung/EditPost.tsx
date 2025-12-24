"use client";

import { useState, useEffect } from "react";
import type React from "react";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Eye,
  FileText,
  Trash2,
  AlertCircle,
  ImagePlus,
  XCircle,
} from "lucide-react";
import SunEditorComponent from "@/shared/components/SunEditorComponent";
import { useAdminPage } from "@/features/admin/contexts/AdminPageContext";
import {
  usePosts,
  type Post,
  type LocalizedString,
  type MediaCover,
} from "@/features/admin/hooks/hooksPost/usePosts";

interface PostFormData {
  title: LocalizedString;
  description: LocalizedString;
  content: LocalizedString;
  cover: MediaCover;
}

const translations = {
  vi: {
    backToEditor: "Quay lại Trình chỉnh sửa",
    previewMode: "Chế độ xem trước",
    preview: "Xem trước",
    updating: "Đang cập nhật...",
    update: "Cập nhật",
    error: "Lỗi",
    failedToUploadCover: "Tải ảnh bìa thất bại: ",
    failedToDeleteCover: "Xóa ảnh bìa thất bại: ",
    titleRequired: "Tiêu đề (Tiếng Việt hoặc Tiếng Nhật) là bắt buộc",
    contentRequired: "Nội dung (Tiếng Việt hoặc Tiếng Nhật) là bắt buộc",
    failedToUpdatePost: "Cập nhật bài viết thất bại",
    originalPostNotFound: "Không tìm thấy dữ liệu bài viết gốc",
    coverImage: "Ảnh bìa",
    removeCoverImage: "Xóa ảnh bìa",
    processing: "Đang xử lý...",
    uploading: "Đang tải lên...",
    clickToUpload: "Nhấp để tải lên",
    orDragAndDrop: "hoặc kéo và thả",
    imageFormatSize: "PNG, JPG, GIF tối đa 5MB",
    errorUploadingImage: "Lỗi tải ảnh lên: ",
    vietnameseSectionTitle: "Tiếng Việt (VI)",
    japaneseSectionTitle: "Tiếng Nhật (JA)",
    postTitleVi: "Tiêu đề bài viết (Tiếng Việt) *",
    placeholderTitleVi: "Nhập tiêu đề bài viết bằng tiếng Việt...",
    descriptionVi: "Mô tả (Tiếng Việt)",
    placeholderDescriptionVi: "Mô tả ngắn gọn về bài viết bằng tiếng Việt...",
    contentVi: "Nội dung (Tiếng Việt) *",
    placeholderContentVi: "Chỉnh sửa nội dung bài viết bằng tiếng Việt...",
    postTitleJa: "投稿タイトル (日本語) *",
    placeholderTitleJa: "日本語で投稿タイトルを入力...",
    descriptionJa: "説明 (日本語)",
    placeholderDescriptionJa: "日本語で記事の簡単な説明...",
    contentJa: "コンテンツ (日本語) *",
    placeholderContentJa: "日本語で投稿コンテンツを編集...",
    editPost: "Chỉnh sửa bài viết",
    deletePost: "Xóa bài viết",
    deletePostConfirmation:
      "Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.",
    cancel: "Hủy",
    delete: "Xóa",
    loadingPost: "Đang tải bài viết...",
    postTitle: "Tiêu đề bài viết",
    noContent: "Chưa có nội dung...",
    postNotFound: "Không tìm thấy bài viết",
    failedToLoadPost: "Tải bài viết thất bại",
    failedToDeletePost: "Xóa bài viết thất bại",
  },
  ja: {
    backToEditor: "エディターに戻る",
    previewMode: "プレビューモード",
    preview: "プレビュー",
    updating: "更新中...",
    update: "更新",
    error: "エラー",
    failedToUploadCover: "カバー画像のアップロードに失敗しました: ",
    failedToDeleteCover: "カバー画像の削除に失敗しました: ",
    titleRequired: "タイトル（ベトナム語または日本語）は必須です",
    contentRequired: "コンテンツ（ベトナム語または日本語）は必須です",
    failedToUpdatePost: "投稿の更新に失敗しました",
    originalPostNotFound: "元の投稿データが見つかりません",
    coverImage: "カバー画像",
    removeCoverImage: "カバー画像を削除",
    processing: "処理中...",
    uploading: "アップロード中...",
    clickToUpload: "クリックしてアップロード",
    orDragAndDrop: "またはドラッグ＆ドロップ",
    imageFormatSize: "PNG, JPG, GIF 最大5MB",
    errorUploadingImage: "画像のアップロードエラー: ",
    vietnameseSectionTitle: "ベトナム語 (VI)",
    japaneseSectionTitle: "日本語 (JA)",
    postTitleVi: "投稿タイトル (ベトナム語) *",
    placeholderTitleVi: "ベトナム語で投稿タイトルを入力...",
    descriptionVi: "説明 (ベトナム語)",
    placeholderDescriptionVi: "ベトナム語で記事の簡単な説明...",
    contentVi: "コンテンツ (ベトナム語) *",
    placeholderContentVi: "ベトナム語で投稿コンテンツを編集...",
    postTitleJa: "投稿タイトル (日本語) *",
    placeholderTitleJa: "日本語で投稿タイトルを入力...",
    descriptionJa: "説明 (日本語)",
    placeholderDescriptionJa: "日本語で記事の簡単な説明...",
    contentJa: "コンテンツ (日本語) *",
    placeholderContentJa: "日本語で投稿コンテンツを編集...",
    editPost: "投稿を編集",
    deletePost: "投稿を削除",
    deletePostConfirmation:
      "この投稿を削除してもよろしいですか？この操作は元に戻せません。",
    cancel: "キャンセル",
    delete: "削除",
    loadingPost: "投稿を読み込み中...",
    postTitle: "投稿タイトル",
    noContent: "まだコンテンツがありません...",
    postNotFound: "投稿が見つかりません",
    failedToLoadPost: "投稿の読み込みに失敗しました",
    failedToDeletePost: "投稿の削除に失敗しました",
  },
};

export default function EditPost() {
  const { setCurrentPage } = useAdminPage();
  const {
    updatePost,
    deletePost,
    getPost,
    error,
    uploadImage,
    deleteImage,
    uploadState,
    coverImageInputRef,
    clearCoverInput,
  } = usePosts();

  const [postData, setPostData] = useState<PostFormData>({
    title: { vi: "", ja: "" },
    description: { vi: "", ja: "" },
    content: { vi: "", ja: "" },
    cover: { mediaCode: "", url: "" },
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [originalPost, setOriginalPost] = useState<Post | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<"vi" | "ja">("vi");
  const t = translations[currentLang]; // Get current language translations

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const postCode = localStorage.getItem("editPostCode");
        if (!postCode) {
          setCurrentPage("content-posts");
          return;
        }
        const post = await getPost(postCode);
        if (!post) {
          alert(t.postNotFound);
          setCurrentPage("content-posts");
          return;
        }
        setOriginalPost(post);
        setPostData({
          title: post.title,
          description: post.description,
          content: post.content,
          cover: post.cover,
        });
      } catch {
        alert(t.failedToLoadPost);
        setCurrentPage("content-posts");
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [getPost, setCurrentPage, t.postNotFound, t.failedToLoadPost]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setCoverFile(file);
  };

  useEffect(() => {
    const uploadCover = async () => {
      if (coverFile) {
        const previousCover = postData.cover;
        try {
          const uploadedMedia = await uploadImage(coverFile);
          if (
            previousCover.mediaCode &&
            previousCover.mediaCode !== uploadedMedia.mediaCode
          ) {
            try {
              await deleteImage(previousCover.mediaCode);
            } catch (deleteError: unknown) {
              console.warn("⚠️ Failed to delete previous cover:", deleteError); // Uncommented
              // Optionally, log or display this specific error if needed
            }
          }
          setPostData((prev) => ({
            ...prev,
            cover: uploadedMedia,
          }));
          setSaveError(null);
          setCoverFile(null);
        } catch (err: unknown) {
          // Changed from 'any' to 'unknown'
          let errorMessage = "Unknown error";
          if (err instanceof Error) {
            errorMessage = err.message;
          } else if (
            typeof err === "object" &&
            err !== null &&
            "message" in err &&
            typeof (err as { message: unknown }).message === "string"
          ) {
            errorMessage = (err as { message: string }).message;
          } else if (typeof err === "string") {
            errorMessage = err;
          }
          setSaveError(t.failedToUploadCover + errorMessage);
          setPostData((prev) => ({
            ...prev,
            cover: previousCover,
          }));
          setCoverFile(null);
          clearCoverInput();
        }
      }
    };
    uploadCover();
  }, [
    coverFile,
    uploadImage,
    deleteImage,
    clearCoverInput,
    postData.cover,
    t.failedToUploadCover,
  ]);

  const handleRemoveCover = async () => {
    if (postData.cover.mediaCode) {
      try {
        await deleteImage(postData.cover.mediaCode);
      } catch (err: unknown) {
        // Changed from 'any' to 'unknown'
        let errorMessage = "Unknown error";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (
          typeof err === "object" &&
          err !== null &&
          "message" in err &&
          typeof (err as { message: unknown }).message === "string"
        ) {
          errorMessage = (err as { message: string }).message;
        } else if (typeof err === "string") {
          errorMessage = err;
        }
        setSaveError(t.failedToDeleteCover + errorMessage);
      }
    }
    setPostData((prev) => ({ ...prev, cover: { mediaCode: "", url: "" } }));
    setCoverFile(null);
    clearCoverInput();
    setSaveError(null);
  };

  const handleContentChange = (content: string, lang: "vi" | "ja") => {
    setPostData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: content,
      },
    }));
  };

  const handleSave = async () => {
    if (!postData.title.vi.trim() && !postData.title.ja.trim()) {
      setSaveError(t.titleRequired);
      return;
    }
    if (!postData.content.vi.trim() && !postData.content.ja.trim()) {
      setSaveError(t.contentRequired);
      return;
    }
    if (!originalPost) {
      setSaveError(t.originalPostNotFound);
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const updatedData = {
        title: postData.title,
        description: postData.description,
        content: postData.content,
        cover: postData.cover,
      };
      await updatePost(originalPost.code, updatedData);
      setCurrentPage("content-posts");
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : t.failedToUpdatePost
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!originalPost) return;
    try {
      if (originalPost.cover.mediaCode) {
        try {
          await deleteImage(originalPost.cover.mediaCode);
        } catch (deleteError: unknown) {
          console.warn("⚠️ Failed to delete post cover:", deleteError); // Uncommented
          // Optionally, log or display this specific error if needed
        }
      }
      await deletePost(originalPost.code);
      setShowDeleteModal(false);
      setCurrentPage("content-posts");
    } catch {
      alert(t.failedToDeletePost);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 sm:px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.editPost}
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{t.loadingPost}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isPreview) {
    const displayTitle =
      currentLang === "vi" ? postData.title.vi : postData.title.ja;
    const displayDescription =
      currentLang === "vi" ? postData.description.vi : postData.description.ja;
    const displayContent =
      currentLang === "vi" ? postData.content.vi : postData.content.ja;

    return (
      <div className="p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-4 sm:px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backToEditor}
              </button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2 mb-2 sm:mb-0">
                  <span className="text-sm text-gray-500">{t.previewMode}</span>
                  <Eye className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentLang("vi")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                      currentLang === "vi"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    VI
                  </button>
                  <button
                    onClick={() => setCurrentLang("ja")}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 ${
                      currentLang === "ja"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    JA
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            <article className="max-w-none">
              <header className="mb-8">
                {postData.cover.url && (
                  <div className="mb-6 w-full h-auto overflow-hidden rounded-lg relative">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${postData.cover.url}`}
                      alt={displayTitle || t.postTitle}
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                )}
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {displayTitle || t.postTitle}
                </h1>
                {displayDescription && (
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {displayDescription}
                  </p>
                )}
              </header>
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: displayContent || `<p>${t.noContent}</p>`,
                }}
                style={{
                  fontSize: "16px",
                  lineHeight: "1.75",
                }}
              />
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-4 sm:px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <button
                id="btn-back-to-list"
                onClick={() => setCurrentPage("content-posts")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">
                  {t.editPost}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
              <button
                id="btn-delete-post-header"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4" />
                {t.delete}
              </button>
              <button
                id="btn-preview-post"
                onClick={() => setIsPreview(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <Eye className="w-4 h-4" />
                {t.preview}
              </button>
              <button
                id="btn-save-post"
                onClick={() => handleSave()}
                disabled={
                  isSaving ||
                  (!postData.title.vi.trim() && !postData.title.ja.trim()) ||
                  uploadState.isLoading
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? t.updating : t.update}
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          {(saveError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{t.error}</span>
              </div>
              <p className="text-red-600 text-sm mt-1">{saveError || error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cover Image Upload */}
              <div id="section-cover-image" className="md:col-span-2 border rounded-lg p-4 transition-all duration-200 border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t.coverImage}
                </h3>
                <div className="space-y-4">
                  {postData.cover.url ? (
                    <div className="relative w-72 rounded-lg overflow-hidden border border-gray-300">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${postData.cover.url}`}
                        alt={t.postTitle}
                        width={288}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCover}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title={t.removeCoverImage}
                        disabled={uploadState.isLoading}
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                      {uploadState.isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                          {t.processing}
                        </div>
                      )}
                    </div>
                  ) : (
                    <label
                      htmlFor="cover-upload-edit"
                      className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      {uploadState.isLoading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                          <p className="text-gray-600">{t.uploading}</p>
                        </div>
                      ) : (
                        <>
                          <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />
                          <p className="mb-2 text-sm text-gray-600 text-center">
                            <span className="font-semibold">
                              {t.clickToUpload}
                            </span>{" "}
                            {t.orDragAndDrop}
                          </p>
                          <p className="text-xs text-gray-500">
                            {t.imageFormatSize}
                          </p>
                        </>
                      )}
                      <input
                        id="cover-upload-edit"
                        ref={
                          coverImageInputRef as React.RefObject<HTMLInputElement>
                        } // Type assertion added here
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadState.isLoading}
                      />
                    </label>
                  )}
                  {uploadState.error && (
                    <p className="text-red-600 text-sm mt-2">
                      {t.errorUploadingImage} {uploadState.error}
                    </p>
                  )}
                </div>
              </div>
              {/* Vietnamese Fields */}
              <div id="section-vi-content" className="border rounded-lg p-4 transition-all duration-200 border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t.vietnameseSectionTitle}
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTitleVi}
                    </label>
                    <input
                      id="input-title-vi"
                      type="text"
                      value={postData.title.vi}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          title: { ...prev.title, vi: e.target.value },
                        }))
                      }
                      placeholder={t.placeholderTitleVi}
                      className="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.descriptionVi}
                    </label>
                    <textarea
                      id="input-desc-vi"
                      value={postData.description.vi}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          description: {
                            ...prev.description,
                            vi: e.target.value,
                          },
                        }))
                      }
                      placeholder={t.placeholderDescriptionVi}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t.contentVi}
                    </label>
                    <div id="input-content-vi-wrapper">
                      <SunEditorComponent
                        value={postData.content.vi}
                        onChange={(c) => handleContentChange(c, "vi")}
                        placeholder={t.placeholderContentVi}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Japanese Fields */}
              <div id="section-ja-content" className="border rounded-lg p-4 transition-all duration-200 border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t.japaneseSectionTitle}
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.postTitleJa}
                    </label>
                    <input
                      id="input-title-ja"
                      type="text"
                      value={postData.title.ja}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          title: { ...prev.title, ja: e.target.value },
                        }))
                      }
                      placeholder={t.placeholderTitleJa}
                      className="w-full px-4 py-3 text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t.descriptionJa}
                    </label>
                    <textarea
                      id="input-desc-ja"
                      value={postData.description.ja}
                      onChange={(e) =>
                        setPostData((prev) => ({
                          ...prev,
                          description: {
                            ...prev.description,
                            ja: e.target.value,
                          },
                        }))
                      }
                      placeholder={t.placeholderDescriptionJa}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      {t.contentJa}
                    </label>
                    <div id="input-content-ja-wrapper">
                      <SunEditorComponent
                        value={postData.content.ja}
                        onChange={(c) => handleContentChange(c, "ja")}
                        placeholder={t.placeholderContentJa}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t.deletePost}
            </h3>
            <p className="text-gray-600 mb-6">{t.deletePostConfirmation}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
