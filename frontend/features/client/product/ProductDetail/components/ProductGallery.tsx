import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Auto-slide effect
    useEffect(() => {
        if (isModalOpen || isHovered) return;

        const interval = setInterval(() => {
            setSelectedIndex((prev) => (prev + 1) % images.length);
        }, 5000); // 5 seconds per slide

        return () => clearInterval(interval);
    }, [images.length, isModalOpen, isHovered]);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen]);

    // Handlers
    const handleNext = () => setSelectedIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
    const handleImageClick = () => setIsModalOpen(true);

    const selectedImage = images[selectedIndex];

    return (
        <div
            className="flex flex-col gap-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Image */}
            <div
                className="relative w-full aspect-square bg-white rounded-xl overflow-hidden border border-gray-100 group cursor-zoom-in"
                onClick={handleImageClick}
            >
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    priority
                />

                {/* Overlay Icon */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                    <Maximize2 className="w-10 h-10 text-white drop-shadow-lg" />
                </div>

                {/* Navigation Buttons (Optional on Desktop, helpful for mobile) */}
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mt-4">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all bg-white ${selectedIndex === index
                            ? "border-blue-600 ring-2 ring-blue-100"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <Image
                            src={img}
                            alt={`${productName} thumbnail ${index + 1}`}
                            fill
                            className="object-contain p-1"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-in fade-in duration-200">
                    <button
                        className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-50"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center p-4">
                        <Image
                            src={selectedImage}
                            alt={productName}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Modal Navigation */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Modal Thumbs */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2">
                        {images.map((img, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setSelectedIndex(index); }}
                                className={`relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${selectedIndex === index
                                    ? "border-white scale-110"
                                    : "border-transparent opacity-50 hover:opacity-100"
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt="thumb"
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
