"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import {
  ChevronRight,
  Monitor,
  Cpu,
  CircuitBoard,
  HardDrive,
  Zap,
  CreditCard,
} from "lucide-react";
import { menuService, Category } from "../services/menu.service";

// Icon mapping helper
// Icon mapping helper
const getCategoryIcon = (cat: Category) => {
  // 1. Prioritize icon from Backend
  if (cat.icon) {
    const IconComponent = (LucideIcons as any)[cat.icon];
    if (IconComponent) return <IconComponent size={20} />;
  }

  // 2. Fallback to name heuristic
  const n = cat.name.toLowerCase();

  if (n.includes("pc") || n.includes("máy tính bộ"))
    return <Monitor size={20} />;
  if (n.includes("cpu") || n.includes("vi xử lý")) return <Cpu size={20} />;
  if (n.includes("main") || n.includes("bo mạch"))
    return <CircuitBoard size={20} />;
  if (n.includes("vga") || n.includes("card")) return <CreditCard size={20} />;
  if (n.includes("ram") || n.includes("bộ nhớ")) return <HardDrive size={20} />;
  if (n.includes("hdd") || n.includes("ssd") || n.includes("ổ cứng"))
    return <HardDrive size={20} />;
  if (n.includes("psu") || n.includes("nguồn")) return <Zap size={20} />;
  if (n.includes("màn hình")) return <Monitor size={20} />;

  return <Monitor size={20} />; // Default
};

import { useRouter } from "next/navigation";

const MegaMenuContent = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await menuService.getCategoryTree();
        // Sort/Filter logic if needed (e.g. only active)
        const activeData = data.filter((c) => c.isActive !== false);
        setCategories(activeData);
      } catch (err) {
        console.error("MegaMenu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-white text-gray-500">
        Đang tải danh mục...
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="h-[100px] flex items-center justify-center bg-white text-gray-500">
        Không có danh mục nào.
      </div>
    );
  }

  const activeCategory = categories[activeCategoryIndex];

  return (
    <div className="flex flex-col md:flex-row h-[480px]">
      {" "}
      {/* Fixed height for consistency */}
      {/* Left Column: Categories List */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 py-2 shrink-0 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <ul>
          {categories.map((cat, idx) => (
            <li
              key={cat.code}
              onMouseEnter={() => setActiveCategoryIndex(idx)}
              onClick={() => router.push(`/product/${cat.slug}`)}
              className={`px-4 py-3 cursor-pointer flex items-center justify-between text-[13px] font-medium transition-all ${
                activeCategoryIndex === idx
                  ? "bg-white text-[#103E8F] shadow-sm border-l-4 border-[#103E8F]"
                  : "text-gray-600 hover:bg-white hover:text-[#103E8F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    activeCategoryIndex === idx
                      ? "text-[#103E8F]"
                      : "text-gray-400"
                  }`}
                >
                  {getCategoryIcon(cat)}
                </span>
                <span className="line-clamp-1">{cat.name}</span>
              </div>
              {activeCategoryIndex === idx && <ChevronRight size={14} />}
            </li>
          ))}
        </ul>
      </div>
      {/* Middle Column: Dynamic Content Area */}
      <div className="flex-1 p-6 bg-white animate-in fade-in duration-200 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Render Children Columns (Level 2) */}
          {activeCategory?.children?.map((childL2) => (
            <div key={childL2.code}>
              <Link
                href={`/product/${childL2.slug}`}
                className="block text-[#103E8F] font-bold text-sm uppercase mb-3 border-b border-gray-100 pb-2 hover:underline"
              >
                {childL2.name}
              </Link>

              {/* Level 3 items */}
              <ul className="space-y-2.5">
                {childL2.children?.map((childL3) => (
                  <li key={childL3.code} className="group">
                    <Link
                      href={`/product/${childL3.slug}`}
                      className="text-sm text-gray-700 hover:text-[#103E8F] hover:translate-x-1 transition-all flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#103E8F] transition-colors"></span>
                      {childL3.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Render Price Ranges as a Column */}
          {activeCategory?.priceRanges &&
            activeCategory.priceRanges.length > 0 && (
              <div>
                <h3 className="text-[#103E8F] font-bold text-sm uppercase mb-3 border-b border-gray-100 pb-2">
                  THEO MỨC GIÁ
                </h3>
                <ul className="space-y-2.5">
                  {activeCategory.priceRanges.map((range, idx) => (
                    <li key={idx} className="group">
                      <Link
                        href={`/product/${activeCategory.slug}?minPrice=${
                          range.min
                        }${range.max ? `&maxPrice=${range.max}` : ""}`}
                        className="text-sm text-gray-700 hover:text-[#103E8F] hover:translate-x-1 transition-all flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#103E8F] transition-colors"></span>
                        {range.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Special case: If no children and no price ranges, link to itself */}
          {(!activeCategory?.children ||
            activeCategory.children.length === 0) &&
            (!activeCategory?.priceRanges ||
              activeCategory.priceRanges.length === 0) && (
              <div className="col-span-3 text-center py-10 text-gray-400">
                <p>Chưa có danh mục con</p>
                <Link
                  href={`/product/${activeCategory?.slug}`}
                  className="text-blue-600 hover:underline mt-2 inline-block"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenuContent;
