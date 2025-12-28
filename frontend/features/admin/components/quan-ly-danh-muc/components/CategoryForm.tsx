"use client";

import React from "react";
import { useCategoryForm } from "../hooks/useCategoryForm";
import type { Category, CategoryFormProps, PriceRange } from "../types";

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
  const [showPriceRanges, setShowPriceRanges] = React.useState(false);
  const [showChildren, setShowChildren] = React.useState(false);

  // Auto-expand if has data
  React.useEffect(() => {
    if (formData.priceRanges && formData.priceRanges.length > 0) {
      setShowPriceRanges(true);
    }
    if (formData.children && formData.children.length > 0) {
      setShowChildren(true);
    }
  }, [formData.priceRanges, formData.children]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {isEdit
            ? "Cập nhật thông tin danh mục"
            : "Điền thông tin bên dưới. Chỉ cần tên là đủ, phần còn lại tùy chọn."}
        </p>

        {/* Live Preview Code */}
        {formData.name && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 font-medium mb-1">
              🔍 Xem trước mã tự động:
            </p>
            <code className="text-sm text-blue-800 font-mono">
              {formData.name
                .toUpperCase()
                .replace(/[^A-Z0-9\s]/g, "")
                .replace(/\s+/g, "-")}
              -xxxxxxxx
            </code>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
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
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
                placeholder="VD: PC Gaming, Laptop Văn Phòng, Linh kiện màn hình..."
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
              <p className="mt-1.5 text-xs text-gray-500 flex items-center">
                <svg
                  className="w-3.5 h-3.5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mã danh mục tự tạo: Tên + số định danh duy nhất (VD: "PC Gaming"
                → "PC-GAMING-a3m9x2k5")
              </p>
            </div>

            {/* IsActive */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => updateField("isActive", e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="flex-1 cursor-pointer">
                <span className="text-sm font-medium text-gray-700">
                  Hiển thị danh mục cho khách hàng
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bạn có thể tắt để tạm ẩn danh mục này
                </p>
              </label>
            </div>
          </div>
        </div>

        {/* Price Ranges - Collapsible */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={() => setShowPriceRanges(!showPriceRanges)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                2
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  💰 Phân loại theo giá
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Không bắt buộc - Click để mở rộng
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
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                      2
                    </span>
                    Khoảng giá
                  </h3>
                  <p className="text-sm text-gray-500 ml-10 mt-1">
                    Tùy chọn - Dùng để lọc sản phẩm theo giá
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addPriceRange}
                  className="px-4 py-2 text-sm font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  Thêm khoảng giá
                </button>
              </div>

              {formData.priceRanges && formData.priceRanges.length > 0 ? (
                <div className="space-y-3">
                  {formData.priceRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="text"
                        value={range.label}
                        onChange={(e) =>
                          updatePriceRange(index, "label", e.target.value)
                        }
                        placeholder="Tên khoảng giá (VD: Dưới 10 triệu)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <input
                        type="number"
                        value={range.min}
                        onChange={(e) =>
                          updatePriceRange(index, "min", Number(e.target.value))
                        }
                        placeholder="Min (VD: 0)"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
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
                        placeholder="Max (∞)"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removePriceRange(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Xóa khoảng giá"
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
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Chưa có khoảng giá. Click "Thêm khoảng giá" ở trên.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Children - Collapsible */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            type="button"
            onClick={() => setShowChildren(!showChildren)}
            className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                3
              </span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  📂 Danh mục phụ
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Không bắt buộc - Click để mở rộng
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
            <div className="px-6 pb-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                      3
                    </span>
                    Danh mục phụ
                  </h3>
                  <p className="text-sm text-gray-500 ml-10 mt-1">
                    Không bắt buộc - Tạo các danh mục nhỏ hơn bên trong danh mục
                    này (Tối đa 2 danh mục)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addChild}
                  disabled={(formData.children?.length || 0) >= 2}
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  Thêm danh mục con ({formData.children?.length || 0}/2)
                </button>
              </div>

              {errors.children && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
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
                  <span className="text-sm font-medium">{errors.children}</span>
                </div>
              )}

              {formData.children && formData.children.length > 0 ? (
                <div className="space-y-3">
                  {formData.children.map((child, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4 bg-linear-to-r from-green-50 to-blue-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm text-gray-900 flex items-center">
                          <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center mr-2 text-xs">
                            {index + 1}
                          </span>
                          Danh mục con #{index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeChild(index)}
                          className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>

                      {/* Child Name */}
                      <div className="mb-3">
                        <input
                          type="text"
                          value={child.name}
                          onChange={(e) =>
                            updateChild(index, "name", e.target.value)
                          }
                          placeholder="VD: PC Gaming Cao Cấp, Laptop Gaming..."
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-600 mt-1.5 flex items-center">
                          <svg
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Code và Slug tự động tạo từ tên
                        </p>
                      </div>

                      {/* Nested Children (Level 2+) */}
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-gray-700">
                            📂 Danh mục con (Không giới hạn số lượng)
                          </p>
                          <button
                            type="button"
                            onClick={() => addChildToChild(index)}
                            className="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                          >
                            + Thêm cấp 2
                          </button>
                        </div>

                        {child.children && child.children.length > 0 ? (
                          <div className="space-y-2 mt-2">
                            {child.children.map((nestedChild, nestedIndex) => (
                              <div
                                key={nestedIndex}
                                className="flex gap-2 items-center bg-white p-2 rounded border border-indigo-200"
                              >
                                <span className="text-xs text-gray-500 font-medium">
                                  {nestedIndex + 1}.
                                </span>
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
                                  placeholder="VD: PC Gaming RGB, PC Gaming Silent..."
                                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeChildFromChild(index, nestedIndex)
                                  }
                                  className="text-red-600 hover:bg-red-50 px-2 py-1 rounded text-xs"
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic mt-1">
                            Chưa có danh mục cấp 2
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <svg
                    className="w-12 h-12 mx-auto text-gray-400 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-sm text-gray-500">
                    Chưa có danh mục con. Click "Thêm danh mục con" để tạo cấu
                    trúc phân cấp.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shadow-sm"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Đang xử lý...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {isEdit ? "Cập nhật danh mục" : "Tạo danh mục"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
