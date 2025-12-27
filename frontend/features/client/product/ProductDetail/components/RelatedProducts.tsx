"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FlashSaleProductCard from "../../../home/components/fashsale/FlashSaleProductCard";

// Mock Data matching FlashSaleProductCard props - Expanded for slider
const RELATED_PRODUCTS = [
    {
        productCode: "RP001",
        name: "PC Gaming Shark (i5 12400F / RTX 3060)",
        price: 15990000,
        originalPrice: 18500000,
        image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=400",
        discount: 15
    },
    {
        productCode: "RP002",
        name: "PC Gaming Wolf (i7 13700K / RTX 4070)",
        price: 35990000,
        originalPrice: 40000000,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=400",
        discount: 10
    },
    {
        productCode: "RP003",
        name: "Màn hình Gaming Asus TUF 27 inch",
        price: 4590000,
        originalPrice: 5200000,
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400",
        discount: 12
    },
    {
        productCode: "RP004",
        name: "Bàn phím cơ AKKO 3087 v2",
        price: 1290000,
        originalPrice: 1490000,
        image: "https://images.unsplash.com/photo-1587829741301-308231f8e865?auto=format&fit=crop&q=80&w=400",
        discount: 13
    },
    {
        productCode: "RP005",
        name: "Tai nghe Gaming HyperX Cloud II",
        price: 1890000,
        originalPrice: 2200000,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400",
        discount: 14
    },
    // Duplicate for slider demo
    {
        productCode: "RP006",
        name: "Chuột Logitech G Pro X Superlight",
        price: 2990000,
        originalPrice: 3500000,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400",
        discount: 15
    },
    {
        productCode: "RP007",
        name: "Ghế Gaming Secretlab Titan 2022",
        price: 11900000,
        originalPrice: 13500000,
        image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=400",
        discount: 12
    },
    {
        productCode: "RP008",
        name: "VGA MSI RTX 4090 Gaming X Trio",
        price: 45000000,
        originalPrice: 50000000,
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400",
        discount: 10
    },
    {
        productCode: "RP009",
        name: "Mainboard ROG Maximus Z790 Hero",
        price: 15000000,
        originalPrice: 16500000,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400",
        discount: 9
    },
    {
        productCode: "RP010",
        name: "Case Hyte Y60 White",
        price: 5500000,
        originalPrice: 6200000,
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400",
        discount: 11
    },
    {
        productCode: "RP011",
        name: "SSD Samsung 980 Pro 1TB",
        price: 2500000,
        originalPrice: 3000000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400",
        discount: 17
    },
    {
        productCode: "RP012",
        name: "RAM Corsair Vengeance RGB Pro 16GB",
        price: 1800000,
        originalPrice: 2100000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400",
        discount: 14
    },
    {
        productCode: "RP013",
        name: "Nguồn Cooler Master MWE Gold 750W",
        price: 1500000,
        originalPrice: 1750000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400",
        discount: 14
    },
    {
        productCode: "RP014",
        name: "Tản nhiệt AIO NZXT Kraken Z73",
        price: 4000000,
        originalPrice: 4500000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400",
        discount: 11
    },
    {
        productCode: "RP015",
        name: "Webcam Logitech C920",
        price: 1000000,
        originalPrice: 1200000,
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400",
        discount: 17
    }
];

export default function RelatedProducts() {
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default PC (1 row)
    const [currentPage, setCurrentPage] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Responsive Items Per Page
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setItemsPerPage(2); // Mobile
            } else if (width >= 768 && width < 1024) {
                setItemsPerPage(4); // Tablet
            } else {
                setItemsPerPage(5); // PC
            }
        };

        handleResize(); // Initial check
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalPages = Math.ceil(RELATED_PRODUCTS.length / itemsPerPage);

    const resetAutoSlide = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, 5000); // 5s auto switch
    };

    const handleNext = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
        resetAutoSlide();
    };

    const handlePrev = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
        resetAutoSlide();
    };

    // Auto-slide
    useEffect(() => {
        resetAutoSlide();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [totalPages]);

    // Reset page on resize
    useEffect(() => {
        setCurrentPage(0);
    }, [itemsPerPage]);

    const currentProducts = RELATED_PRODUCTS.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <section className="mt-12 md:mt-16">
            <div className="container mx-auto">
                {/* Unified Container with User's Background */}
                <div className="bg-[url('/banner/related-bg.jpg')] bg-cover bg-center rounded-2xl p-6 md:p-8 shadow-2xl relative z-0 group/slider">

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 -translate-x-1/2"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-10 md:w-12 md:h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center text-gray-800 hover:bg-blue-600 hover:text-white transition-all duration-300 opacity-0 group-hover/slider:opacity-100 translate-x-1/2"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Title Section */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
                        <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-wide drop-shadow-md">
                            SẢN PHẨM LIÊN QUAN
                        </h2>
                    </div>

                    {/* Products Grid - Dynamic Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 transition-all duration-500">
                        {currentProducts.map((item) => (
                            <div key={item.productCode} className="w-full animate-in fade-in duration-500 slide-in-from-right-4">
                                <FlashSaleProductCard {...item} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
