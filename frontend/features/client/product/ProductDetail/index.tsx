"use client";

import { PRODUCT_DETAIL_DATA } from "../data/mockData";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductTabs from "./components/ProductTabs";
import RelatedProducts from "./components/RelatedProducts";

// Breadcrumb simple component
function Breadcrumb({ category, subcategory, name }: { category: string, subcategory: string, name: string }) {
    return (
        <nav className="flex items-center text-sm text-gray-500 mb-6 flex-wrap gap-2">
            <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer">{category}</span>
            <span>/</span>
            <span className="hover:text-blue-600 cursor-pointer font-medium text-gray-700">{subcategory}</span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-gray-400 truncate max-w-[200px] sm:max-w-none line-clamp-1">{name}</span>
        </nav>
    )
}

export default function ProductDetail() {
    // Use mock data - Defaulting to PC Gaming for demo
    // In real app, this would come from props or URL params hook
    const product = PRODUCT_DETAIL_DATA.pc;

    return (
        <section className="bg-gray-50 min-h-screen py-6 md:py-10">
            <div className="container mx-auto px-4">
                <Breadcrumb
                    category={product.category}
                    subcategory={product.subcategory}
                    name={product.name}
                />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                        {/* Left Column: Gallery */}
                        <div className="lg:col-span-5">
                            <ProductGallery
                                images={product.images}
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
                <RelatedProducts />
            </div>
        </section>
    );
}
