"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FlashSaleProductCard from "../../../home/components/fashsale/FlashSaleProductCard";
import { productService } from "../../services/product.service";
import { ProductData } from "../../types";

interface RelatedProductsProps {
  currentProductCode: string;
}

export default function RelatedProducts({
  currentProductCode,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default PC (1 row)
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Related Products
  useEffect(() => {
    const fetchRelated = async () => {
      if (!currentProductCode) return;
      try {
        const res = await productService.getRelatedProducts(currentProductCode);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch related products", error);
      }
    };
    fetchRelated();
  }, [currentProductCode]);

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(2); // Mobile
      } else if (width >= 768 && width < 1024) {
        setItemsPerPage(4); // Tablet
      } else {
        setItemsPerPage(5); // PC
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
      }, 5000); // 5s auto switch
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

  // Auto-slide
  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalPages]);

  // Reset page on resize
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage]);

  const currentProducts = products.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  if (products.length === 0) return null;

  return (
    <section className="mt-12 md:mt-16">
      <div className="container mx-auto">
        {/* Unified Container with User's Background */}
        <div className="bg-[url('/banner/related-bg.jpg')] bg-cover bg-center rounded-2xl p-6 md:p-8 shadow-2xl relative z-0 group/slider">
          {/* Navigation Buttons */}
          {totalPages > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 -translate-x-1/2"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 translate-x-1/2"
                aria-label="Next page"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Title Section */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
            <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide drop-shadow-md">
              SẢN PHẨM LIÊN QUAN
            </h2>
          </div>

          {/* Products Grid - Dynamic Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 transition-all duration-500">
            {currentProducts.map((item) => (
              <div
                key={item.productCode}
                className="w-full animate-in fade-in duration-500 slide-in-from-right-4"
              >
                <FlashSaleProductCard
                  key={item.productCode}
                  productCode={item.productCode}
                  name={item.name}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  discount={item.discount}
                  image={item.cover?.url || ""}
                  slug={item.slug}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
