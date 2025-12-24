import React from 'react';
import FilterSidebar from './FilterSidebar';

export default function ProductListing() {
  return (
    <div className="container mx-auto p-4 flex gap-4">
        <aside className="w-1/4">
            <FilterSidebar />
        </aside>
        <main className="w-3/4">
             <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
             <p>Danh sách sản phẩm đang được cập nhật...</p>
             {/* Placeholder for product grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="border p-4 rounded shadow">
                        <div className="h-40 bg-gray-200 mb-2"></div>
                        <h3 className="font-semibold">Sản phẩm mẫu {item}</h3>
                        <p className="text-red-500 font-bold">100.000đ</p>
                    </div>
                ))}
             </div>
        </main>
    </div>
  );
}
