import MegaMenuContent from "./MegaMenuContent";
import {
  X,
  Menu,
  ChevronDown,
  User,
  Phone,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { categories } from "../data/categories";
import { useAuthModal } from "@/features/auth/shared/contexts/AuthModalContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { openModal } = useAuthModal();
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  lg:hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dropdown Content */}
      <div className="relative bg-white w-full h-screen shadow-2xl animate-in slide-in-from-top-5 duration-300 flex flex-col">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white sticky top-0 z-20 shadow-sm">
          <span className="font-bold text-lg text-[#103E8F] flex items-center gap-2">
            <Menu size={20} /> MENU
          </span>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="hidden md:block h-full">
            <MegaMenuContent />
          </div>

          <div className="md:hidden">
            <ul className="p-4 space-y-2">
              <li>
                <div
                  className="px-4 py-3 bg-blue-50 text-[#103E8F] font-bold rounded-xl mb-1 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-blue-100"
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                >
                  <div className="flex items-center gap-2">
                    <span>DANH MỤC SẢN PHẨM</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-200 ${
                      isCategoryExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isCategoryExpanded && (
                  <ul className="pl-2 space-y-1 mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {categories.map((cat, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:text-[#103E8F] hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-100"
                      >
                        <span className="text-[#103E8F] opacity-80">
                          {cat.icon}
                        </span>
                        <span className="font-medium">{cat.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <div className="border-t border-gray-100 my-2"></div>

              {["TRANG CHỦ", "SẢN PHẨM", "BUILD PC", "LIÊN HỆ"].map((item) => (
                <li
                  key={item}
                  className="px-4 py-3 text-gray-700 font-bold cursor-pointer hover:bg-gray-50 rounded-xl transition-colors flex items-center justify-between group active:bg-gray-100"
                >
                  {item}
                  <ChevronRight
                    size={18}
                    className="text-gray-400 group-hover:text-[#103E8F]"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 md:hidden z-20">
          <div className="text-xs text-gray-500 space-y-3 px-2">
            <p className="flex items-center gap-2.5">
              <Phone size={16} className="text-[#103E8F]" />{" "}
              <span className="font-bold text-gray-700 text-sm">1800 1234</span>{" "}
              (Miễn phí)
            </p>
            <p className="flex items-center gap-2.5">
              <MapPin size={16} className="text-[#103E8F]" /> Hệ thống cửa hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
