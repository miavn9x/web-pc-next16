"use client";

import React from "react";
import Image from "next/image";
import { useProductList } from "../hooks/useProductList";
import type { Product } from "../types";

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
    isBuildPc,
    setIsBuildPc,
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          🔄 Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Category Filter - TODO: Fetch categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Danh mục
            </label>
            <select
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả danh mục</option>
              {/* TODO: Map categories here */}
            </select>
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

          {/* Type Filter (Build PC) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại sản phẩm
            </label>
            <select
              value={isBuildPc === undefined ? "" : isBuildPc.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setIsBuildPc(value === "" ? undefined : value === "true");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả sản phẩm</option>
              <option value="false">Sản phẩm thường</option>
              <option value="true">Linh kiện Build PC</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(product.productCode)}
                          disabled={deleting === product.productCode}
                          className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {deleting === product.productCode ? "..." : "Xóa"}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Hiển thị:</span>
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
            <span className="text-sm text-gray-700">/ {total} sản phẩm</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ««
            </button>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              « Trước
            </button>
            <span className="px-3 py-1 text-sm">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Sau »
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
