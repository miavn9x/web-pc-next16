"use client";

import { ProductData } from "../../types";
import {
  Cpu,
  CircuitBoard,
  HardDrive,
  Zap,
  Box,
  Wind,
  ShoppingCart,
} from "lucide-react"; // Icons for specs
import { useCart } from "@/features/client/cart/context/CartContext";
import { getIconComponent } from "@/shared/components/icons/IconRegistry";

interface ProductInfoProps {
  product: ProductData;
}

// Helper to map spec keys to icons (basic mapping)
const getSpecIcon = (key: string, iconName?: string) => {
  // 1. Try to use specific icon from backend
  if (iconName) {
    const Icon = getIconComponent(iconName);
    if (Icon) return <Icon className="w-5 h-5" />;
  }

  // 2. Fallback to keyword matching
  const lowerKey = key.toLowerCase();
  if (lowerKey.includes("cpu") || lowerKey.includes("vi xử lý"))
    return <Cpu className="w-5 h-5" />;
  if (lowerKey.includes("main") || lowerKey.includes("bo mạch"))
    return <CircuitBoard className="w-5 h-5" />;
  if (lowerKey.includes("ram")) return <Box className="w-5 h-5" />;
  if (
    lowerKey.includes("storage") ||
    lowerKey.includes("ssd") ||
    lowerKey.includes("hdd")
  )
    return <HardDrive className="w-5 h-5" />;
  if (lowerKey.includes("vga") || lowerKey.includes("gpu"))
    return <Zap className="w-5 h-5" />;
  if (lowerKey.includes("cool") || lowerKey.includes("tản"))
    return <Wind className="w-5 h-5" />;
  return <Box className="w-5 h-5" />;
};

export default function ProductInfo({ product }: ProductInfoProps) {
  const { name, productCode, price, originalPrice, specs, isNewArrival } =
    product;
  const { addToCart } = useCart();

  // Format price
  const formatPrice = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  const handleAddToCart = () => {
    addToCart({
      id: productCode,
      name,
      code: productCode,
      price,
      originalPrice,
      image: product.cover?.url || "",
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isNewArrival && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                NEW ARRIVAL
              </span>
            )}
            <span className="text-gray-500 text-xs">Mã: {productCode}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
            {name}
          </h1>
        </div>

        {/* Short Description */}
        <div className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </div>

        {/* Price Section */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Giá khuyến mãi:</p>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl md:text-4xl font-black text-red-600">
              {formatPrice(price)}
            </span>
            {originalPrice > price && (
              <span className="text-lg text-gray-400 line-through font-medium">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {/* Fake Time Promo (Optional) */}
          {/* <div className="mt-2 text-sm text-red-600 font-medium flex items-center gap-1">
           <Clock className="w-4 h-4" /> Kết thúc trong 12:30:00
        </div> */}
        </div>

        {/* Short Specs */}
        <div className="grid grid-cols-1 gap-2">
          <h3 className="font-semibold text-gray-900 mb-1">
            Thông số nổi bật:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Array.isArray(specs) ? specs : [])
              .filter((s) => s.showInListing)
              .slice(0, 6)
              .map((spec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-blue-500 mt-0.5">
                    {getSpecIcon(spec.label, spec.icon)}
                  </div>
                  <div>
                    <span className="uppercase text-[10px] font-bold text-gray-400 block tracking-wider">
                      {spec.label}
                    </span>
                    <span
                      className="text-sm font-medium text-gray-700 line-clamp-1"
                      title={spec.value}
                    >
                      {spec.value}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6 justify-center">
        <button
          onClick={handleAddToCart}
          className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold py-3 px-6 rounded-full transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex flex-col items-center justify-center min-w-[180px]"
        >
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <span className="text-lg">THÊM VÀO GIỎ</span>
          </div>
          <span className="block text-[11px] font-normal opacity-80">
            Thêm vào giỏ để mua sau
          </span>
        </button>

        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md shadow-red-200 transform hover:-translate-y-0.5 min-w-[180px]">
          <span className="text-lg">MUA NGAY</span>
          <span className="block text-[11px] font-normal opacity-90">
            Giao tận nơi hoặc nhận tại cửa hàng
          </span>
        </button>
      </div>
    </div>
  );
}
