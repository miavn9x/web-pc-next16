"use client";

const NavigationMenu = () => {
    return (
      <div className="bg-white border-b border-gray-200 shadow-sm hidden md:block relative z-20">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center h-10 text-[14px] font-medium text-gray-700">
             {['Khuyến mãi', 'Sản phẩm mới', 'Build PC', 'Tin công nghệ', 'Liên hệ'].map((item) => (
                 <li key={item} className="h-full flex items-center px-6 cursor-pointer hover:text-[#103E8F] transition-colors relative group">
                    <span className="relative z-10">{item}</span>
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#103E8F] scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                 </li>
             ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default NavigationMenu;