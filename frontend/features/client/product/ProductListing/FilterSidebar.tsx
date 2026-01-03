"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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

export default function FilterSidebar() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategorySlug = searchParams.get("category"); // Use 'category' for slug

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

  const toggleCategory = (code: string) => {
    setExpandedCategories((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleCategoryCheck = (slug: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Toggle logic
    if (current.get("category") === slug) {
      current.delete("category");
    } else {
      current.set("category", slug);
    }

    // Remove legacy param if exists
    current.delete("categoryCode");

    // Reset page to 1 (remove param)
    current.delete("page");

    // Construct query string
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
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
        {categories.map((cat) => {
          const isExpanded = expandedCategories.includes(cat.code);
          const hasChildren = cat.children && cat.children.length > 0;

          return (
            <div
              key={cat.code}
              className="border-b border-gray-50 last:border-0 pb-1"
            >
              <div
                onClick={() => hasChildren && toggleCategory(cat.code)}
                className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors group ${
                  !hasChildren ? "cursor-pointer hover:text-[#103E8F]" : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-gray-400 group-hover:text-[#103E8F] transition-colors">
                    {renderIcon(cat.icon)}
                  </span>
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#103E8F] transition-colors">
                    {cat.name}
                  </span>
                </div>
                {hasChildren && (
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Sub Categories (Children) */}
              {isExpanded && hasChildren && (
                <div className="pl-9 pr-2 pb-2 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 gap-4">
                    {/* 
                        Recursive rendering logic can be complex for infinite nesting.
                        For now, let's assume max depth 3 (Root -> Level 1 -> Level 2) as per previous data structure.
                        We can iterate children (Level 1) and their children (Level 2).
                     */}
                    {cat.children?.map((child) => (
                      <div key={child.code}>
                        <h4 className="text-[11px] font-bold text-gray-500 uppercase mb-1.5 hover:text-[#103E8F] cursor-pointer">
                          {child.name}
                        </h4>
                        {child.children && child.children.length > 0 && (
                          <div className="space-y-1 border-l-2 border-gray-100 pl-2">
                            {child.children.map((subChild) => (
                              <label
                                key={subChild.code}
                                className="flex items-center gap-2 cursor-pointer group/item select-none"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    currentCategorySlug === subChild.slug
                                  }
                                  onChange={() =>
                                    handleCategoryCheck(subChild.slug)
                                  }
                                  className="appearance-none w-3 h-3 border border-gray-300 rounded-sm checked:bg-[#103E8F] checked:border-[#103E8F] transition-all"
                                />
                                <span className="text-[11px] text-gray-600 group-hover/item:text-[#103E8F] transition-colors">
                                  {subChild.name}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                        {/* If no L2 children, just show L1 as clickable/checkable item? 
                             Or maybe L1 itself is the item if it has no children.
                             Refined logic: If L1 has no children, render it as item.
                         */}
                        {(!child.children || child.children.length === 0) && (
                          <label className="flex items-center gap-2 cursor-pointer group/item select-none pl-2">
                            <input
                              type="checkbox"
                              checked={currentCategorySlug === child.slug}
                              onChange={() => handleCategoryCheck(child.slug)}
                              className="appearance-none w-3 h-3 border border-gray-300 rounded-sm checked:bg-[#103E8F] checked:border-[#103E8F] transition-all"
                            />
                            <span className="text-[11px] text-gray-600 group-hover/item:text-[#103E8F] transition-colors">
                              Xem tất cả {child.name}
                            </span>
                          </label>
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [maxPrice, setMaxPrice] = useState(100000000); // Default fallback
  const [range, setRange] = useState<[number, number]>([0, 100000000]);
  const [minInput, setMinInput] = useState<string>("");
  const [maxInput, setMaxInput] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Sync state from URL on mount/update
  useEffect(() => {
    const minParam = searchParams.get("minPrice");
    const maxParam = searchParams.get("maxPrice");

    if (minParam || maxParam) {
      const newMin = minParam ? Number(minParam) : 0;
      // If maxParam is not present, we will set it after fetching maxPrice or default
      if (minParam) setMinInput(formatCurrency(newMin));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const res = await productService.getPriceRange();
        if (res.data) {
          // Round up to nearest 500k to ensure the slider covers the exact max value nicely
          const rawMax = res.data.max;
          const roundedMax = Math.ceil(rawMax / 500000) * 500000;

          setMaxPrice(roundedMax);

          // Determine initial values from URL or default
          const minParam = searchParams.get("minPrice");
          const maxParam = searchParams.get("maxPrice");

          const initialMin = minParam ? Number(minParam) : 0;
          const initialMax = maxParam ? Number(maxParam) : roundedMax;

          setRange([initialMin, initialMax]);
          setMinInput(formatCurrency(initialMin));
          setMaxInput(formatCurrency(initialMax));
        }
      } catch (error) {
        console.error("Failed to fetch price range", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceRange();
  }, [searchParams]); // Re-run if searchParams change (though mostly just need initial sync)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val);
  };

  const handleSliderChange = (val: [number, number]) => {
    setRange(val);
    setMinInput(formatCurrency(val[0]));
    setMaxInput(formatCurrency(val[1]));
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
    // Logic to update filter params in parent/url
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Only set if different from default/bounds to keep URL clean?
    // Or always set to be explicit. Let's always set for now.

    // Min Price
    if (range[0] > 0) {
      current.set("minPrice", range[0].toString());
    } else {
      current.delete("minPrice");
    }

    // Max Price
    if (range[1] < maxPrice) {
      current.set("maxPrice", range[1].toString());
    } else {
      current.delete("maxPrice");
    }

    // Reset pagination to 1 when filtering
    current.set("page", "1");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
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
              setMaxInput(formatCurrency(num));
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
