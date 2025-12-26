import { ChevronRight } from "lucide-react";
import { categories } from "../data/categories";
import { useState } from "react";

// Default content for categories without specific data

// Mock data mapping for sub-categories (index based on categories array)
// Define types for scientific data structure (API ready)
interface MenuItem {
  name: string;
  slug: string; // Identifier for routing or filtering
}

interface MenuColumn {
  title: string;
  items: MenuItem[];
}

interface MegaMenuCategory {
  columns: MenuColumn[];
}

// Mock data mapping for sub-categories (index based on categories array)
const SUB_CATEGORIES: Record<number, MegaMenuCategory> = {
  0: {
    // PC - Máy Tính Bộ
    columns: [
      {
        title: "PC Chơi Game",
        items: [
          { name: "PC Gaming (< 10tr)", slug: "pc-gaming-lt-10m" },
          { name: "PC Gaming (10-15tr)", slug: "pc-gaming-10-15m" },
          { name: "PC Gaming (15-25tr)", slug: "pc-gaming-15-25m" },
          { name: "PC Gaming (25-40tr)", slug: "pc-gaming-25-40m" },
          { name: "PC Gaming (> 40tr)", slug: "pc-gaming-gt-40m" },
        ],
      },
      {
        title: "PC Đồ Họa & Văn Phòng",
        items: [
          { name: "PC Đồ Họa", slug: "pc-do-hoa" },
          { name: "PC Giả Lập", slug: "pc-gia-lap" },
          { name: "PC Văn Phòng", slug: "pc-van-phong" },
          { name: "PC Đồng Bộ", slug: "pc-dong-bo" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 5 Triệu", slug: "price-lt-5m" },
          { name: "5 - 8 Triệu", slug: "price-5-8m" },
          { name: "8 - 12 Triệu", slug: "price-8-12m" },
          { name: "12 - 15 Triệu", slug: "price-12-15m" },
          { name: "15 - 20 Triệu", slug: "price-15-20m" },
          { name: "Trên 20 Triệu", slug: "price-gt-20m" },
        ],
      },
    ],
  },
  1: {
    // CPU
    columns: [
      {
        title: "CPU Intel",
        items: [
          { name: "Core i9", slug: "cpu-intel-core-i9" },
          { name: "Core i7", slug: "cpu-intel-core-i7" },
          { name: "Core i5", slug: "cpu-intel-core-i5" },
          { name: "Core i3", slug: "cpu-intel-core-i3" },
          { name: "Intel Xeon", slug: "cpu-intel-xeon" },
          { name: "Pentium / Celeron", slug: "cpu-intel-pentium-celeron" },
          { name: "Socket 1700", slug: "cpu-socket-1700" },
          { name: "Socket 1200", slug: "cpu-socket-1200" },
        ],
      },
      {
        title: "CPU AMD",
        items: [
          { name: "Ryzen 9", slug: "cpu-amd-ryzen-9" },
          { name: "Ryzen 7", slug: "cpu-amd-ryzen-7" },
          { name: "Ryzen 5", slug: "cpu-amd-ryzen-5" },
          { name: "Ryzen 3", slug: "cpu-amd-ryzen-3" },
          { name: "Threadripper", slug: "cpu-amd-threadripper" },
          { name: "Socket AM5", slug: "cpu-socket-am5" },
          { name: "Socket AM4", slug: "cpu-socket-am4" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 3 Triệu", slug: "price-lt-3m" },
          { name: "3 - 5 Triệu", slug: "price-3-5m" },
          { name: "5 - 10 Triệu", slug: "price-5-10m" },
          { name: "10 - 15 Triệu", slug: "price-10-15m" },
          { name: "Trên 15 Triệu", slug: "price-gt-15m" },
        ],
      },
    ],
  },
  2: {
    // Mainboard
    columns: [
      {
        title: "Mainboard Intel",
        items: [
          { name: "Z790 / Z690", slug: "main-z790-z690" },
          { name: "B760 / B660", slug: "main-b760-b660" },
          { name: "H610", slug: "main-h610" },
          { name: "Z590 / Z490", slug: "main-z590-z490" },
          { name: "Dòng cao cấp", slug: "main-high-end" },
        ],
      },
      {
        title: "Mainboard AMD",
        items: [
          { name: "X670 / X670E", slug: "main-x670-x670e" },
          { name: "B650 / B650E", slug: "main-b650-b650e" },
          { name: "X570", slug: "main-x570" },
          { name: "B550", slug: "main-b550" },
          { name: "Dòng A-Series", slug: "main-a-series" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 2 Triệu", slug: "price-lt-2m" },
          { name: "2 - 5 Triệu", slug: "price-2-5m" },
          { name: "5 - 10 Triệu", slug: "price-5-10m" },
          { name: "Trên 10 Triệu", slug: "price-gt-10m" },
        ],
      },
    ],
  },
  3: {
    // VGA
    columns: [
      {
        title: "NVIDIA GeForce",
        items: [
          { name: "RTX 4090", slug: "vga-rtx-4090" },
          { name: "RTX 4080 / 4080 Super", slug: "vga-rtx-4080-series" },
          { name: "RTX 4070 / Ti / Super", slug: "vga-rtx-4070-series" },
          { name: "RTX 4060 / Ti", slug: "vga-rtx-4060-series" },
          { name: "RTX 3060 / 3050", slug: "vga-rtx-3060-3050" },
          { name: "Quadro (Chuyên đồ họa)", slug: "vga-quadro" },
        ],
      },
      {
        title: "AMD Radeon",
        items: [
          { name: "RX 7900 XTX / XT", slug: "vga-rx-7900-series" },
          { name: "RX 7800 XT", slug: "vga-rx-7800-xt" },
          { name: "RX 7700 XT", slug: "vga-rx-7700-xt" },
          { name: "RX 7600", slug: "vga-rx-7600" },
          { name: "RX 6000 Series", slug: "vga-rx-6000-series" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 5 Triệu", slug: "price-lt-5m" },
          { name: "5 - 10 Triệu", slug: "price-5-10m" },
          { name: "10 - 20 Triệu", slug: "price-10-20m" },
          { name: "20 - 40 Triệu", slug: "price-20-40m" },
          { name: "Trên 40 Triệu", slug: "price-gt-40m" },
        ],
      },
    ],
  },
  4: {
    // RAM
    columns: [
      {
        title: "Loại RAM",
        items: [
          { name: "RAM DDR5", slug: "ram-ddr5" },
          { name: "RAM DDR4", slug: "ram-ddr4" },
          { name: "RAM DDR3", slug: "ram-ddr3" },
        ],
      },
      {
        title: "Dung Lượng",
        items: [
          { name: "4GB", slug: "ram-4gb" },
          { name: "8GB", slug: "ram-8gb" },
          { name: "16GB", slug: "ram-16gb" },
          { name: "32GB", slug: "ram-32gb" },
          { name: "64GB", slug: "ram-64gb" },
          { name: "Kit RAM (2 thanh)", slug: "ram-kit" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 1 Triệu", slug: "price-lt-1m" },
          { name: "1 - 3 Triệu", slug: "price-1-3m" },
          { name: "3 - 5 Triệu", slug: "price-3-5m" },
          { name: "Trên 5 Triệu", slug: "price-gt-5m" },
        ],
      },
    ],
  },
  5: {
    // Ổ Cứng HDD, SSD
    columns: [
      {
        title: "Loại Ổ Cứng",
        items: [
          { name: "SSD NVMe PCIe Gen 4", slug: "ssd-nvme-gen4" },
          { name: "SSD NVMe PCIe Gen 3", slug: "ssd-nvme-gen3" },
          { name: "SSD 2.5 SATA", slug: "ssd-sata" },
          { name: "HDD PC (3.5 inch)", slug: "hdd-pc" },
          { name: "HDD Laptop (2.5 inch)", slug: "hdd-laptop" },
        ],
      },
      {
        title: "Dung Lượng",
        items: [
          { name: "256GB", slug: "storage-256gb" },
          { name: "512GB", slug: "storage-512gb" },
          { name: "1TB", slug: "storage-1tb" },
          { name: "2TB", slug: "storage-2tb" },
          { name: "4TB", slug: "storage-4tb" },
          { name: "Trên 4TB", slug: "storage-gt-4tb" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 1 Triệu", slug: "price-lt-1m" },
          { name: "1 - 2 Triệu", slug: "price-1-2m" },
          { name: "2 - 3 Triệu", slug: "price-2-3m" },
          { name: "3 - 5 Triệu", slug: "price-3-5m" },
          { name: "Trên 5 Triệu", slug: "price-gt-5m" },
        ],
      },
    ],
  },
  6: {
    // PSU - Nguồn Máy Tính
    columns: [
      {
        title: "Chuẩn Nguồn",
        items: [
          { name: "80 Plus Standard", slug: "psu-80plus-standard" },
          { name: "80 Plus Bronze", slug: "psu-80plus-bronze" },
          { name: "80 Plus Silver", slug: "psu-80plus-silver" },
          { name: "80 Plus Gold", slug: "psu-80plus-gold" },
          { name: "80 Plus Platinum", slug: "psu-80plus-platinum" },
          { name: "80 Plus Titanium", slug: "psu-80plus-titanium" },
        ],
      },
      {
        title: "Công Suất",
        items: [
          { name: "Dưới 500W", slug: "psu-lt-500w" },
          { name: "500W - 650W", slug: "psu-500-650w" },
          { name: "650W - 750W", slug: "psu-650-750w" },
          { name: "750W - 1000W", slug: "psu-750-1000w" },
          { name: "Trên 1000W", slug: "psu-gt-1000w" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 1 Triệu", slug: "price-lt-1m" },
          { name: "1 - 2 Triệu", slug: "price-1-2m" },
          { name: "2 - 3 Triệu", slug: "price-2-3m" },
          { name: "3 - 5 Triệu", slug: "price-3-5m" },
          { name: "Trên 5 Triệu", slug: "price-gt-5m" },
        ],
      },
    ],
  },
  7: {
    // Màn Hình
    columns: [
      {
        title: "Kích Thước",
        items: [
          { name: "22 inch", slug: "monitor-22-inch" },
          { name: "24 inch", slug: "monitor-24-inch" },
          { name: "27 inch", slug: "monitor-27-inch" },
          { name: "32 inch", slug: "monitor-32-inch" },
          { name: "34 inch (Ultrawide)", slug: "monitor-34-inch" },
          { name: "Màn hình cong", slug: "monitor-curved" },
        ],
      },
      {
        title: "Theo Mức Giá",
        items: [
          { name: "Dưới 3 Triệu", slug: "price-lt-3m" },
          { name: "3 - 5 Triệu", slug: "price-3-5m" },
          { name: "5 - 10 Triệu", slug: "price-5-10m" },
          { name: "10 - 20 Triệu", slug: "price-10-20m" },
          { name: "Trên 20 Triệu", slug: "price-gt-20m" },
        ],
      },
    ],
  },
};

const MegaMenuContent = () => {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const currentContent = SUB_CATEGORIES[activeCategory];

  return (
    <div className="flex flex-col md:flex-row h-auto">
      {/* Left Column: Categories List */}
      <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 py-2 shrink-0 overflow-y-auto  scrollbar-thin scrollbar-thumb-gray-200">
        <ul>
          {categories.map((cat, idx) => (
            <li
              key={idx}
              onMouseEnter={() => setActiveCategory(idx)}
              className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-[13px] font-medium transition-all ${
                activeCategory === idx
                  ? "bg-white text-[#103E8F] shadow-sm border-l-4 border-[#103E8F]"
                  : "text-gray-600 hover:bg-white hover:text-[#103E8F]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    activeCategory === idx ? "text-[#103E8F]" : "text-gray-400"
                  }`}
                >
                  {cat.icon}
                </span>
                {cat.name}
              </div>
              {activeCategory === idx && <ChevronRight size={14} />}
            </li>
          ))}
        </ul>
      </div>

      {/* Middle Column: Dynamic Content Area */}
      <div className="flex-1 p-6 bg-white animate-in fade-in duration-200">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
          {currentContent.columns.map((col: any, idx: number) => (
            <div key={idx}>
              {col.title && (
                <h3 className="text-[#103E8F] font-bold text-sm uppercase mb-3 border-b border-gray-100 pb-2">
                  {col.title}
                </h3>
              )}
              <ul className="space-y-3">
                {col.items.map((item: MenuItem, i: number) => {
                  return (
                    <li
                      key={i}
                      className="text-sm text-gray-700 hover:text-[#103E8F] hover:translate-x-1 transition-all cursor-pointer flex items-center gap-1 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-gray-300 group-hover:bg-[#103E8F]"></span>
                      <span title={item.slug}>{item.name}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenuContent;
