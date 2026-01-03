"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Grid, List as ListIcon } from "lucide-react";
// import FilterSidebar from "./FilterSidebar";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/product.service";
import { ProductData } from "../types";
import { useSearchParams, useRouter } from "next/navigation";

interface ProductListingProps {
  initialCategoryCode?: string;
}

export default function ProductListing({
  initialCategoryCode,
}: ProductListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryCode = initialCategoryCode || searchParams.get("category");

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    total: 0,
  });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await productService.getProducts({
        page,
        limit: 20,
        categoryCode: categoryCode || undefined,
        // Add other filters here later
      });
      setProducts(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryCode]); // Re-fetch when category changes

  return (
    <div className="flex-1 flex flex-col">
      {/* Sort Bar */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gray-700">Sắp xếp theo:</span>
          <select className="text-sm border-gray-200 rounded-md py-1.5 focus:ring-red-500 focus:border-red-500">
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
            <option value="newest">Mới nhất</option>
            <option value="bestseller">Bán chạy nhất</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Xem:</span>
          <button className="p-1.5 bg-blue-50 text-blue-600 rounded">
            <Grid size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:bg-gray-50 rounded">
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 h-80 animate-pulse">
              <div className="bg-gray-200 h-40 w-full mb-4 rounded"></div>
              <div className="h-4 bg-gray-200 w-3/4 mb-2 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2">
          {products.map((product) => (
            <ProductCard
              key={product.productCode}
              productCode={product.productCode}
              name={product.name}
              image={product.cover?.url || ""}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              slug={product.slug}
              // isNew={product.isNew} // Add backend field later if needed
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg">
          <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
        </div>
      )}

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="mt-auto pt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => fetchProducts(meta.page - 1)}
            disabled={meta.page === 1}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="rotate-180" size={16} />
          </button>

          {[...Array(meta.totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => fetchProducts(i + 1)}
              className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all font-medium ${
                meta.page === i + 1
                  ? "bg-red-600 text-white border-red-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => fetchProducts(meta.page + 1)}
            disabled={meta.page === meta.totalPages}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
