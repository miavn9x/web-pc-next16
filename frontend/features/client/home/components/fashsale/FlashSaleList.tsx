"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FlashSaleProductCard from "./FlashSaleProductCard";
import { productService } from "@/features/client/product/services/product.service";
import { ProductData } from "@/features/client/product/types";

export default function FlashSaleList() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default PC
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Featured Products
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productService.getProducts({
          isFeatured: true,
          limit: 20, // Limit to 20 for slider
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch featured products", error);
      }
    };
    fetchFeatured();
  }, []);

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(4); // Mobile (2 cols x 2 rows)
      } else if (width >= 768 && width < 1024) {
        setItemsPerPage(8); // Tablet (4 cols x 2 rows)
      } else {
        setItemsPerPage(10); // PC (5 cols x 2 rows)
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const resetAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (totalPages > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
      }, 10000);
    }
  };

  const handleNext = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev + 1) % totalPages);
    resetAutoSlide();
  };

  const handlePrev = () => {
    if (totalPages <= 1) return;
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    resetAutoSlide();
  };

  // Auto-slide 10s
  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]); // Dependencies: updates when totalPages changes (e.g. resize)

  // Reset page on resize to prevent empty views
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage]);

  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (products.length === 0) {
    return null; // Or render loading skeleton
  }

  return (
    <div className="relative group/slider mt-8">
      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
            aria-label="Next page"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-y-6 lg:gap-x-4">
        {currentProducts.map((product) => (
          <div key={product.productCode} className="w-full">
            <FlashSaleProductCard
              productCode={product.productCode}
              name={product.name}
              image={product.cover?.url || ""}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              slug={product.slug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
