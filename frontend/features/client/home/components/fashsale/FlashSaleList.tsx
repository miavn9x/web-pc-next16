"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FlashSaleProductCard from "./FlashSaleProductCard";

// Mock Data with 20 items and productCode
const FLASH_SALE_PRODUCTS = [
  // Page 1
  {
    productCode: "SP001",
    name: "Bộ Router Wifi D-Link DIR-612 Wireless (2 Anten)",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80&w=400&h=400",
    price: 199000,
    originalPrice: 245000,
    discount: 19,
  },
  {
    productCode: "SP002",
    name: "Tản nhiệt khí CPU Leopard A200 Plus - Đen | Fan 92mm",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400",
    price: 99000,
    originalPrice: 119000,
    discount: 17,
  },
  {
    productCode: "SP003",
    name: "Chuột Không Dây Dare-U LM106G - Black",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=400&h=400",
    price: 39000,
    originalPrice: 89000,
    discount: 56,
  },
  {
    productCode: "SP004",
    name: "Webcam VSP AI HD-2K FullHD",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=400",
    price: 199000,
    originalPrice: 343000,
    discount: 42,
  },
  {
    productCode: "SP005",
    name: "Ram 4 8G Bus 3200 SSTC AMD/Intel (U3200A-C22-8GB)",
    image:
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=400&h=400",
    price: 1199000,
    originalPrice: 1250000,
    discount: 4,
  },
  {
    productCode: "SP006",
    name: "Ram 5 16GB (16x1) Bus 5600 Kingston Fury Beast...",
    image:
      "https://images.unsplash.com/photo-1628733358055-16d860d84c37?auto=format&fit=crop&q=80&w=400&h=400",
    price: 4050000,
    originalPrice: 4090000,
    discount: 1,
  },
  {
    productCode: "SP007",
    name: "Ram Laptop Kingston 4GB DDR4 2666Mhz...",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400",
    price: 279000,
    originalPrice: 290000,
    discount: 4,
  },
  {
    productCode: "SP008",
    name: "Fan Case Amchoice 120 Led ARGB",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400&h=400",
    price: 49000,
    originalPrice: 99000,
    discount: 51,
  },
  {
    productCode: "SP009",
    name: "Ssd Sstc 512G M110 Sata Iii (Ms-M110-512T)",
    image:
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=400&h=400",
    price: 1290000,
    originalPrice: 1350000,
    discount: 4,
  },
  {
    productCode: "SP010",
    name: "Ram PNY XLR8 8GB DDR4 3200MHz (MD8GD4320016XR)",
    image:
      "https://images.unsplash.com/photo-1555617778-dc29ab0101d3?auto=format&fit=crop&q=80&w=400&h=400",
    price: 1250000,
    originalPrice: 1290000,
    discount: 3,
  },
  // Page 2 (Mock Data)
  {
    productCode: "SP011",
    name: "Màn hình Gaming Asus TUF 27 inch 165Hz",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400",
    price: 4590000,
    originalPrice: 5200000,
    discount: 12,
  },
  {
    productCode: "SP012",
    name: "Bàn phím cơ AKKO 3087 v2 DS Horizon",
    image:
      "https://images.unsplash.com/photo-1587829741301-308231f8e865?auto=format&fit=crop&q=80&w=400&h=400",
    price: 1290000,
    originalPrice: 1490000,
    discount: 13,
  },
  {
    productCode: "SP013",
    name: "Tai nghe Gaming HyperX Cloud II",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400&h=400",
    price: 1890000,
    originalPrice: 2200000,
    discount: 14,
  },
  {
    productCode: "SP014",
    name: "VGA Gigabyte RTX 3060 Gaming OC 12G VGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12GVGA Gigabyte RTX 3060 Gaming OC 12G",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400",
    price: 8990000,
    originalPrice: 9990000,
    discount: 10,
  },
  {
    productCode: "SP015",
    name: "Mainboard MSI B560M PRO-E",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400&h=400",
    price: 2190000,
    originalPrice: 2490000,
    discount: 12,
  },
  {
    productCode: "SP016",
    name: "CPU Intel Core i5-11400F",
    image:
      "https://images.unsplash.com/photo-1555617778-dc29ab0101d3?auto=format&fit=crop&q=80&w=400&h=400",
    price: 2990000,
    originalPrice: 3290000,
    discount: 9,
  },
  {
    productCode: "SP017",
    name: "Nguồn máy tính Corsair CV650 650W",
    image:
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400",
    price: 1190000,
    originalPrice: 1390000,
    discount: 14,
  },
  {
    productCode: "SP018",
    name: "Vỏ Case Xigmatek Gaming X 3F",
    image:
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=400&h=400",
    price: 890000,
    originalPrice: 990000,
    discount: 10,
  },
  {
    productCode: "SP019",
    name: "Ổ cứng HDD Seagate Barracuda 1TB",
    image:
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=400&h=400",
    price: 990000,
    originalPrice: 1190000,
    discount: 17,
  },
  {
    productCode: "SP020",
    name: "Ghế Gaming Warrior WGC102",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bbcbf?auto=format&fit=crop&q=80&w=400&h=400",
    price: 2590000,
    originalPrice: 3190000,
    discount: 19,
  },
];

export default function FlashSaleList() {
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default PC
  const [currentPage, setCurrentPage] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive Items Per Page
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerPage(4); // Mobile (2 cols x 2 rows)
      } else if (width >= 768 && width < 1024) {
        setItemsPerPage(8); // Tablet (4 cols x 2 rows)
      } else {
        setItemsPerPage(10); // PC (5 cols x 2 rows)
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(FLASH_SALE_PRODUCTS.length / itemsPerPage);

  const resetAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 10000);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
    resetAutoSlide();
  };

  const handlePrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    resetAutoSlide();
  };

  // Auto-slide 10s
  useEffect(() => {
    resetAutoSlide();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]); // Dependencies: updates when totalPages changes (e.g. resize)

  // Reset page on resize to prevent empty views
  useEffect(() => {
    setCurrentPage(0);
  }, [itemsPerPage]);

  const currentProducts = FLASH_SALE_PRODUCTS.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="relative group/slider mt-8">
      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100"
        aria-label="Next page"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-y-6 lg:gap-x-4">
        {currentProducts.map((product) => (
          <div key={product.productCode} className="w-full">
            <FlashSaleProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
