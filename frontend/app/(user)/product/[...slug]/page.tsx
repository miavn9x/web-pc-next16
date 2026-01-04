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
  const [initialData, setInitialData] = useState<any>(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const slugArray = params?.slug;

    if (!slugArray || !Array.isArray(slugArray)) {
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
          setInitialData(catRes.data.code);
          setViewMode("list");
          return;
        }
      } catch (e) {
        // Ignore
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

  // Determine current category slug from URL params if available
  const slugArray = params?.slug;
  const currentCategorySlug =
    Array.isArray(slugArray) && slugArray.length > 0 ? slugArray[0] : undefined;

  // Use last slug for fetching logic (already defined above as const lastSlug)

  if (viewMode === "list") {
    // If we are in "list" mode, we are listing a category.
    // The LAST slug in the URL is effectively the category slug we are viewing.
    // e.g. /product/cat1 -> lastSlug = cat1.
    // OR /product/cat1/subcat -> lastSlug = subcat.
    // So currentCategorySlug should probably be lastSlug for the Listing context?
    // Wait, if I am at /product/cat1, I want products to link to /product/cat1/prod.
    // So currentCategorySlug should be `slugArray.join('/')`?
    // No, ProductCard appends `slug`.
    // If I pass `cat1`, ProductCard makes `/product/cat1/prod`. Correct.
    // If I pass `cat1/subcat`, ProductCard makes `/product/cat1/subcat/prod`. Correct.
    // So we should pass the full path of the current category context.
    // Actually, `params.slug` joined by '/' IS the category path.
    const categoryPath = Array.isArray(params?.slug)
      ? params?.slug.join("/")
      : (params?.slug as string);

    return (
      <React.Suspense
        fallback={<div className="p-10 text-center">Đang tải sản phẩm...</div>}
      >
        <ProductListing
          initialCategoryCode={initialData}
          currentCategorySlug={categoryPath}
        />
      </React.Suspense>
    );
  }

  // If viewMode === "detail", we are on a product page.
  // The URL might be /product/cat/prod.
  // params.slug = ['cat', 'prod'].
  // We want fallbackCategorySlug to be 'cat'.
  // If URL is /product/cat/sub/prod. params.slug = ['cat', 'sub', 'prod'].
  // fallbackCategorySlug = 'cat/sub'.
  // So we take everything EXCEPT the last item.
  const fallbackCategorySlug =
    Array.isArray(params?.slug) && params.slug.length > 1
      ? params.slug.slice(0, -1).join("/")
      : undefined;

  return (
    <ProductDetail
      initialProduct={initialData as ProductData}
      fallbackCategorySlug={fallbackCategorySlug}
    />
  );
}
