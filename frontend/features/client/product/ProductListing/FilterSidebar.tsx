import React from 'react';

export default function FilterSidebar() {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="font-bold mb-3">Bộ lọc</h3>
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Danh mục</h4>
        <ul className="space-y-1 text-sm">
          <li><label><input type="checkbox" /> Bánh tráng trộn</label></li>
          <li><label><input type="checkbox" /> Bánh tráng cuốn</label></li>
          <li><label><input type="checkbox" /> Topping</label></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Giá</h4>
        <input type="range" className="w-full" />
      </div>
    </div>
  );
}
