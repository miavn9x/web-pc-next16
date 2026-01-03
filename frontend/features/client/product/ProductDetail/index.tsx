"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductTabs from "./components/ProductTabs";
import RelatedProducts from "./components/RelatedProducts";
import { productService } from "../services/product.service";
import { ProductData } from "../types";

// Breadcrumb simple component
// Breadcrumb simple component
function Breadcrumb({
  categoryName,
  categorySlug,
  subcategoryName,
  subcategorySlug,
  name,
}: {
  categoryName: string;
  categorySlug?: string;
  subcategoryName?: string;
  subcategorySlug?: string;
  name: string;
}) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 flex-wrap gap-2">
      <Link href="/" className="hover:text-blue-600 cursor-pointer">
        Trang chủ
      </Link>
      <span>/</span>
      <Link href="/product" className="hover:text-blue-600 cursor-pointer">
        Sản phẩm
      </Link>
      {categoryName && (
        <>
          <span>/</span>
          <Link
            href={categorySlug ? `/product/${categorySlug}` : "#"}
            className="hover:text-blue-600 cursor-pointer"
          >
            {categoryName}
          </Link>
        </>
      )}
      {subcategoryName && (
        <>
          <span>/</span>
          <Link
            href={
              categorySlug && subcategorySlug
                ? `/product/${categorySlug}/${subcategorySlug}`
                : "#"
            }
            className="hover:text-blue-600 cursor-pointer font-medium text-gray-700"
          >
            {subcategoryName}
          </Link>
        </>
      )}
      <span className="text-gray-300 hidden sm:inline">|</span>
      <span className="text-gray-400 truncate max-w-[200px] sm:max-w-none line-clamp-1">
        {name}
      </span>
    </nav>
  );
}

// Need Link import for breadcrumb
import Link from "next/link";

interface ProductDetailProps {
  initialProduct?: ProductData | null;
}

export default function ProductDetail({ initialProduct }: ProductDetailProps) {
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(
    initialProduct || null
  );
  const [loading, setLoading] = useState(!initialProduct);

  useEffect(() => {
    const fetchProduct = async () => {
      if (initialProduct) return;
      if (!params?.slug) return;
      try {
        setLoading(true);
        // Handle if slug is array (from [...slug]) or string
        const slugParam = Array.isArray(params.slug)
          ? params.slug[params.slug.length - 1]
          : (params.slug as string);

        const res = await productService.getProductBySlug(slugParam);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product detail", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy sản phẩm
        </h2>
        <Link href="/san-pham" className="text-blue-600 hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <Breadcrumb
        categoryName={product.category || "Sản phẩm"}
        categorySlug={product.categorySlug}
        subcategoryName={product.subcategory}
        subcategorySlug={product.subcategorySlug}
        name={product.name}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-5">
            <ProductGallery
              images={
                [
                  product.cover?.url,
                  ...(product.gallery?.map((g) => g.url) || []),
                ].filter((url): url is string => !!url) || [
                  product.cover?.url || "",
                ]
              }
              productName={product.name}
            />
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <ProductInfo product={product} />
          </div>
        </div>
      </div>

      {/* Tabs & Details */}
      <ProductTabs product={product} />

      {/* Related Products */}
      <RelatedProducts currentProductCode={product.productCode} />
    </div>
  );
}
