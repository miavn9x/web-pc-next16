"use client";

import React, { useState } from "react";
import { PC_CONFIGS, PCConfig } from "./data";
import ConfigCard from "./components/ConfigCard";
import { Monitor, Briefcase, Zap, Layers } from "lucide-react";

export default function BuildPcPage() {
  const [activeCategory, setActiveCategory] = useState<
    "All" | "Gaming" | "Office" | "Workstation"
  >("All");

  const filteredConfigs =
    activeCategory === "All"
      ? PC_CONFIGS
      : PC_CONFIGS.filter((c) => c.filters.purpose === activeCategory);

  const categories = [
    { id: "All", label: "Tất cả", icon: Layers },
    { id: "Gaming", label: "PC Gaming", icon: Zap },
    { id: "Workstation", label: "Đồ Họa / Làm Việc", icon: Monitor },
    { id: "Office", label: "Văn phòng", icon: Briefcase },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f172a] text-white py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-wider">
            Cấu Hình PC Đề Xuất
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Những bộ PC được PC Store VN tối ưu hiệu năng trên giá thành, đáp
            ứng tốt mọi nhu cầu từ Gaming, Đồ họa đến Văn phòng.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`
                            flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 border
                            ${
                              isActive
                                ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30"
                                : "bg-white text-gray-600 border-gray-200 hover:border-red-600 hover:text-red-600"
                            }
                        `}
              >
                <Icon size={18} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredConfigs.map((config) => (
            <ConfigCard key={config.productCode} config={config} />
          ))}
        </div>

        {filteredConfigs.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>Chưa có cấu hình nào trong danh mục này.</p>
          </div>
        )}
      </div>
    </div>
  );
}
