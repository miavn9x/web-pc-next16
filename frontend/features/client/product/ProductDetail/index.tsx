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
function Breadcrumb({
  category,
  subcategory,
  name,
}: {
  category: string;
  subcategory: string;
  name: string;
}) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-6 flex-wrap gap-2">
      <Link href="/" className="hover:text-blue-600 cursor-pointer">
        Trang chủ
      </Link>
      <span>/</span>
      <Link
        href={`/${category}`}
        className="hover:text-blue-600 cursor-pointer"
      >
        {category}
      </Link>
      <span>/</span>
      <Link
        href={`/${subcategory}`}
        className="hover:text-blue-600 cursor-pointer font-medium text-gray-700"
      >
        {subcategory}
      </Link>
      <span className="text-gray-300 hidden sm:inline">|</span>
      <span className="text-gray-400 truncate max-w-[200px] sm:max-w-none line-clamp-1">
        {name}
      </span>
    </nav>
  );
}

// Need Link import for breadcrumb
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.slug) return;
      try {
        setLoading(true);
        const res = await productService.getProductBySlug(
          params.slug as string
        );
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
    <section className="bg-gray-50 min-h-screen py-6 md:py-10">
      <div className="container mx-auto px-4">
        <Breadcrumb
          category={product.category || "Sản phẩm"}
          subcategory={product.subcategory || ""}
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
    </section>
  );
}
