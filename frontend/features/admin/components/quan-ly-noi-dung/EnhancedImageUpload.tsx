"use client";

import type React from "react";
import { useCallback } from "react";
import Image from "next/image";
import {
  ImagePlus,
  XCircle,
  RefreshCw,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const translations = {
  vi: {
    title: "Ảnh bìa",
    description: (maxSize: number) =>
      `PNG, JPG, GIF, WebP lên đến ${maxSize}MB`,
    retryCount: (count: number) => `Thử lại ${count}/3`,
    uploading: "Đang tải lên...",
    uploadFailed: "Tải lên thất bại",
    clickToUpload: "Nhấp để tải lên",
    orDragAndDrop: "hoặc kéo và thả",
    retry: "Thử lại",
    chooseDifferentFile: "chọn tệp khác",
    uploadError: "Lỗi tải lên",
    imageUploadSuccess: "Ảnh đã tải lên thành công!",
    maxFileSize: (maxSize: number) => `• Kích thước tệp tối đa: ${maxSize}MB`,
    supportedFormats: "• Định dạng được hỗ trợ: JPG, PNG, GIF, WebP, SVG",
    recommendedDimensions:
      "• Kích thước khuyến nghị: 1200x630px để có kết quả tốt nhất",
    changeImage: "Thay đổi ảnh",
    removeImage: "Xóa ảnh",
    processing: "Đang xử lý...",
    retrying: (count: number) => `Đang thử lại... (${count}/3)`,
  },
  ja: {
    title: "カバー画像",
    description: (maxSize: number) => `PNG, JPG, GIF, WebP 最大${maxSize}MB`,
    retryCount: (count: number) => `再試行 ${count}/3`,
    uploading: "アップロード中...",
    uploadFailed: "アップロード失敗",
    clickToUpload: "クリックしてアップロード",
    orDragAndDrop: "またはドラッグ＆ドロップ",
    retry: "再試行",
    chooseDifferentFile: "別のファイルを選択",
    uploadError: "アップロードエラー",
    imageUploadSuccess: "画像が正常にアップロードされました！",
    maxFileSize: (maxSize: number) => `• 最大ファイルサイズ: ${maxSize}MB`,
    supportedFormats: "• サポートされている形式: JPG, PNG, GIF, WebP, SVG",
    recommendedDimensions: "• 推奨寸法: 最良の結果を得るには1200x630px",
    changeImage: "画像を交換",
    removeImage: "画像を削除",
    processing: "処理中...",
    retrying: (count: number) => `再試行中... (${count}/3)`,
  },
};

interface EnhancedImageUploadProps {
  coverUrl?: string;
  onFileChange: (_file: File) => void;
  onRemove: () => void;
  onRetry?: (_file: File) => void;
  uploadState: {
    isLoading: boolean;
    progress: number;
    error: string | null;
    retryCount: number;
  };
  inputRef: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  title?: string;
  description?: string;
  lastUploadedFile?: File | null;
  currentLang: "vi" | "ja"; // Added currentLang prop
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  coverUrl,
  onFileChange,
  onRemove,
  onRetry,
  uploadState,
  inputRef,
  disabled = false,
  accept = "image/*",
  maxSize = 10,
  title, // Removed default, will use translations
  description, // Removed default, will use translations
  lastUploadedFile = null,
  currentLang, // Destructure currentLang
}) => {
  const t = translations[currentLang]; // Get translations for the current language

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        onFileChange(file);
      }
    },
    [onFileChange]
  );

  const handleRetryClick = useCallback(() => {
    if (onRetry && lastUploadedFile) {
      onRetry(lastUploadedFile);
    }
  }, [onRetry, lastUploadedFile]);

  const getProgressColor = () => {
    if (uploadState.error) return "bg-red-500";
    if (uploadState.progress === 100) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="border rounded-lg p-4 transition-all duration-200 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {title || t.title}
        </h3>
        {uploadState.retryCount > 0 && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {t.retryCount(uploadState.retryCount)}
          </span>
        )}
      </div>
      <div className="space-y-4">
        {coverUrl && !uploadState.error ? (
          // ✅ Image Preview with Enhanced Controls
          <div className="relative w-72 rounded-lg overflow-hidden border border-gray-300 group">
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${coverUrl}`}
              alt="Cover"
              width={288}
              height={192}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  title={t.changeImage}
                  disabled={disabled || uploadState.isLoading}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onRemove}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title={t.removeImage}
                  disabled={disabled || uploadState.isLoading}
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Progress Overlay */}
            {uploadState.isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="font-medium">{t.uploading}</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                      style={{ width: `${uploadState.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs mt-1">{uploadState.progress}%</p>
                </div>
              </div>
            )}
            {/* Success Badge */}
            {!uploadState.isLoading && !uploadState.error && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>
        ) : (
          // ✅ Upload Area with Enhanced States
          <label
            htmlFor="cover-upload"
            className={`
              flex flex-col items-center justify-center w-full h-48
              border-2 border-dashed rounded-lg cursor-pointer
              transition-all duration-200
              ${
                uploadState.error
                  ? "border-red-300 bg-red-50 hover:bg-red-100"
                  : "border-gray-300 bg-gray-50 hover:bg-gray-100"
              }
              ${
                disabled || uploadState.isLoading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }
            `}
          >
            {uploadState.isLoading ? (
              // Loading State
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600 font-medium">{t.uploading}</p>
                <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${uploadState.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadState.progress}%
                </p>
                {uploadState.retryCount > 0 && (
                  <p className="text-xs text-blue-600 mt-1">
                    {t.retrying(uploadState.retryCount)}
                  </p>
                )}
              </div>
            ) : uploadState.error ? (
              // Error State
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-medium mb-2">
                  {t.uploadFailed}
                </p>
                <p className="text-red-500 text-sm mb-3 max-w-xs wrap-break-word">
                  {uploadState.error}
                </p>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleRetryClick}
                    disabled={
                      !onRetry ||
                      !lastUploadedFile ||
                      uploadState.retryCount >= 3
                    }
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className="w-3 h-3 inline mr-1" />
                    {t.retry}
                  </button>
                  <span className="text-gray-400 text-sm">or</span>
                  <span className="text-gray-600 text-sm">
                    {t.chooseDifferentFile}
                  </span>
                </div>
              </div>
            ) : (
              // Default State
              <>
                <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-600 text-center">
                  <span className="font-semibold">{t.clickToUpload}</span>{" "}
                  {t.orDragAndDrop}
                </p>
                <p className="text-xs text-gray-500">
                  {description || t.description(maxSize)}
                </p>
              </>
            )}
            <input
              id="cover-upload"
              ref={inputRef}
              type="file"
              className="hidden"
              accept={accept}
              onChange={handleFileSelect}
              disabled={disabled || uploadState.isLoading}
            />
          </label>
        )}
        {/* ✅ Enhanced Error Display */}
        {uploadState.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-700 font-medium text-sm">
                  {t.uploadError}
                </p>
                <p className="text-red-600 text-sm mt-1">{uploadState.error}</p>
                {/* Retry Actions */}
                <div className="mt-2 flex items-center space-x-3">
                  {onRetry &&
                    lastUploadedFile &&
                    uploadState.retryCount < 3 && (
                      <button
                        onClick={handleRetryClick}
                        className="text-red-700 text-sm hover:text-red-800 font-medium flex items-center"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        {t.retry}
                      </button>
                    )}
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="text-red-700 text-sm hover:text-red-800 font-medium"
                    disabled={disabled || uploadState.isLoading}
                  >
                    {t.chooseDifferentFile}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ✅ Success Message */}
        {!uploadState.isLoading && !uploadState.error && coverUrl && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700 text-sm">{t.imageUploadSuccess}</p>
            </div>
          </div>
        )}
        {/* ✅ Upload Tips */}
        {!uploadState.isLoading && !uploadState.error && !coverUrl && (
          <div className="text-xs text-gray-500 space-y-1">
            <p>{t.maxFileSize(maxSize)}</p>
            <p>{t.supportedFormats}</p>
            <p>{t.recommendedDimensions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedImageUpload;
