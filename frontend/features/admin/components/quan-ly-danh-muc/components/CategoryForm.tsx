"use client";

import React, { useState, useEffect } from "react";
import { useCategoryForm } from "../hooks/useCategoryForm";
import type { CategoryFormProps } from "../types";

const CategoryForm = ({ initialData, onSuccess }: CategoryFormProps) => {
  const {
    formData,
    errors,
    submitting,
    isEdit,
    updateField,
    handleSubmit,
    addPriceRange,
    removePriceRange,
    updatePriceRange,
    addChild,
    removeChild,
    updateChild,
    addChildToChild,
    removeChildFromChild,
    updateNestedChild,
  } = useCategoryForm({ initialData, onSuccess });

  // Collapsible sections state
  const [showPriceRanges, setShowPriceRanges] = useState(false);
  const [showChildren, setShowChildren] = useState(false);

  // Auto-expand if has data
  useEffect(() => {
    if (formData.priceRanges && formData.priceRanges.length > 0) {
      setShowPriceRanges(true);
    }
    if (formData.children && formData.children.length > 0) {
      setShowChildren(true);
    }
  }, [formData.priceRanges, formData.children]);

  return (
    <div className="container p-4 mx-auto space-y-6 pb-20">
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
            {isEdit ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
          </h2>
        </div>
        <p className="text-gray-500 ml-10">
          Điền thông tin bên dưới. Các trường có dấu{" "}
          <span className="text-red-500">*</span> là bắt buộc.
        </p>


      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Information */}
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
                Tên danh mục <span className="text-red-500">*</span>
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
                placeholder="VD: PC Gaming, Laptop Văn Phòng..."
              />
              {errors.name && (
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
                  {errors.name}
                </p>
              )}
            </div>

            {/* IsActive */}
            <div className="p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Hiển thị danh mục này
                  </span>
                  <span className="block text-xs text-gray-500">
                    Nếu tắt, khách hàng sẽ không thấy danh mục này trên web
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Price Ranges - Collapsible */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPriceRanges(!showPriceRanges)}
            className="w-full p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">
                  Phân loại khoảng giá
                </h3>
                <p className="text-xs text-gray-500">
                  Tùy chọn - Dùng để lọc sản phẩm theo giá
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showPriceRanges ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showPriceRanges && (
            <div className="p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
              {formData.priceRanges && formData.priceRanges.length > 0 ? (
                <div className="space-y-3">
                  {formData.priceRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row gap-3 items-start p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Tên hiển thị
                        </label>
                        <input
                          type="text"
                          value={range.label}
                          onChange={(e) =>
                            updatePriceRange(index, "label", e.target.value)
                          }
                          placeholder="VD: Dưới 10 triệu"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Từ (Min)
                        </label>
                        <input
                          type="number"
                          value={range.min}
                          onChange={(e) =>
                            updatePriceRange(
                              index,
                              "min",
                              Number(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Đến (Max)
                        </label>
                        <input
                          type="number"
                          value={range.max || ""}
                          onChange={(e) =>
                            updatePriceRange(
                              index,
                              "max",
                              e.target.value ? Number(e.target.value) : null
                            )
                          }
                          placeholder="∞"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div className="w-full md:w-auto flex justify-end md:block mt-1 md:mt-6">
                        <button
                          type="button"
                          onClick={() => removePriceRange(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa khoảng giá này"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">
                    Chưa có khoảng giá nào
                  </p>
                  <button
                    type="button"
                    onClick={addPriceRange}
                    className="text-purple-600 font-medium hover:underline text-sm"
                  >
                    + Thêm khoảng giá đầu tiên
                  </button>
                </div>
              )}

              {formData.priceRanges && formData.priceRanges.length > 0 && (
                <button
                  type="button"
                  onClick={addPriceRange}
                  className="w-full py-3 border-2 border-dashed border-purple-200 text-purple-600 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
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
                  Thêm khoảng giá khác
                </button>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Children - Collapsible */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowChildren(!showChildren)}
            className="w-full p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Danh mục phụ</h3>
                <p className="text-xs text-gray-500">
                  Tùy chọn - Tạo các danh mục con bên trong
                </p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                showChildren ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showChildren && (
            <div className="p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">
                  Bạn có thể tạo tối đa 2 cấp danh mục con tại đây.
                </p>
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-600">
                  {formData.children?.length || 0}/2 danh mục chính
                </span>
              </div>

              {errors.children && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.children}
                </div>
              )}

              {formData.children && formData.children.length > 0 ? (
                <div className="space-y-4">
                  {formData.children.map((child, index) => (
                    <div
                      key={index}
                      className="border border-green-200 rounded-xl p-4 bg-green-50/30"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-gray-900 text-sm">
                            Danh mục cấp 2
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeChild(index)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium uppercase hover:underline"
                        >
                          Xóa
                        </button>
                      </div>

                      {/* Child Name */}
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) =>
                          updateChild(index, "name", e.target.value)
                        }
                        placeholder="VD: PC Gaming Cao Cấp, Laptop Gaming..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                      />

                      {/* Nested Children (Level 3) */}
                      <div className="mt-4 pl-4 border-l-2 border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Danh mục cấp 3
                          </p>
                          <button
                            type="button"
                            onClick={() => addChildToChild(index)}
                            className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center gap-1 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                          >
                            + Thêm cấp 3
                          </button>
                        </div>

                        <div className="space-y-2">
                          {child.children && child.children.length > 0 ? (
                            child.children.map((nestedChild, nestedIndex) => (
                              <div
                                key={nestedIndex}
                                className="flex gap-2 items-center"
                              >
                                <div className="w-2 h-2 rounded-full bg-indigo-300"></div>
                                <input
                                  type="text"
                                  value={nestedChild.name}
                                  onChange={(e) =>
                                    updateNestedChild(
                                      index,
                                      nestedIndex,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  placeholder="VD: PC Gaming RGB..."
                                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeChildFromChild(index, nestedIndex)
                                  }
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  ×
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-400 italic">
                              Chưa có danh mục cấp 3
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <p className="text-sm text-gray-500 mb-3">
                    Chưa có danh mục con nào
                  </p>
                  <button
                    type="button"
                    onClick={addChild}
                    disabled={(formData.children?.length || 0) >= 2}
                    className="text-green-600 font-medium hover:underline text-sm disabled:opacity-50 disabled:no-underline"
                  >
                    + Thêm danh mục con cấp 2
                  </button>
                </div>
              )}

              {formData.children &&
                formData.children.length > 0 &&
                (formData.children?.length || 0) < 2 && (
                  <button
                    type="button"
                    onClick={addChild}
                    className="w-full py-3 border-2 border-dashed border-green-200 text-green-600 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
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
                    Thêm danh mục cấp 2 khác
                  </button>
                )}
            </div>
          )}
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
                className="px-8 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none transform active:scale-95 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>{isEdit ? "Cập nhật danh mục" : "Tạo danh mục"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
