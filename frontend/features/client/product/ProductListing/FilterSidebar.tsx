"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "../services/product.service";
import { getIconComponent } from "@/shared/components/icons/IconRegistry";

interface CategoryNode {
  code: string;
  name: string;
  slug: string;
  icon?: string;
  children?: CategoryNode[];
}

const FilterSection = ({
  title,
  children,
  isOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  isOpen?: boolean;
}) => {
  const [open, setOpen] = useState(isOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full font-bold text-[#103E8F] text-[15px] uppercase mb-3 hover:text-red-500 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && (
        <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

import {
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
} from "next/navigation";
import { useMemo } from "react";

interface FilterSidebarProps {
  activeCategoryCode?: string | null;
}

// Helper to find slug path
const findSlugPath = (
  nodes: CategoryNode[],
  targetCode: string,
  path: string[] = []
): string[] | null => {
  for (const node of nodes) {
    const currentPath = [...path, node.slug];
    if (node.code === targetCode) {
      return currentPath;
    }
    if (node.children) {
      const found = findSlugPath(node.children, targetCode, currentPath);
      if (found) return found;
    }
  }
  return null;
};

const findCodeBySlug = (nodes: CategoryNode[], slug: string): string | null => {
  for (const node of nodes) {
    if (node.slug === slug) return node.code;
    if (node.children) {
      const found = findCodeBySlug(node.children, slug);
      if (found) return found;
    }
  }
  return null;
};

import { useSidebar } from "@/features/client/product/context/SidebarContext";

export default function FilterSidebar({
  activeCategoryCode,
}: FilterSidebarProps) {
  const { isVisible } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();

  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // ... (keeping existing logic)

  // Use useEffect to fetch categories...
  // (Assuming internal logic implies we keep hooks running)

  // NOTE: Logic for activeCategory memo remains here

  // We hide via CSS to preserve state/filters
  const startClass =
    "bg-white rounded-lg shadow-sm border border-gray-100 p-2 transition-all duration-300";

  // Logic inside function body
  const activeCategory = useMemo(() => {
    if (activeCategoryCode) return activeCategoryCode;
    // ...
    // Re-implement useMemo logic for context
    const queryCat = searchParams.get("category");
    if (queryCat) return queryCat;

    const slugArray = params?.slug;
    if (slugArray && categories.length > 0) {
      const lastSlug = Array.isArray(slugArray)
        ? slugArray[slugArray.length - 1]
        : slugArray;
      return findCodeBySlug(categories, lastSlug);
    }
    return null;
  }, [activeCategoryCode, searchParams, params?.slug, categories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getCategoriesTree();
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // ... (other handlers)

  if (!isVisible) {
    return <div className="hidden" />;
  }

  const handleFilter = (code: string) => {
    // If clicking the current active category, allow deselecting -> go to root
    if (activeCategory === code) {
      router.push("/product");
      return;
    }

    const path = findSlugPath(categories, code);
    if (path && path.length > 0) {
      // User request: Single slug only (no hierarchy)
      const targetSlug = path[path.length - 1];
      router.push(`/product/${targetSlug}`);
    } else {
      // Fallback
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", code);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const toggleCategory = (code: string) => {
    setExpandedCategories((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const renderIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = getIconComponent(iconName);
    return Icon ? <Icon size={16} /> : null;
  };

  if (loading)
    return (
      <div className="p-4 text-center text-gray-400">Đang tải danh mục...</div>
    );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
      {/* Product Categories (Dynamic Tree) */}
      <div className="mb-6 space-y-1">
        {categories.map((cat, catIdx) => {
          const isExpanded = expandedCategories.includes(cat.code);
          const hasChildren = cat.children && cat.children.length > 0;
          const isRootActive = activeCategory === cat.code;

          return (
            <div
              key={`${cat.code}-${catIdx}`}
              className="border-b border-gray-50 last:border-0 pb-1"
            >
              {/* ... (content omitted, keeping structure) ... */}
              <div
                className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors group ${
                  !hasChildren ? "cursor-pointer hover:text-[#103E8F]" : ""
                }`}
              >
                <div
                  className="flex items-center gap-2.5 flex-1"
                  onClick={() =>
                    hasChildren
                      ? toggleCategory(cat.code)
                      : handleFilter(cat.code)
                  }
                >
                  <span
                    className={`transition-colors ${
                      isRootActive
                        ? "text-[#103E8F]"
                        : "text-gray-400 group-hover:text-[#103E8F]"
                    }`}
                  >
                    {renderIcon(cat.icon)}
                  </span>
                  <span
                    className={`text-[13px] font-medium transition-colors ${
                      isRootActive
                        ? "text-[#103E8F] font-bold"
                        : "text-gray-700 group-hover:text-[#103E8F]"
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>

                {hasChildren && (
                  <div onClick={() => toggleCategory(cat.code)} className="p-1">
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Sub Categories (Children) */}
              {isExpanded && hasChildren && (
                <div className="pl-9 pr-2 pb-2 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 gap-4">
                    {cat.children?.map((child, childIdx) => (
                      <div key={`${child.code}-${childIdx}`}>
                        <label className="flex items-center gap-2 cursor-pointer group/sub mb-1.5">
                          <input
                            type="checkbox"
                            checked={activeCategory === child.code}
                            onChange={() => handleFilter(child.code)}
                            className="appearance-none w-3 h-3 border border-gray-300 rounded-sm checked:bg-[#103E8F] checked:border-[#103E8F] transition-all"
                          />
                          <h4
                            className={`text-[11px] font-bold uppercase hover:text-[#103E8F] cursor-pointer ${
                              activeCategory === child.code
                                ? "text-[#103E8F]"
                                : "text-gray-500"
                            }`}
                          >
                            {child.name}
                          </h4>
                        </label>

                        {child.children && child.children.length > 0 && (
                          <div className="space-y-1 border-l-2 border-gray-100 pl-2">
                            {child.children.map((subChild, subIdx) => (
                              <label
                                key={`${subChild.code}-${subIdx}`}
                                className="flex items-center gap-2 cursor-pointer group/item select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={activeCategory === subChild.code}
                                  onChange={() => handleFilter(subChild.code)}
                                  className="appearance-none w-3 h-3 border border-gray-300 rounded-sm checked:bg-[#103E8F] checked:border-[#103E8F] transition-all"
                                />
                                <span
                                  className={`text-[11px] transition-colors ${
                                    activeCategory === subChild.code
                                      ? "text-[#103E8F] font-bold"
                                      : "text-gray-600 group-hover/item:text-[#103E8F]"
                                  }`}
                                >
                                  {subChild.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Price */}
      <FilterSection title="Mức giá">
        <PriceFilter />
      </FilterSection>
    </div>
  );
}

import DualRangeSlider from "@/shared/components/ui/DualRangeSlider";

const PriceFilter = () => {
  const [maxPrice, setMaxPrice] = useState(100000000); // Default fallback
  const [range, setRange] = useState<[number, number]>([0, 100000000]);
  const [minInput, setMinInput] = useState<string>("");
  const [maxInput, setMaxInput] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const res = await productService.getPriceRange();
        if (res.data) {
          // Round up to nearest 500k to ensure the slider covers the exact max value nicely
          const rawMax = res.data.max;
          const roundedMax = Math.ceil(rawMax / 500000) * 500000;

          setMaxPrice(roundedMax);
          setRange([0, roundedMax]);
          setMinInput("0");
          setMaxInput(formatCurrency(roundedMax));
        }
      } catch (error) {
        console.error("Failed to fetch price range", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceRange();
  }, []);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  const handleSliderChange = (val: [number, number]) => {
    setRange(val);
    setMinInput(formatCurrency(val[0]));
    setMaxInput(val[1] === maxPrice ? "" : formatCurrency(val[1]));
  };

  const handleInputChange = (type: "min" | "max", val: string) => {
    // allow typing numbers and dots
    const raw = val.replace(/\./g, "").replace(/\D/g, "");
    const num = Number(raw);

    if (type === "min") {
      setMinInput(raw ? formatCurrency(num) : "0");
    } else {
      setMaxInput(raw ? formatCurrency(num) : "");
    }
  };

  const applyPrice = () => {
    console.log("Apply price:", range);
    // Logic to update filter params in parent/url
    // ...
  };

  return (
    <div className="px-1 py-1">
      <div className="mb-4 px-2">
        {/* Only render slider when data is loaded to avoid jumping or wrong scale */}
        {!loading && (
          <DualRangeSlider
            min={0}
            max={maxPrice}
            step={100000}
            value={range}
            onChange={handleSliderChange}
          />
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ₫
          </span>
          <input
            type="text"
            value={minInput}
            onChange={(e) => handleInputChange("min", e.target.value)}
            onBlur={() => {
              // Validate on blur
              const val = minInput.replace(/\./g, "");
              let num = val ? parseInt(val) : 0;
              if (num > range[1]) num = range[1];
              setRange([num, range[1]]);
              setMinInput(formatCurrency(num));
            }}
            placeholder="Từ"
            className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded hover:border-[#103E8F] focus:border-[#103E8F] focus:outline-none focus:ring-1 focus:ring-[#103E8F] transition-all"
          />
        </div>
        <span className="text-gray-400">-</span>
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            ₫
          </span>
          <input
            type="text"
            value={maxInput}
            onChange={(e) => handleInputChange("max", e.target.value)}
            onBlur={() => {
              const val = maxInput.replace(/\./g, "");
              let num = val ? parseInt(val) : maxPrice;
              if (num < range[0]) num = range[0];
              if (num > maxPrice) num = maxPrice; // Cap at dynamic max
              setRange([range[0], num]);
              setMaxInput(num === maxPrice ? "" : formatCurrency(num));
            }}
            placeholder="Đến"
            className="w-full pl-6 pr-2 py-1.5 text-xs border border-gray-300 rounded hover:border-[#103E8F] focus:border-[#103E8F] focus:outline-none focus:ring-1 focus:ring-[#103E8F] transition-all"
          />
        </div>
      </div>

      <button
        onClick={applyPrice}
        className="w-full py-2 bg-gray-100 text-gray-700 text-xs font-bold uppercase rounded hover:bg-[#E31837] hover:text-white transition-all shadow-sm"
      >
        Áp dụng
      </button>
    </div>
  );
};
