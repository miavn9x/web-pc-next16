"use client";

import { useState } from "react";
import ProductSpecsTable from "./ProductSpecsTable";
import ProductDescription from "./ProductDescription";
import { ProductData } from "../../types";

interface ProductTabsProps {
    product: ProductData;
}

const TABS = [
    { id: "desc", label: "Mô tả chi tiết" },
    { id: "specs", label: "Thông số kỹ thuật" },

];

export default function ProductTabs({ product }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState("desc");

    return (
        <div className="mt-8 md:mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-none">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-4 text-sm md:text-base font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? "text-blue-600 bg-blue-50/50"
                            : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
                {activeTab === "desc" && (
                    <div className="animate-in fade-in duration-300">
                        <ProductDescription content={product.description} />
                    </div>
                )}
                {activeTab === "specs" && (
                    <div className="animate-in fade-in duration-300">
                        <h3 className="text-lg font-bold mb-4">Thông số kỹ thuật chi tiết</h3>
                        <ProductSpecsTable specs={product.specs} />
                    </div>
                )}

            </div>
        </div>
    );
}
