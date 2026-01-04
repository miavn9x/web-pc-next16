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

  // Helper: Get full image URL
  const getImageUrl = (url?: string) => {
    if (!url) return "/img/logow.jpeg";
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="max-w-full p-4 mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => onSuccess?.()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <svg
              className="w-6 h-6"
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
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa sản phẩm" : "Tạo sản phẩm mới"}
          </h2>
        </div>
        <p className="text-gray-500 ml-10">
          Điền thông tin bên dưới. Các trường có dấu{" "}
          <span className="text-red-500">*</span> là bắt buộc.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-semibold text-gray-900">Thông tin cơ bản</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-base ${
                  errors.name
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="VD: PC Gaming Ultra Instinct (i9-13900K / RTX 4090 / 64GB RAM)"
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level 1 */}
                <select
                  value={selectedL1}
                  onChange={(e) => handleL1Change(e.target.value)}
                  disabled={loadingCategories}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm bg-white cursor-pointer hover:border-blue-400"
                >
                  <option value="">-- Danh mục chính --</option>
                  {categoryTree.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Level 2 */}
                <select
                  value={selectedL2}
                  onChange={(e) => handleL2Change(e.target.value)}
                  disabled={!selectedL1 || getL2Options().length === 0}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm cursor-pointer ${
                    !selectedL1 || getL2Options().length === 0
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <option value="">-- Danh mục phụ cấp 1 --</option>
                  {getL2Options().map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {/* Level 3 */}
                <select
                  value={selectedL3}
                  onChange={(e) => handleL3Change(e.target.value)}
                  disabled={!selectedL2 || getL3Options().length === 0}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm cursor-pointer ${
                    !selectedL2 || getL3Options().length === 0
                      ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      : "bg-white border-gray-200 hover:border-blue-400"
                  }`}
                >
                  <option value="">-- Danh mục phụ câp 2 --</option>
                  {getL3Options().map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {errors.categoryCode && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {errors.categoryCode}
                </p>
              )}
            </div>

            {/* Brand & Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm cursor-pointer ${
                    !selectedL1
                      ? "bg-gray-50 text-gray-400 border-gray-200"
                      : "bg-white border-gray-200 hover:border-blue-400"
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
                  <p className="mt-1.5 text-xs text-amber-600">
                    * Vui lòng chọn danh mục chính trước
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thương hiệu
                </label>
                <input
                  type="text"
                  value={formData.brand || ""}
                  onChange={(e) => updateField("brand", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-blue-400"
                  placeholder="VD: ASUS, MSI, Custom Build..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Price & Discount */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-semibold text-gray-900">Giá & Khuyến mãi</h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Original Price (Giá Gốc) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá gốc
              </label>
              <input
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) => {
                  const newOriginal = Number(e.target.value);
                  updateField("originalPrice", newOriginal);

                  if (formData.discount && formData.discount > 0) {
                    const newPrice = calculatePrice(
                      newOriginal,
                      formData.discount
                    );
                    updateField("price", newPrice);
                  } else {
                    updateField("price", newOriginal);
                  }
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${
                  errors.originalPrice
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                placeholder="VD: 95000000"
              />
              {errors.originalPrice && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.originalPrice}
                </p>
              )}
            </div>

            {/* 2. Discount (% Giảm giá) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    if (newDiscount > 100) newDiscount = 100;
                    if (newDiscount < 0) newDiscount = 0;

                    updateField(
                      "discount",
                      newDiscount === 0 && e.target.value === ""
                        ? undefined
                        : newDiscount
                    );

                    if (formData.originalPrice) {
                      const newPrice = calculatePrice(
                        formData.originalPrice,
                        newDiscount
                      );
                      updateField("price", newPrice);
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:border-gray-300 pr-12"
                  placeholder="0"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">%</span>
                </div>
              </div>
            </div>

            {/* 3. Price (Giá sau giảm) */}
            <div>
              <label className="block text-sm font-bold text-red-600 mb-2">
                Giá sau giảm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    updateField("price", newPrice);

                    if (formData.originalPrice && formData.originalPrice > 0) {
                      const newDiscount = calculateDiscount(
                        formData.originalPrice,
                        newPrice
                      );
                      updateField("discount", newDiscount);
                    } else {
                      updateField("originalPrice", newPrice);
                      updateField("discount", 0);
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-bold text-red-600 pr-16 ${
                    errors.price
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  placeholder="VD: 85000000"
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">vnđ</span>
                </div>
              </div>
              {errors.price && (
                <p className="mt-1.5 text-sm text-red-600">{errors.price}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Media */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-semibold text-gray-900">Hình ảnh</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Ảnh đại diện
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                {formData.cover ? (
                  <div className="relative w-full sm:w-56 aspect-4/3 rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm group">
                    <img
                      src={getImageUrl(formData.cover.url)}
                      alt="Cover"
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={handleCoverDelete}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-lg"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Ảnh đại diện
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full sm:w-56 aspect-4/3 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 group"
                  >
                    <div className="p-4 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                      <svg
                        className="w-8 h-8 text-blue-500"
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
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      Click để upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</p>
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Thư viện ảnh
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {formData.gallery.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm group"
                  >
                    <img
                      src={getImageUrl(item.url)}
                      alt={`Gallery ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={() => handleGalleryDelete(item.mediaCode)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700 shadow-lg"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <div
                  onClick={() => galleryInputRef.current?.click()}
                  className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all bg-gray-50 group"
                >
                  <div className="p-2 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                    <svg
                      className="w-6 h-6 text-gray-400 group-hover:text-blue-500"
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
                  </div>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-blue-600">
                    Thêm ảnh con
                  </p>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                💡 Mẹo: Có thể chọn nhiều ảnh cùng lúc
              </p>
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
        </div>

        {/* Section 4: Specs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="font-semibold text-gray-900">Thông số kỹ thuật</h3>
          </div>
          <div className="p-6">
            <SpecsEditor specs={formData.specs} onChange={handleSpecsChange} />
          </div>
        </div>

        {/* Section 5: Description & Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <h3 className="font-semibold text-gray-900">Bài viết & Mô tả</h3>
          </div>

          <div className="p-6 space-y-6">
            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả ngắn (SEO)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all shadow-sm hover:border-gray-300"
                placeholder="Mô tả tóm tắt sản phẩm hiển thị trên Google và danh sách..."
              />
            </div>

            {/* Content (HTML) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung chi tiết
                </label>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md font-medium">
                  Hỗ trợ HTML cơ bản
                </span>
              </div>

              <textarea
                value={formData.content || ""}
                onChange={(e) => updateField("content", e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm transition-all shadow-sm hover:border-gray-300"
                placeholder="Nhập nội dung bài viết..."
              />
            </div>
          </div>
        </div>

        {/* Section 6: Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              6
            </div>
            <h3 className="font-semibold text-gray-900">Cài đặt hiển thị</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <label className="flex items-center p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-blue-200">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    Kích hoạt sản phẩm
                  </span>
                  <span className="block text-xs text-gray-500">
                    Hiển thị sản phẩm này trên web
                  </span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-blue-200">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    Đánh dấu nổi bật
                  </span>
                  <span className="block text-xs text-gray-500">
                    Gắn nhãn HOT & đưa lên đầu
                  </span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-blue-200">
                <input
                  type="checkbox"
                  checked={formData.isBuildPc || false}
                  onChange={(e) => updateField("isBuildPc", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    Linh kiện Build PC
                  </span>
                  <span className="block text-xs text-gray-500">
                    Chỉ dùng trong menu Build PC
                  </span>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all hover:border-blue-200">
                <input
                  type="checkbox"
                  checked={formData.isNewArrival || false}
                  onChange={(e) =>
                    updateField("isNewArrival", e.target.checked)
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">
                    Hàng mới về (New Arrival)
                  </span>
                  <span className="block text-xs text-gray-500">
                    Hiển thị badge NEW ARRIVAL
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Floating Footer Actions */}
        <div className="sticky bottom-4 z-10 mx-auto max-w-5xl">
          <div className="bg-white/90 backdrop-blur shadow-lg border border-gray-200 p-4 rounded-2xl flex items-center justify-between">
            <button
              type="button"
              onClick={() => onSuccess?.()}
              className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Hủy bỏ
            </button>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none transform active:scale-95"
              >
                {submitting
                  ? "Đang lưu..."
                  : isEdit
                  ? "Cập nhật sản phẩm"
                  : "Tạo sản phẩm mới"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
