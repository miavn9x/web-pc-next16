"use client";

import {
  ChevronDown,
  ChevronUp,
  Search,
  Monitor,
  Cpu,
  CircuitBoard,
  CreditCard,
  HardDrive,
  Zap,
} from "lucide-react";
import { useState } from "react";

// DATA STRUCTURES
const CATEGORIES = [
  { name: "PC - Máy Tính Bộ", icon: <Monitor size={16} /> },
  { name: "CPU - Bộ Vi Xử Lý", icon: <Cpu size={16} /> },
  { name: "Mainboard - Bo Mạch Chủ", icon: <CircuitBoard size={16} /> },
  { name: "VGA - Card Màn Hình", icon: <CreditCard size={16} /> },
  { name: "RAM - Bộ Nhớ Trong", icon: <HardDrive size={16} /> },
  { name: "Ổ Cứng HDD, SSD", icon: <HardDrive size={16} /> },
  { name: "PSU - Nguồn Máy Tính", icon: <Zap size={16} /> },
  { name: "Màn Hình", icon: <Monitor size={16} /> },
];

const SUB_CATEGORIES: any = {
  0: {
    columns: [
      {
        title: "PC Chơi Game",
        items: [
          { name: "PC Gaming (< 10tr)" },
          { name: "PC Gaming (10-15tr)" },
          { name: "PC Gaming (15-25tr)" },
          { name: "PC Gaming (25-40tr)" },
          { name: "PC Gaming (> 40tr)" },
        ],
      },
      {
        title: "PC Đồ Họa & Văn Phòng",
        items: [
          { name: "PC Đồ Họa" },
          { name: "PC Giả Lập" },
          { name: "PC Văn Phòng" },
          { name: "PC Đồng Bộ" },
        ],
      },
    ],
  },
  1: {
    columns: [
      {
        title: "CPU Intel",
        items: [
          { name: "Core i9" },
          { name: "Core i7" },
          { name: "Core i5" },
          { name: "Core i3" },
          { name: "Intel Xeon" },
          { name: "Pentium / Celeron" },
        ],
      },
      {
        title: "CPU AMD",
        items: [
          { name: "Ryzen 9" },
          { name: "Ryzen 7" },
          { name: "Ryzen 5" },
          { name: "Ryzen 3" },
          { name: "Threadripper" },
        ],
      },
    ],
  },
  2: {
    columns: [
      {
        title: "Mainboard Intel",
        items: [
          { name: "Z790 / Z690" },
          { name: "B760 / B660" },
          { name: "H610" },
          { name: "Z590 / Z490" },
        ],
      },
      {
        title: "Mainboard AMD",
        items: [
          { name: "X670 / X670E" },
          { name: "B650 / B650E" },
          { name: "X570" },
          { name: "B550" },
        ],
      },
    ],
  },
  3: {
    columns: [
      {
        title: "NVIDIA GeForce",
        items: [
          { name: "RTX 4090" },
          { name: "RTX 4080" },
          { name: "RTX 4070" },
          { name: "RTX 4060" },
          { name: "RTX 3060" },
        ],
      },
      {
        title: "AMD Radeon",
        items: [
          { name: "RX 7900 XTX" },
          { name: "RX 7800 XT" },
          { name: "RX 7700 XT" },
          { name: "RX 7600" },
        ],
      },
    ],
  },
  4: {
    columns: [
      {
        title: "Loại RAM",
        items: [{ name: "DDR5" }, { name: "DDR4" }, { name: "DDR3" }],
      },
      {
        title: "Dung Lượng",
        items: [
          { name: "8GB" },
          { name: "16GB" },
          { name: "32GB" },
          { name: "64GB" },
        ],
      },
    ],
  },
  5: {
    columns: [
      {
        title: "Loại Ổ Cứng",
        items: [
          { name: "SSD NVMe Gen 4" },
          { name: "SSD NVMe Gen 3" },
          { name: "SSD SATA" },
          { name: "HDD" },
        ],
      },
      {
        title: "Dung Lượng",
        items: [
          { name: "256GB" },
          { name: "512GB" },
          { name: "1TB" },
          { name: "2TB" },
        ],
      },
    ],
  },
  6: {
    columns: [
      {
        title: "Chuẩn Nguồn",
        items: [
          { name: "80 Plus Bronze" },
          { name: "80 Plus Gold" },
          { name: "80 Plus Platinum" },
        ],
      },
      {
        title: "Công Suất",
        items: [
          { name: "Dưới 650W" },
          { name: "650W - 750W" },
          { name: "750W - 1000W" },
          { name: "Trên 1000W" },
        ],
      },
    ],
  },
  7: {
    columns: [
      {
        title: "Kích Thước",
        items: [
          { name: "24 inch" },
          { name: "27 inch" },
          { name: "32 inch" },
          { name: "34 inch Ultrawide" },
        ],
      },
      {
        title: "Độ phân giải",
        items: [{ name: "Full HD" }, { name: "2K" }, { name: "4K" }],
      },
    ],
  },
};

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
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-2">
      {/* Product Categories (Flat List) */}
      <div className="mb-6 space-y-1">
        {CATEGORIES.map((cat, index) => {
          const subData = SUB_CATEGORIES[index];
          const isExpanded = expandedCategories.includes(index);

          return (
            <div
              key={index}
              className="border-b border-gray-50 last:border-0 pb-1"
            >
              <div
                onClick={() => toggleCategory(index)}
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-gray-400 group-hover:text-[#103E8F] transition-colors">
                    {cat.icon}
                  </span>
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-[#103E8F] transition-colors">
                    {cat.name}
                  </span>
                </div>
                {subData && (
                  <ChevronDown
                    size={14}
                    className={`text-gray-400 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Sub Categories */}
              {isExpanded && subData && (
                <div className="pl-9 pr-2 pb-2 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                  {subData.columns.map((col: any, colIdx: number) => (
                    <div key={colIdx}>
                      <h4 className="text-[11px] font-bold text-gray-500 uppercase mb-1.5">
                        {col.title}
                      </h4>
                      <div className="space-y-1 border-l-2 border-gray-100 pl-2">
                        {col.items.map((item: any, itemIdx: number) => (
                          <label
                            key={itemIdx}
                            className="flex items-center gap-2 cursor-pointer group/item select-none"
                          >
                            <input
                              type="checkbox"
                              className="appearance-none w-3 h-3 border border-gray-300 rounded-sm checked:bg-[#103E8F] checked:border-[#103E8F] transition-all"
                            />
                            <span className="text-[11px] text-gray-600 group-hover/item:text-[#103E8F] transition-colors">
                              {item.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Price */}
      <FilterSection title="Mức giá">
        <div className="px-1 py-1">
          <input
            type="range"
            min="0"
            max="100000000"
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E31837]"
          />
          <div className="flex items-center gap-2 mt-4">
            <input
              type="number"
              placeholder="Từ"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:border-[#103E8F] focus:outline-none"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Đến"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:border-[#103E8F] focus:outline-none"
            />
          </div>
          <button className="w-full mt-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-[#103E8F] hover:text-white transition-colors">
            Áp dụng
          </button>
        </div>
      </FilterSection>
    </div>
  );
}
