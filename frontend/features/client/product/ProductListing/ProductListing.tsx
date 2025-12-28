"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home, Grid, List as ListIcon } from "lucide-react";
import FilterSidebar from "./FilterSidebar";
import ProductCard from "../components/ProductCard";

import { PRODUCT_DETAIL_DATA } from "../data/mockData";
import { ProductData } from "../types";

// Convert object to array for listing
const PRODUCTS: ProductData[] = Object.values(PRODUCT_DETAIL_DATA);

export default function ProductListing() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col py-2">
      <div className="container mx-auto px-2 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row gap-2 flex-1">
          {/* Sidebar */}
          <aside className="w-full lg:w-[20%] shrink-0">
            <FilterSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col">
            {/* Sort Bar */}
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700">
                  Sắp xếp theo:
                </span>
                <select className="text-sm border-gray-200 rounded-md py-1.5 focus:ring-red-500 focus:border-red-500">
                  <option>Giá tăng dần</option>
                  <option>Giá giảm dần</option>
                  <option>Mới nhất</option>
                  <option>Bán chạy nhất</option>
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
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 gap-2">
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.productCode}
                  productCode={product.productCode}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  slug={product.slug}
                  isNew={true} // Simulation
                />
              ))}
              {/* Duplicate Items to Fill Grid for Visual */}
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={`${product.productCode}-dup`}
                  productCode={`${product.productCode}-dup`}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  slug={product.slug}
                  isHot={true} // Simulation
                />
              ))}
              {/* Duplicate Items to Fill Grid for Visual */}
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={`${product.productCode}-dup-2`}
                  productCode={`${product.productCode}-dup-2`}
                  name={product.name}
                  image={product.image}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  slug={product.slug}
                />
              ))}
            </div>

            {/* Pagination Mock */}
            <div className="mt-auto pt-8 flex justify-center items-center gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronRight className="rotate-180" size={16} />
              </button>

              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-red-600 text-white font-bold shadow-sm hover:bg-red-700 transition-all">
                1
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 transition-all font-medium">
                2
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 transition-all font-medium">
                3
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 transition-all font-medium">
                4
              </button>
              <span className="w-9 flex items-center justify-center pb-2 text-gray-400 font-bold tracking-widest text-lg">
                ...
              </span>
              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:border-red-600 hover:text-red-600 transition-all font-medium">
                12
              </button>

              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
