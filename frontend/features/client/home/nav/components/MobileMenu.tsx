import MegaMenuContent from './MegaMenuContent';
import { X, Menu, ChevronDown, User, Phone, MapPin, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { categories } from '../data/categories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full z-30 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 -z-10" onClick={onClose}></div>
      
      {/* Dropdown Content */}
      <div className="relative bg-white w-full max-h-[calc(100vh-80px)] overflow-y-auto shadow-xl border-t border-gray-100 animate-in slide-in-from-top-2 duration-200 flex flex-col">
          
          <div className="py-2 flex-1">
              {/* TABLET VIEW (iPad): Show Full Mega Menu Layout */}
              <div className="hidden md:block h-full">
                  <MegaMenuContent />
              </div>

              {/* PHONE VIEW: Show Accordion List */}
              <div className="md:hidden">
                <ul className="p-4 space-y-1">
                    {/* Product Categories Accordion */}
                    <li>
                        <div 
                                className="px-4 py-3 bg-blue-50 text-[#103E8F] font-bold rounded-md mb-1 flex items-center justify-between cursor-pointer select-none transition-colors hover:bg-blue-100"
                                onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                        >
                            <div className="flex items-center gap-2"><Menu size={18} /> DANH MỤC SẢN PHẨM</div>
                            <ChevronDown size={18} className={`transition-transform duration-200 ${isCategoryExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {/* Expanded Categories List */}
                        {isCategoryExpanded && (
                            <ul className="pl-4 pr-2 space-y-1 border-l-2 border-blue-100 ml-4 mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                                {categories.map((cat, idx) => (
                                    <li key={idx} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:text-[#103E8F] hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                                        <span className="text-gray-400 scale-75">{cat.icon}</span>
                                        <span className="font-medium">{cat.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    <div className="border-t border-gray-100 my-2"></div>

                    {['Khuyến mãi', 'Sản phẩm mới', 'Build PC', 'Tin công nghệ', 'Liên hệ'].map((item) => (
                        <li key={item} className="px-4 py-3 text-gray-700 font-medium cursor-pointer hover:bg-gray-100 rounded-md transition-colors flex items-center justify-between group">
                            {item}
                            <ChevronRight size={16} className="text-gray-400" />
                        </li>
                    ))}
                </ul>
              </div>
          </div>
          
           <div className="p-4 bg-gray-50 border-t border-gray-200 md:hidden">
              <div className="flex items-center gap-3 mb-4 text-[#103E8F] font-semibold p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 p-2 rounded-full"><User size={20} /></div>
                  <span>Đăng nhập / Đăng ký</span>
              </div>
              <div className="text-xs text-gray-500 space-y-3 px-2">
                  <p className="flex items-center gap-2.5"><Phone size={14} className="text-[#103E8F]"/> <span className="font-medium text-gray-700">1800 1234</span> (Miễn phí)</p>
                  <p className="flex items-center gap-2.5"><MapPin size={14} className="text-[#103E8F]"/> Hệ thống cửa hàng</p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default MobileMenu;
