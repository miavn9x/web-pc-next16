import { Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

const TopBar = () => {
  return (
    <div className="hidden md:block bg-[#f5f5f5] border-b border-gray-200">
      <div className="container mx-auto px-4 h-9 flex justify-between items-center text-[12px] text-gray-500 font-medium">
        <div className="flex space-x-6">
          <span className="flex items-center hover:text-[#1a4f9c] cursor-pointer transition-colors duration-200">
            <Phone size={13} className="mr-1.5" /> Cần giúp?
          </span>
          <span className="flex items-center hover:text-[#1a4f9c] cursor-pointer transition-colors duration-200">
            <MapPin size={13} className="mr-1.5" /> Hệ thống cửa hàng
          </span>
        </div>
        <div className="hidden lg:flex space-x-6">
           {['Laptop', 'PC Gaming', 'Linh kiện', 'Phụ kiện', 'Đổi trả', 'Mất/Hư hỏng'].map((item) => (
              <Link key={item} href="#" className="hover:text-[#1a4f9c] transition-colors duration-200">{item}</Link>
           ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
