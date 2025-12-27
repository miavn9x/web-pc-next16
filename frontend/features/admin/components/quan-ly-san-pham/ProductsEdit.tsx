"use client";

import type React from "react";
import {  useState, useEffect } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { useEditProduct } from "./hooks/editProductHooks";

interface ProductsEditProps {
  productCode: string;
  onBack?: () => void;
  onUpdateSuccess?: () => void;
  initialLanguage?: string;
}

const ProductsEdit: React.FC<ProductsEditProps> = ({
  productCode,
  onBack,
  onUpdateSuccess,
  initialLanguage = "vi",
}) => {
  const [language, setLanguage] = useState<"vi" | "ja">(
    initialLanguage === "ja" ? "ja" : "vi"
  );

  const {
    productData,
    setProductData,
    detailImagesInputRef,
    coverImageInputRef,
    MAX_DETAIL_IMAGES,
    handleCoverChange,
    handleGalleryChange,
    handleCoverDelete,
    handleGalleryImageDelete,
    handleCategoryViChange,
    addVariant,
    removeVariant,
    updateVariant,
    handleSubmit: originalHandleSubmit,
    handleDescriptionViChange,
    handleDescriptionJaChange,
    loading,
    error,
  } = useEditProduct(productCode);

  useEffect(() => {
    if (initialLanguage) {
      setLanguage(initialLanguage === "ja" ? "ja" : "vi");
    }
  }, [initialLanguage]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "vi" ? "ja" : "vi"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await originalHandleSubmit(e);
      setTimeout(() => {
        if (onUpdateSuccess) {
          onUpdateSuccess();
        } else if (onBack) {
          onBack();
        }
      }, 2000);
    } catch {
      // Error handling is already done in the hook
    }
  };

  const handleCoverDeleteWithConfirm = () => {
    const message =
      language === "vi"
        ? "Bạn có chắc chắn muốn xóa ảnh cover này không?"
        : "このカバー画像を削除してもよろしいですか？";
    if (window.confirm(message)) {
      handleCoverDelete();
      toast.info(
        language === "vi" ? "Đã xóa ảnh cover" : "カバー画像を削除しました",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  const handleGalleryImageDeleteWithConfirm = (index: number) => {
    const message =
      language === "vi"
        ? "Bạn có chắc chắn muốn xóa ảnh này không?"
        : "この画像を削除してもよろしいですか？";
    if (window.confirm(message)) {
      handleGalleryImageDelete(index);
      toast.info(
        language === "vi"
          ? "Đã xóa ảnh khỏi gallery"
          : "ギャラリーから画像を削除しました",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  const handleCoverChangeWithPreview = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          language === "vi"
            ? "Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB."
            : "ファイルサイズが大きすぎます。5MB以下のファイルを選択してください。"
        );
        if (e.target) e.target.value = "";
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(
          language === "vi"
            ? "Vui lòng chọn file hình ảnh hợp lệ."
            : "有効な画像ファイルを選択してください。"
        );
        if (e.target) e.target.value = "";
        return;
      }
      handleCoverChange(e);
      toast.success(
        language === "vi"
          ? "Đã thêm ảnh cover mới"
          : "新しいカバー画像を追加しました",
        {
          position: "top-right",
          autoClose: 2000,
        }
      );
    }
  };

  const handleGalleryChangeWithPreview = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const currentGalleryCount = productData?.gallery?.length || 0;
    if (currentGalleryCount + files.length > MAX_DETAIL_IMAGES) {
      toast.error(
        language === "vi"
          ? `Chỉ có thể thêm tối đa ${
              MAX_DETAIL_IMAGES - currentGalleryCount
            } ảnh nữa.`
          : `最大${MAX_DETAIL_IMAGES - currentGalleryCount}枚まで追加できます。`
      );
      if (e.target) e.target.value = "";
      return;
    }
    const invalidFiles = files.filter(
      (file) => file.size > 5 * 1024 * 1024 || !file.type.startsWith("image/")
    );
    if (invalidFiles.length > 0) {
      toast.error(
        language === "vi"
          ? "Một số file không hợp lệ. Vui lòng chọn file hình ảnh nhỏ hơn 5MB."
          : "無効なファイルがあります。5MB以下の画像ファイルを選択してください。"
      );
      if (e.target) e.target.value = "";
      return;
    }
    handleGalleryChange(e);
    toast.success(
      language === "vi"
        ? `Đã thêm ${files.length} ảnh vào gallery`
        : `ギャラリーに${files.length}枚の画像を追加しました`,
      {
        position: "top-right",
        autoClose: 2000,
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="mt-4 text-gray-700">
            {language === "vi" ? "Đang tải dữ liệu..." : "読み込み中..."}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-red-800 font-medium text-lg mb-2">
            {language === "vi" ? "Có lỗi xảy ra" : "エラーが発生しました"}
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {language === "vi" ? "Quay lại danh sách" : "リストに戻る"}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-yellow-800 font-medium text-lg mb-2">
            {language === "vi"
              ? "Không tìm thấy sản phẩm"
              : "商品が見つかりません"}
          </h3>
          <p className="text-yellow-600 mb-4">
            {language === "vi"
              ? `Sản phẩm với mã ${productCode} không tồn tại hoặc đã bị xóa.`
              : `商品コード${productCode}は存在しないか、削除されました。`}
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              {language === "vi" ? "Quay lại danh sách" : "リストに戻る"}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Sticky on mobile */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-row items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-700">
              {/* {language === "vi" ? "Sửa sản phẩm" : "商品編集"} */}
            </h2>

            <div className="flex items-center gap-2">
              <button
                id="btn-edit-language-toggle"
                onClick={toggleLanguage}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                {language === "vi" ? "日本語" : "Tiếng Việt"}
              </button>

              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {productData.error && (
            <div className="mt-3 text-red-600 text-sm">{productData.error}</div>
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="w-full! sm:w-auto! p-2! sm:p-0!"
      />

      {/* Main Content */}
      <div className="w-full mx-auto">
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {/* Info Header */}
          <div className="px-4 sm:px-6 py-4 border-b bg-gray-50">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
              {language === "vi" ? "Thông tin sản phẩm" : "商品情報"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              {language === "vi" ? "Mã sản phẩm:" : "商品コード:"}{" "}
              {productData.productCode}
            </p>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6" id="product-edit-form">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Product Names */}
              <div
                className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6"
                id="field-product-name"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "vi"
                      ? "Tên sản phẩm (VN) *"
                      : "商品名 (VN) *"}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder={
                      language === "vi"
                        ? "Nhập tên sản phẩm (Tiếng Việt)"
                        : "商品名を入力してください (ベトナム語)"
                    }
                    value={productData.nameVi}
                    onChange={(e) =>
                      setProductData((prev) =>
                        prev ? { ...prev, nameVi: e.target.value } : prev
                      )
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "vi" ? "商品名 (JA) *" : "商品名 (JA) *"}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder={
                      language === "vi"
                        ? "商品名を入力してください (日本語)"
                        : "商品名を入力してください (日本語)"
                    }
                    value={productData.nameJa}
                    onChange={(e) =>
                      setProductData((prev) =>
                        prev ? { ...prev, nameJa: e.target.value } : prev
                      )
                    }
                    required
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div
                className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6"
                id="field-product-desc"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "vi"
                      ? "Mô tả sản phẩm (VN)"
                      : "商品説明 (VN)"}
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <SunEditor
                      setContents={productData.description.vi || ""}
                      onChange={handleDescriptionViChange}
                      setOptions={{
                        height: "200px",
                        buttonList: [
                          ["undo", "redo"],
                          ["font", "fontSize", "formatBlock"],
                          ["paragraphStyle", "blockquote"],
                          [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript",
                          ],
                          ["fontColor", "hiliteColor", "textStyle"],
                          ["removeFormat"],
                          ["outdent", "indent"],
                          ["align", "horizontalRule", "list", "lineHeight"],
                          ["table", "link", "image", "video"],
                          ["fullScreen", "showBlocks", "codeView"],
                        ],
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "vi" ? "商品説明 (JA)" : "商品説明 (JA)"}
                  </label>
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <SunEditor
                      setContents={productData.description.ja || ""}
                      onChange={handleDescriptionJaChange}
                      setOptions={{
                        height: "200px",
                        buttonList: [
                          ["undo", "redo"],
                          ["font", "fontSize", "formatBlock"],
                          ["paragraphStyle", "blockquote"],
                          [
                            "bold",
                            "underline",
                            "italic",
                            "strike",
                            "subscript",
                            "superscript",
                          ],
                          ["fontColor", "hiliteColor", "textStyle"],
                          ["removeFormat"],
                          ["outdent", "indent"],
                          ["align", "horizontalRule", "list", "lineHeight"],
                          ["table", "link", "image", "video"],
                          ["fullScreen", "showBlocks", "codeView"],
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div
                className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6"
                id="field-product-category"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "vi" ? "Danh mục (VN) *" : "カテゴリ (VN) *"}
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    value={productData.categoryVi}
                    onChange={handleCategoryViChange}
                    required
                  >
                    <option value="">
                      {language === "vi" ? "Chọn danh mục" : "カテゴリを選択"}
                    </option>
                    <option value="banh-trang">
                      {language === "vi" ? "Bánh tráng" : "ライスペーパー"}
                    </option>
                    <option value="cac-loai-kho">
                      {language === "vi" ? "Các loại khô" : "乾物"}
                    </option>
                    <option value="do-an-vat">
                      {language === "vi" ? "Đồ ăn vặt" : "スナック"}
                    </option>
                    <option value="trai-cay">
                      {language === "vi" ? "Trái cây" : "フルーツ"}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === "vi" ? "カテゴリ (JA) *" : "カテゴリ (JA) *"}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm sm:text-base"
                    value={productData.categoryJa}
                    readOnly
                  />
                </div>
              </div>

              {/* Cover Image */}
              <div id="field-product-cover">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "vi"
                    ? "Hình ảnh chính sản phẩm (Cover) *"
                    : "商品のメイン画像 (カバー) *"}
                </label>
                {productData.cover && (
                  <div className="mb-4 inline-block relative">
                    <Image
                      src={
                        productData.cover instanceof File
                          ? URL.createObjectURL(productData.cover)
                          : productData.cover.url
                      }
                      alt="Cover"
                      width={128}
                      height={128}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={handleCoverDeleteWithConfirm}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-md transition-colors"
                      aria-label={
                        language === "vi" ? "Xóa ảnh cover" : "カバー画像を削除"
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  id="input-edit-cover"
                  accept="image/*"
                  onChange={handleCoverChangeWithPreview}
                  ref={coverImageInputRef}
                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Gallery Images */}
              <div id="field-product-gallery">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === "vi"
                    ? `Hình ảnh chi tiết sản phẩm (Gallery) (Tối đa ${MAX_DETAIL_IMAGES} ảnh)`
                    : `商品の詳細画像 (ギャラリー) (最大${MAX_DETAIL_IMAGES}枚)`}
                </label>

                <input
                  type="file"
                  id="input-edit-gallery"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChangeWithPreview}
                  ref={detailImagesInputRef}
                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {productData.gallery.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productData.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden shadow-sm"
                      >
                        <Image
                          src={
                            image instanceof File
                              ? URL.createObjectURL(image)
                              : image.url
                          }
                          alt={`Gallery ${index + 1}`}
                          width={128}
                          height={128}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleGalleryImageDeleteWithConfirm(index)
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md"
                          aria-label={
                            language === "vi"
                              ? `Xóa ảnh gallery ${index + 1}`
                              : `ギャラリー画像 ${index + 1} を削除`
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 sm:h-4 sm:w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Variants Section */}
              <div className="border-t pt-6" id="section-product-variants">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="hasVariants-checkbox"
                    className="mr-2 h-4 w-4"
                    checked={productData.hasVariants}
                    onChange={(e) => {
                      setProductData((prev) =>
                        prev
                          ? {
                              ...prev,
                              hasVariants: e.target.checked,
                              variants: e.target.checked ? prev.variants : [],
                            }
                          : prev
                      );
                    }}
                  />
                  <label
                    htmlFor="hasVariants"
                    className="text-sm font-medium text-gray-700"
                  >
                    {language === "vi"
                      ? "Sản phẩm có biến thể"
                      : "商品にバリエーションがあります"}
                  </label>
                </div>

                {productData.hasVariants && (
                  <>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {language === "vi"
                          ? `Biến thể (${productData.variants.length})`
                          : `バリエーション (${productData.variants.length})`}
                      </h3>
                      <button
                        type="button"
                        id="btn-add-variant"
                        onClick={addVariant}
                        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm sm:text-base transition-colors"
                      >
                        {language === "vi"
                          ? "+ Thêm phiên bản"
                          : "+ バリエーションを追加"}
                      </button>
                    </div>

                    <div className="space-y-4">
                      {productData.variants.map((variant, index) => (
                        <div
                          key={variant.formId}
                          id={`variant-item-${index}`}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                              {language === "vi"
                                ? `Phiên bản ${index + 1}`
                                : `バリエーション ${index + 1}`}
                              {variant.isNew && (
                                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  {language === "vi" ? "Mới" : "新規"}
                                </span>
                              )}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeVariant(index)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              {language === "vi" ? "Xóa" : "削除"}
                            </button>
                          </div>

                          {/* Variant Size */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {language === "vi"
                                ? "Kích thước (trọng lượng) *"
                                : "サイズ (重量) *"}
                            </label>
                            <input
                              type="text"
                              id={`variant-size-${index}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder={
                                language === "vi"
                                  ? "VD: 500g, Size L, etc."
                                  : "例: 500g, Size L, など"
                              }
                              value={variant.attributes.size}
                              onChange={(e) =>
                                updateVariant(
                                  index,
                                  "attributes.size",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>

                          {/* VN Prices */}
                          <div className="space-y-4 mb-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === "vi"
                                    ? "Giá gốc (VNĐ) *"
                                    : "元値 (VNĐ) *"}
                                </label>
                                <input
                                  type="number"
                                  id={`variant-price-vi-${index}`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="50000"
                                  value={variant.originalPriceVi}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "originalPriceVi",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  {language === "vi"
                                    ? "Giảm giá (%)"
                                    : "割引 (%)"}
                                </label>
                                <input
                                  type="number"
                                  id={`variant-discount-vi-${index}`}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="0"
                                  value={variant.discountPercentVi}
                                  onChange={(e) =>
                                    updateVariant(
                                      index,
                                      "discountPercentVi",
                                      e.target.value
                                    )
                                  }
                                  min="0"
                                  max="100"
                                />
                              </div>
                            </div>
                          </div>

                          {/* JA Prices */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "vi"
                                  ? "Giá gốc (¥) *"
                                  : "元値 (¥) *"}
                              </label>
                              <input
                                type="number"
                                id={`variant-price-ja-${index}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="700"
                                value={variant.originalPriceJa}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "originalPriceJa",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === "vi" ? "割引 (%)" : "割引 (%)"}
                              </label>
                              <input
                                type="number"
                                id={`variant-discount-ja-${index}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="0"
                                value={variant.discountPercentJa}
                                onChange={(e) =>
                                  updateVariant(
                                    index,
                                    "discountPercentJa",
                                    e.target.value
                                  )
                                }
                                min="0"
                                max="100"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-between gap-3 pt-6 border-t">
                {onBack && (
                  <button
                    type="button"
                    id="btn-cancel-edit"
                    onClick={onBack}
                    className="flex-1 px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                  >
                    {language === "vi" ? "Hủy" : "キャンセル"}
                  </button>
                )}
                <button
                  type="submit"
                  id="btn-update-edit"
                  disabled={loading}
                  className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {language === "vi" ? "Đang cập nhật..." : "更新中..."}
                    </>
                  ) : language === "vi" ? (
                    "Cập nhật"
                  ) : (
                    "更新"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsEdit;
