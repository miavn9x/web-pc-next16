import { Component, Cpu, HardDrive, Wrench, Monitor, Mouse, Network, Camera, Settings, FileText } from 'lucide-react';
import { categories } from '../data/categories';

const MegaMenuContent = () => {
  return (
    <div className="flex flex-col md:flex-row h-full">
        {/* Left Column: Categories List */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 py-2 shrink-0">
            <ul>
                {categories.map((cat, idx) => (
                    <li key={idx} className="px-4 py-2 hover:bg-white hover:text-[#103E8F] hover:shadow-sm cursor-pointer flex items-center gap-3 text-sm font-medium transition-all">
                        <span className="text-gray-500">{cat.icon}</span>
                        {cat.name}
                    </li>
                ))}
            </ul>
        </div>

        {/* Middle Column: Suggestions (Gợi ý cho bạn) */}
        <div className="flex-1 p-4 md:p-6 bg-white">
            <h3 className="text-[#103E8F] font-bold text-lg mb-4 flex items-center gap-2">
                🔥 Gợi ý cho bạn
            </h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 md:gap-x-8">
                <div>
                    <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">CPU Intel</h4>
                    <ul className="text-sm space-y-1 text-gray-500">
                        <li className="hover:text-[#103E8F] cursor-pointer">Theo thế hệ</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">Theo dòng</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">Theo socket</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">CPU Tray</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">CPU Xeon</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">CPU AMD</h4>
                    <ul className="text-sm space-y-1 text-gray-500">
                        <li className="hover:text-[#103E8F] cursor-pointer">Theo dòng</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">CPU Tray</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">VGA NVIDIA</h4>
                    <ul className="text-sm space-y-1 text-gray-500">
                        <li className="hover:text-[#103E8F] cursor-pointer">GeForce RTX 40 series</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">GeForce RTX 30 series</li>
                        <li className="hover:text-[#103E8F] cursor-pointer">GeForce GTX 16 series</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase">VGA AMD</h4>
                    <ul className="text-sm space-y-1 text-gray-500">
                        <li className="hover:text-[#103E8F] cursor-pointer">RX Series</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Right Column: Feature Buttons */}
        <div className="w-full md:w-56 p-4 border-l border-gray-100 flex flex-col gap-3 bg-white shrink-0">
            <div className="p-3 border border-gray-100 rounded-lg hover:shadow-md cursor-pointer transition-shadow flex items-center gap-3 bg-white">
                <div className="text-red-500"><Settings /></div>
                <span className="font-semibold text-sm">Lắp đặt phòng net</span>
            </div>
            <div className="p-3 border border-gray-100 rounded-lg hover:shadow-md cursor-pointer transition-shadow flex items-center gap-3 bg-white">
                <div className="text-blue-500"><FileText /></div>
                <span className="font-semibold text-sm">Blog / Tin tức</span>
            </div>
            <div className="p-3 border border-gray-100 rounded-lg hover:shadow-md cursor-pointer transition-shadow flex items-center gap-3 bg-white">
                <div className="text-green-500"><Wrench /></div>
                <span className="font-semibold text-sm">Xây dựng cấu hình</span>
            </div>
        </div>
    </div>
  );
};

export default MegaMenuContent;
