"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productService } from "@/features/client/product/services/product.service";
import ProductListing from "@/features/client/product/ProductListing/ProductListing";
import ProductDetail from "@/features/client/product/ProductDetail";
import { ProductData } from "@/features/client/product/types";

export default function SlugDispatcher() {
  const params = useParams();
  const [viewMode, setViewMode] = useState<
    "loading" | "list" | "detail" | "404"
  >("loading");
  const [initialData, setInitialData] = useState<any>(null); // CategoryCode (string) or ProductData (object)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const slugArray = params?.slug;

    if (!slugArray || !Array.isArray(slugArray) || slugArray.length === 0) {
      // Should not happen in [...slug] route, but if it does, 404
      setViewMode("404");
      return;
    }

    const lastSlug = slugArray[slugArray.length - 1];

    async function check() {
      setViewMode("loading");

      // 1. Check Category
      try {
        const catRes = await productService.getCategoryBySlug(lastSlug);
        if (catRes && catRes.data) {
          setInitialData(catRes.data.code); // Store Code
          setViewMode("list");
          return;
        }
      } catch (e) {
        // Ignore error, try product
      }

      // 2. Check Product
      try {
        const prodRes = await productService.getProductBySlug(lastSlug);
        if (prodRes && prodRes.data) {
          setInitialData(prodRes.data);
          setViewMode("detail");
          return;
        }
      } catch (e) {
        // Ignore
      }

      setViewMode("404");
    }

    check();
  }, [params?.slug]);

  if (viewMode === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (viewMode === "404") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy trang yêu cầu
        </h2>
        <a href="/product" className="text-blue-600 hover:underline">
          Quay lại danh sách sản phẩm
        </a>
      </div>
    );
  }

  if (viewMode === "list") {
    return <ProductListing initialCategoryCode={initialData} />;
  }

  return <ProductDetail initialProduct={initialData as ProductData} />;
}
