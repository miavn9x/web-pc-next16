import { Search } from 'lucide-react';

const SearchBox = () => {
  return (
    <div className="flex-1 max-w-2xl relative mx-2 lg:mx-4 min-w-[150px]">
        <div className="flex w-full bg-gray-100 lg:bg-white rounded-sm overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-blue-300 transition-all duration-300 h-9 lg:h-10">
            <input
            type="text"
            placeholder="Bạn tìm gì?..."
            className="w-full px-3 lg:px-4 py-2 text-gray-700 bg-transparent border-none focus:outline-none placeholder-gray-500 lg:placeholder-gray-400 text-sm"
            />
            <button type="button" className="bg-[#D70018] lg:bg-[#1a4f9c] hover:bg-[#c90016] lg:hover:bg-[#153a72] text-white px-3 lg:px-5 py-2 transition-colors duration-300 flex items-center justify-center">
            <Search size={18} />
            </button>
        </div>
    </div>
  );
};

export default SearchBox;
