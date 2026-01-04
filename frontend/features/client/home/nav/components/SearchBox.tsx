import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { productService } from "@/features/client/product/services/product.service";
import { ProductData } from "@/features/client/product/types";
import { getProductImageUrl } from "@/shared/utlis/image.utils";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const SearchBox = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch results when debounced term changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await productService.getProducts({
          search: debouncedSearchTerm,
          limit: 5,
        });
        setResults(res.data);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  const handleSearch = () => {
    setShowDropdown(false);
    if (searchTerm.trim()) {
      router.push(`/product?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div
      className="flex-1 max-w-2xl relative mx-2 lg:mx-4 min-w-[150px] z-50"
      ref={dropdownRef}
    >
      <div className="flex w-full bg-gray-100 lg:bg-white rounded-sm overflow-visible shadow-inner focus-within:ring-2 focus-within:ring-blue-300 transition-all duration-300 h-9 lg:h-10 relative z-20">
        <input
          type="text"
          placeholder="Bạn tìm gì?..."
          className="w-full px-3 lg:px-4 py-2 text-gray-700 bg-transparent border-none focus:outline-none placeholder-gray-500 lg:placeholder-gray-400 text-sm"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              setResults([]);
            }}
            className="px-2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
        <button
          type="button"
          onClick={handleSearch}
          className="bg-[#D70018] lg:bg-[#1a4f9c] hover:bg-[#c90016] lg:hover:bg-[#153a72] text-white px-3 lg:px-5 py-2 transition-colors duration-300 flex items-center justify-center cursor-pointer"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Live Search Dropdown */}
      {showDropdown && searchTerm.trim() && (
        <div className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-xl border border-t-0 border-gray-100 mt-1 overflow-hidden z-10 animate-in fade-in slide-in-from-top-2 duration-200">
          {isLoading ? (
            <div className="p-4 flex items-center justify-center text-gray-500">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Đang tìm kiếm...
            </div>
          ) : results.length > 0 ? (
            <div>
              {results.map((product) => (
                <Link
                  key={product.productCode}
                  href={`/product/${product.categorySlug || "san-pham"}/${
                    product.slug
                  }`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                  onClick={() => setShowDropdown(false)}
                >
                  <div className="w-12 h-12 relative shrink-0 border border-gray-100 rounded bg-white">
                    <Image
                      src={getProductImageUrl(product.cover?.url || "")}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-red-600 text-sm font-bold">
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <span className="text-gray-400 text-xs line-through">
                            {formatCurrency(product.originalPrice)}
                          </span>
                        )}
                    </div>
                  </div>
                </Link>
              ))}
              <div
                onClick={handleSearch}
                className="block p-3 text-center text-sm text-blue-600 font-medium hover:bg-blue-50 cursor-pointer border-t border-gray-100"
              >
                Xem tất cả kết quả cho &quot;{searchTerm}&quot;
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
              <p>Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
