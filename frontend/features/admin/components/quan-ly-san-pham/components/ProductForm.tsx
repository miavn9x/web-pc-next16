"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useProductForm } from "../hooks/useProductForm";
import SpecsEditor from "./SpecsEditor";
import type { Product } from "../types";

interface ProductFormProps {
  initialData?: Product | null;
  onSuccess?: () => void;
}

interface Category {
  code: string;
  name: string;
  slug?: string;
  priceRanges?: Array<{
    label: string;
    min: number;
    max: number | null;
  }>;
  children?: Category[];
}

const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const {
    formData,
    errors,
    submitting,
    isEdit,
    updateField,
    handleSubmit,
    handleCoverUpload,
    handleCoverDelete,
    handleGalleryUpload,
    handleGalleryDelete,
    handleSpecsChange,
  } = useProductForm({ initialData, onSuccess });

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Categories state
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Selection state
  const [selectedL1, setSelectedL1] = useState<string>("");
  const [selectedL2, setSelectedL2] = useState<string>("");
  const [selectedL3, setSelectedL3] = useState<string>("");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/categories/tree`,
          {
            credentials: "include",
          }
        );
        const result = await response.json();
        const tree = result.data || [];
        setCategoryTree(tree);

        // If editing, find path and set selection
        if (initialData?.categoryCode) {
          const path = findCategoryPath(tree, initialData.categoryCode);
          if (path) {
            if (path[0]) setSelectedL1(path[0]);
            if (path[1]) setSelectedL2(path[1]);
            if (path[2]) setSelectedL3(path[2]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [initialData?.categoryCode]); // Only re-run if initialData changes (e.g. fresh edit)

  // Helper: Find path to category code [l1, l2, l3]
  const findCategoryPath = (
    nodes: Category[],
    targetCode: string
  ): string[] | null => {
    for (const node of nodes) {
      if (node.code === targetCode) {
        return [node.code];
      }
      if (node.children) {
        const path = findCategoryPath(node.children, targetCode);
        if (path) {
          return [node.code, ...path];
        }
      }
    }
    return null;
  };

  // Get options for Level 2 based on Level 1
  const getL2Options = () => {
    const l1 = categoryTree.find((c) => c.code === selectedL1);
    return l1?.children || [];
  };

  // Get options for Level 3 based on Level 2
  const getL3Options = () => {
    const l2 = getL2Options().find((c) => c.code === selectedL2);
    return l2?.children || [];
  };

  // Handlers
  const handleL1Change = (code: string) => {
    setSelectedL1(code);
    setSelectedL2("");
    setSelectedL3("");
    updateField("categoryCode", code); // Default to L1 if no deeper selection
  };

  const handleL2Change = (code: string) => {
    setSelectedL2(code);
    setSelectedL3("");
    updateField("categoryCode", code); // Default to L2 if no deeper selection
  };

  const handleL3Change = (code: string) => {
    setSelectedL3(code);
    updateField("categoryCode", code);
  };

  // Helper: Calculate Price based on Original Price and Discount
  const calculatePrice = (original: number, discount: number) => {
    if (!original) return 0;
    return Math.round(original * (1 - discount / 100));
  };

  // Helper: Calculate Discount based on Original Price and Price
  const calculateDiscount = (original: number, price: number) => {
    if (!original || original === 0) return 0;
    if (price > original) return 0;
    return Number((((original - price) / original) * 100).toFixed(1));
  };

  // Handle discounted price change (Reverse calculation) - Keep for compatibility or remove if unused in new logic
  // keeping it just in case, but the new logic uses calculateDiscount inline.
  const discountedPrice = formData.price; // Just binding directly now

  // Helper: Get full image URL
  const getImageUrl = (url?: string) => {
    if (!url) return "/img/logow.jpeg";
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Cập nhật thông tin sản phẩm"
            : "Điền thông tin bên dưới. Các trường có dấu * là bắt buộc."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
              1
            </span>
            Thông tin cơ bản
          </h3>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="VD: PC Gaming Ultra Instinct (i9-13900K / RTX 4090 / 64GB RAM)"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Category 3-Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Danh mục <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level 1 */}
                <div>
                  <select
                    value={selectedL1}
                    onChange={(e) => handleL1Change(e.target.value)}
                    disabled={loadingCategories}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.categoryCode && !selectedL1
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Danh mục chính --</option>
                    {categoryTree.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level 2 */}
                <div>
                  <select
                    value={selectedL2}
                    onChange={(e) => handleL2Change(e.target.value)}
                    disabled={!selectedL1 || getL2Options().length === 0}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.categoryCode &&
                      selectedL1 &&
                      !selectedL2 &&
                      getL2Options().length > 0
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } ${
                      !selectedL1 || getL2Options().length === 0
                        ? "bg-gray-100 text-gray-400"
                        : ""
                    }`}
                  >
                    <option value="">-- Danh mục con --</option>
                    {getL2Options().map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Level 3 */}
                <div>
                  <select
                    value={selectedL3}
                    onChange={(e) => handleL3Change(e.target.value)}
                    disabled={!selectedL2 || getL3Options().length === 0}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      !selectedL2 || getL3Options().length === 0
                        ? "bg-gray-100 text-gray-400"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Danh mục cháu --</option>
                    {getL3Options().map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errors.categoryCode && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.categoryCode}
                </p>
              )}
              {loadingCategories && (
                <p className="mt-1.5 text-xs text-blue-500">
                  Đang tải danh mục...
                </p>
              )}
            </div>

            {/* Brand & Price Range Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price Range (Derived from Root Category) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Khoảng giá (Theo danh mục)
                </label>
                <select
                  value={formData.filters?.priceRange || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const currentFilters = formData.filters || {};
                    updateField("filters", {
                      ...currentFilters,
                      priceRange: val,
                    });
                  }}
                  disabled={!selectedL1}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    !selectedL1
                      ? "bg-gray-100 text-gray-400"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">-- Chọn khoảng giá --</option>
                  {(() => {
                    const rootCat = categoryTree.find(
                      (c) => c.code === selectedL1
                    );
                    return rootCat?.priceRanges?.map((range, idx) => (
                      <option key={idx} value={JSON.stringify(range)}>
                        {range.label}
                      </option>
                    ));
                  })()}
                </select>
                {!selectedL1 && (
                  <p className="mt-1 text-xs text-orange-500">
                    * Vui lòng chọn danh mục chính trước
                  </p>
                )}
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  value={formData.brand || ""}
                  onChange={(e) => updateField("brand", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: ASUS, MSI, Custom Build..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Price & Discount */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
              2
            </span>
            Giá & Khuyến mãi
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Original Price (Giá Gốc) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Giá gốc
              </label>
              <input
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) => {
                  const newOriginal = Number(e.target.value);
                  updateField("originalPrice", newOriginal);

                  // Update Price based on new Original and current Discount
                  if (formData.discount && formData.discount > 0) {
                    const newPrice = calculatePrice(
                      newOriginal,
                      formData.discount
                    );
                    updateField("price", newPrice);
                  } else {
                    // No discount, price = original
                    updateField("price", newOriginal);
                  }
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.originalPrice
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="VD: 95,000,000"
              />
              {errors.originalPrice && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.originalPrice}
                </p>
              )}
            </div>

            {/* 2. Discount (% Giảm giá) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                % Giảm giá
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discount || ""}
                  onChange={(e) => {
                    let newDiscount = Number(e.target.value);

                    // Enforce max 100
                    if (newDiscount > 100) newDiscount = 100;
                    if (newDiscount < 0) newDiscount = 0;

                    updateField(
                      "discount",
                      newDiscount === 0 && e.target.value === ""
                        ? undefined
                        : newDiscount
                    );

                    // Update Price based on Original and new Discount
                    if (formData.originalPrice) {
                      const newPrice = calculatePrice(
                        formData.originalPrice,
                        newDiscount
                      );
                      updateField("price", newPrice);
                    }
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.discount
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            {/* 3. Price (Giá sau giảm) */}
            <div>
              <label className="block text-sm text-red-600 mb-1.5 font-bold">
                Giá sau giảm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    updateField("price", newPrice);

                    // Update Discount based on Original and new Price
                    if (formData.originalPrice && formData.originalPrice > 0) {
                      const newDiscount = calculateDiscount(
                        formData.originalPrice,
                        newPrice
                      );
                      updateField("discount", newDiscount);
                    } else {
                      // If no original price, set original = price
                      updateField("originalPrice", newPrice);
                      updateField("discount", 0);
                    }
                  }}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors font-semibold text-red-600 ${
                    errors.price
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="VD: 85,000,000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">vnđ</span>
                </div>
              </div>
              {errors.price && (
                <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Media */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
              3
            </span>
            Hình ảnh
          </h3>

          {/* Cover Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh đại diện
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              {formData.cover ? (
                <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={getImageUrl(formData.cover.url)}
                    alt="Cover"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleCoverDelete}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full sm:w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Click để upload</p>
                </div>
              )}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleCoverUpload(file);
                }}
                className="hidden"
              />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thư viện ảnh
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {formData.gallery.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                >
                  <img
                    src={getImageUrl(item.url)}
                    alt={`Gallery ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleGalleryDelete(item.mediaCode)}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <div
                onClick={() => galleryInputRef.current?.click()}
                className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p className="mt-1 text-xs text-gray-500">Thêm ảnh</p>
              </div>
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) handleGalleryUpload(files);
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* Section 4: Specs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
              4
            </span>
            Thông số kỹ thuật
          </h3>
          <SpecsEditor specs={formData.specs} onChange={handleSpecsChange} />
        </div>

        {/* Section 5: Description & Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
              5
            </span>
            Bài viết & Mô tả
          </h3>

          <div className="space-y-6">
            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mô tả ngắn (Description)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Mô tả tóm tắt cho SEO và thẻ danh sách..."
              />
            </div>

            {/* Content (HTML) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nội dung chi tiết (Content)
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                rows={10}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Nhập nội dung đầy đủ của bài viết... (Hỗ trợ HTML)"
              />
              <p className="mt-2 text-xs text-gray-500">
                💡 Hỗ trợ HTML. Ví dụ: &lt;h1&gt;, &lt;p&gt;, &lt;ul&gt;,
                &lt;li&gt;, &lt;strong&gt;...
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
              6
            </span>
            Cài đặt
          </h3>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                ✓ Kích hoạt sản phẩm
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                ⭐ Đánh dấu nổi bật
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBuildPc || false}
                onChange={(e) => updateField("isBuildPc", e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-gray-700">
                🛠️ Chỉ dùng cho Build PC
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => onSuccess?.()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? "Đang lưu..."
              : isEdit
              ? "Cập nhật sản phẩm"
              : "Tạo sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
