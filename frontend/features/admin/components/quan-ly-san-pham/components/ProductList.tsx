"use client";

import React from "react";
import Image from "next/image";
import { useProductList } from "../hooks/useProductList";
import type { Product } from "../types";
import CategorySelect from "./CategorySelect";

interface ProductListProps {
  onEdit: (productCode: string) => void;
  onRefresh?: () => void;
}

const ProductList = ({ onEdit, onRefresh }: ProductListProps) => {
  const {
    products,
    loading,
    deleting,
    search,
    setSearch,
    categoryCode,
    setCategoryCode,
    isFeatured,
    setIsFeatured,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    handleDelete,
    handleToggleActive,
    handleToggleFeatured,
    handleToggleBuildPc,
    refreshProducts,
    categories,
  } = useProductList();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Helper: Get full image URL
  const getImageUrl = (url?: string) => {
    if (!url) return "/img/logow.jpeg";
    if (url.startsWith("http")) return url;
    const baseUrl =
      process.env.NEXT_PUBLIC_IMAGE_URL || "http://localhost:4000";
    return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const handleRefresh = () => {
    refreshProducts();
    onRefresh?.();
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header */}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </span>
            Quản lý sản phẩm
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Tổng số:{" "}
            <strong className="text-gray-900">{products.length}</strong> sản
            phẩm
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors border border-gray-200 text-sm font-medium"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tìm kiếm
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tên sản phẩm, thương hiệu..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <CategorySelect
              categories={categories}
              value={categoryCode}
              onChange={setCategoryCode}
            />
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lọc nổi bật
            </label>
            <select
              value={isFeatured === undefined ? "" : isFeatured.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setIsFeatured(value === "" ? undefined : value === "true");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="true">Nổi bật</option>
              <option value="false">Không nổi bật</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ảnh
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảm giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Đang tải...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.productCode} className="hover:bg-gray-50">
                    {/* Image */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(product.cover?.url)}
                          alt={product.name || "Sản phẩm"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div className="max-w-xs">
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {product.name}
                        </p>
                        {product.brand && (
                          <p className="text-sm text-gray-500 mt-1">
                            {product.brand}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Code */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {product.productCode}
                      </code>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {formatPrice(
                            product.discountedPrice || product.price
                          )}
                        </p>
                        {product.discount && product.discount > 0 && (
                          <p className="text-xs text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {product.discount && product.discount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{product.discount}%
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        {/* Active Toggle */}
                        <button
                          onClick={() =>
                            handleToggleActive(product.productCode)
                          }
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {product.isActive ? "✓ Kích hoạt" : "🚫 Đang ẩn"}
                        </button>

                        {/* Featured Toggle */}
                        <button
                          onClick={() =>
                            handleToggleFeatured(product.productCode)
                          }
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isFeatured
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {product.isFeatured ? "⭐ Nổi bật" : "☆ Thường"}
                        </button>

                        {/* Build PC Toggle */}
                        <button
                          onClick={() =>
                            handleToggleBuildPc(product.productCode)
                          }
                          className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.isBuildPc
                              ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                        >
                          {product.isBuildPc ? "🛠️ Build PC" : "🔧 Sp Thường"}
                        </button>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEdit(product.productCode)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(product.productCode)}
                          disabled={deleting === product.productCode}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa sản phẩm"
                        >
                          {deleting === product.productCode ? (
                            <span className="text-xs">...</span>
                          ) : (
                            <svg
                              className="w-5 h-5"
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
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
            Đang tải...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
            Không có sản phẩm nào
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.productCode}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="w-24 h-24 relative shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                  <img
                    src={getImageUrl(product.cover?.url)}
                    alt={product.name || "Sản phẩm"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {product.discount && product.discount > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                      -{product.discount}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                      {product.name}
                    </h3>
                  </div>

                  {product.brand && (
                    <p className="text-xs text-gray-500 mt-1">
                      {product.brand}
                    </p>
                  )}

                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="font-bold text-red-600">
                      {formatPrice(product.discountedPrice || product.price)}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  <div className="mt-1">
                    <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                      {product.productCode}
                    </code>
                  </div>
                </div>
              </div>

              {/* Status Toggles scrollable row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {/* Active Toggle */}
                <button
                  onClick={() => handleToggleActive(product.productCode)}
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    product.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      product.isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  {product.isActive ? "Kích hoạt" : "Đang ẩn"}
                </button>

                {/* Featured Toggle */}
                <button
                  onClick={() => handleToggleFeatured(product.productCode)}
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    product.isFeatured
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  <span className="text-yellow-500">
                    {product.isFeatured ? "⭐" : "☆"}
                  </span>
                  {product.isFeatured ? "Nổi bật" : "Thường"}
                </button>

                {/* Build PC Toggle */}
                <button
                  onClick={() => handleToggleBuildPc(product.productCode)}
                  className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    product.isBuildPc
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  <span className="text-purple-500">
                    {product.isBuildPc ? "🛠️" : "🔧"}
                  </span>
                  {product.isBuildPc ? "Build PC" : "Khác"}
                </button>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onEdit(product.productCode)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(product.productCode)}
                  disabled={deleting === product.productCode}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deleting === product.productCode ? (
                    <span className="text-xs">Đang xóa...</span>
                  ) : (
                    <>
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
                      Xóa
                    </>
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
            <span className="text-sm text-gray-700">Hiển thị:</span>
            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700 whitespace-nowrap">
                / {total} sp
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 w-full md:w-auto justify-center">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2 py-1 md:px-3 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              «
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-2 py-1 md:px-3 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ‹
            </button>
            <span className="px-2 py-1 md:px-3 text-sm whitespace-nowrap">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-2 py-1 md:px-3 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2 py-1 md:px-3 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
