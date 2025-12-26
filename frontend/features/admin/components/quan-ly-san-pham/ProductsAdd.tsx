"use client";

import { useRef, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuillWrapper from "./quill-wrapper";
import "quill/dist/quill.snow.css";
import Image from "next/image";
import { useAddProduct } from "./hooks/addProductHooks";
import type Quill from "quill";

const ProductsAdd = () => {
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
    handleSubmit,
    resetForm,
    handleDescriptionViChange,
    handleDescriptionJaChange,
  } = useAddProduct();

  const [currentLang, setCurrentLang] = useState<"vi" | "ja">("vi");
  const quillViRef = useRef<Quill | null>(null);
  const quillJaRef = useRef<Quill | null>(null);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "video"],
        ["clean"],
      ],
    }),
    []
  );

  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
      "video",
    ],
    []
  );

  const toggleLanguage = () => {
    setCurrentLang(currentLang === "vi" ? "ja" : "vi");
  };

  return (
    <div className="min-h-screen bg-white" id="product-add-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header cố định */}
      <div className=" z-50 bg-white border-b shadow-sm">
        <div className="px-4 py-3 container mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              {currentLang === "vi" ? "Thêm sản phẩm mới" : "新商品追加"}
            </h1>
            <button
              id="btn-language-toggle"
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {currentLang === "vi" ? "日本語" : "Tiếng Việt"}
            </button>
          </div>
        </div>
      </div>

      <div className="  container  mx-auto border border-gray-300 rounded-lg overflow-hidden">
        {productData.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {productData.error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            
            {/* Tên sản phẩm */}
            <div className="p-4 sm:p-6 space-y-4" id="section-basic-info">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" id="header-basic-info">
                {currentLang === "vi" ? "Thông tin cơ bản" : "基本情報"}
              </h2>
              
              <div id="group-name-vi">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Tên sản phẩm (VN) *" : "商品名 (VN) *"}
                </label>
                <input
                  id="input-name-vi"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder={currentLang === "vi" ? "Nhập tên sản phẩm" : "商品名を入力"}
                  value={productData.nameVi}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, nameVi: e.target.value }))
                  }
                  required
                />
              </div>

              <div id="group-name-ja">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Tên sản phẩm (JA) *" : "商品名 (JA) *"}
                </label>
                <input
                  id="input-name-ja"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  placeholder={currentLang === "vi" ? "Nhập tên tiếng Nhật" : "日本語名を入力"}
                  value={productData.nameJa}
                  onChange={(e) =>
                    setProductData((prev) => ({ ...prev, nameJa: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            {/* Mô tả sản phẩm */}
            <div className="p-4 sm:p-6 space-y-4" id="section-description">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" id="header-description">
                {currentLang === "vi" ? "Mô tả sản phẩm" : "商品説明"}
              </h2>
              
              <div id="group-desc-vi">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Mô tả (VN)" : "説明 (VN)"}
                </label>
                <div id="editor-desc-vi">
                  <QuillWrapper
                    ref={quillViRef}
                    value={productData.description.vi || ""}
                    onChange={handleDescriptionViChange}
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </div>
              </div>

              <div id="group-desc-ja">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Mô tả (JA)" : "説明 (JA)"}
                </label>
                <div id="editor-desc-ja">
                  <QuillWrapper
                    ref={quillJaRef}
                    value={productData.description.ja || ""}
                    onChange={handleDescriptionJaChange}
                    modules={quillModules}
                    formats={quillFormats}   

                  />
                </div>
              </div>
            </div>

            {/* Danh mục */}
            <div className="p-4 sm:p-6 space-y-4" id="section-category">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" id="header-category">
                {currentLang === "vi" ? "Danh mục" : "カテゴリ"}
              </h2>
              
              <div id="group-category-vi">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Danh mục (VN) *" : "カテゴリ (VN) *"}
                </label>
                <select
                  id="select-category-vi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  value={productData.categoryVi}
                  onChange={handleCategoryViChange}
                  required
                >
                  <option value="">{currentLang === "vi" ? "Chọn danh mục" : "選択してください"}</option>
                  <option value="banh-trang">Bánh tráng</option>
                  <option value="cac-loai-kho">Các loại khô</option>
                  <option value="do-an-vat">Đồ ăn vặt</option>
                  <option value="trai-cay">Trái cây</option>
                </select>
              </div>

              <div id="group-category-ja">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Danh mục (JA)" : "カテゴリ (JA)"}
                </label>
                <input
                  id="input-category-ja"
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm sm:text-base"
                  value={productData.categoryJa}
                  readOnly
                />
              </div>
            </div>

            {/* Giá cả */}
            <div className="p-4 sm:p-6" id="section-price">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" id="header-price">
                {currentLang === "vi" ? "Giá sản phẩm" : "価格"}
              </h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {currentLang === "vi" ? "Giá VNĐ" : "VNĐ価格"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {currentLang === "vi" ? "Tối thiểu" : "最小"}
                      </label>
                      <input
                        id="input-price-vi-min"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="50000"
                        value={productData.minPriceVi}
                        onChange={(e) =>
                          setProductData((prev) => ({ ...prev, minPriceVi: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {currentLang === "vi" ? "Tối đa" : "最大"}
                      </label>
                      <input
                        id="input-price-vi-max"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="100000"
                        value={productData.maxPriceVi}
                        onChange={(e) =>
                          setProductData((prev) => ({ ...prev, maxPriceVi: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {currentLang === "vi" ? "Giá Yên (¥)" : "円価格 (¥)"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {currentLang === "vi" ? "Tối thiểu" : "最小"}
                      </label>
                      <input
                        id="input-price-ja-min"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="700"
                        value={productData.minPriceJa}
                        onChange={(e) =>
                          setProductData((prev) => ({ ...prev, minPriceJa: e.target.value }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {currentLang === "vi" ? "Tối đa" : "最大"}
                      </label>
                      <input
                        id="input-price-ja-max"
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="1400"
                        value={productData.maxPriceJa}
                        onChange={(e) =>
                          setProductData((prev) => ({ ...prev, maxPriceJa: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hình ảnh */}
            <div className="p-4 sm:p-6 space-y-4" id="section-image">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4" id="header-image">
                {currentLang === "vi" ? "Hình ảnh sản phẩm" : "商品画像"}
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" ? "Ảnh bìa *" : "カバー画像 *"}
                </label>
                <input
                  id="input-image-cover"
                  type="file"
                  accept="image/*"
                  ref={coverImageInputRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleCoverChange}
                />
                {productData.cover && (
                  <div className="relative mt-3 w-full aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(productData.cover)}
                      alt="Cover"
                      fill
                      className="object-cover"
                      unoptimized
                      sizes="100vw"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700 shadow-lg"
                      onClick={handleCoverDelete}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {currentLang === "vi" 
                    ? `Ảnh chi tiết (${productData.gallery.length}/${MAX_DETAIL_IMAGES})`
                    : `詳細画像 (${productData.gallery.length}/${MAX_DETAIL_IMAGES})`
                  }
                </label>
                <input
                  id="input-image-gallery"
                  type="file"
                  accept="image/*"
                  multiple
                  ref={detailImagesInputRef}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleGalleryChange}
                />
                {productData.gallery.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {productData.gallery.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover"
                            unoptimized
                            sizes="(max-width: 640px) 50vw, 33vw"
                          />
                        </div>
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-lg"
                          onClick={() => handleGalleryImageDelete(index)}
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Biến thể */}
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="checkbox-has-variants"
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={productData.hasVariants}
                    onChange={(e) => {
                      setProductData((prev) => ({
                        ...prev,
                        hasVariants: e.target.checked,
                        variants: e.target.checked ? prev.variants : [],
                      }));
                    }}
                  />
                  <label htmlFor="checkbox-has-variants" className="text-sm font-medium text-gray-700">
                    {currentLang === "vi" ? "Sản phẩm có biến thể" : "バリエーションあり"}
                  </label>
                </div>
                {productData.hasVariants && (
                  <button
                    type="button"
                    id="btn-add-variant"
                    onClick={addVariant}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                  >
                    + {currentLang === "vi" ? "Thêm" : "追加"}
                  </button>
                )}
              </div>

              {productData.hasVariants && productData.variants.length > 0 && (
                <div className="space-y-3">
                  {productData.variants.map((variant, index) => (
                    <div key={variant.variantId} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {currentLang === "vi" ? `Phiên bản ${index + 1}` : `バリエーション ${index + 1}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          {currentLang === "vi" ? "Xóa" : "削除"}
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {currentLang === "vi" ? "Kích thước" : "サイズ"}
                          </label>
                          <input
                            id={`variant-size-${index}`}
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="500g"
                            value={variant.attributes.size}
                            onChange={(e) => updateVariant(index, "attributes.size", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {currentLang === "vi" ? "Giá (VNĐ)" : "価格 (VNĐ)"}
                            </label>
                            <input
                              id={`variant-price-vi-${index}`}
                              type="number"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="50000"
                              value={variant.originalPriceVi}
                              onChange={(e) => updateVariant(index, "originalPriceVi", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {currentLang === "vi" ? "Giảm (%)" : "割引 (%)"}
                            </label>
                            <input
                              id={`variant-discount-vi-${index}`}
                              type="number"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="0"
                              value={variant.discountPercentVi}
                              onChange={(e) => updateVariant(index, "discountPercentVi", e.target.value)}
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {currentLang === "vi" ? "Giá (¥)" : "価格 (¥)"}
                            </label>
                            <input
                              id={`variant-price-ja-${index}`}
                              type="number"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="700"
                              value={variant.originalPriceJa}
                              onChange={(e) => updateVariant(index, "originalPriceJa", e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {currentLang === "vi" ? "Giảm (%)" : "割引 (%)"}
                            </label>
                            <input
                              id={`variant-discount-ja-${index}`}
                              type="number"
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="0"
                              value={variant.discountPercentJa}
                              onChange={(e) => updateVariant(index, "discountPercentJa", e.target.value)}
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
                   {/* Nút hành động - cố định ở dưới */}
            <div className=" bottom-0 bg-white border-t p-4 sm:p-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  id="btn-cancel-add"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm sm:text-base transition-colors"
                  onClick={resetForm}
                >
                  {currentLang === "vi" ? "Hủy" : "キャンセル"}
                </button>
                <button
                  type="button"
                  id="btn-save-add"
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm sm:text-base transition-colors"
                >
                  {currentLang === "vi" ? "Lưu sản phẩm" : "保存"}
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsAdd;