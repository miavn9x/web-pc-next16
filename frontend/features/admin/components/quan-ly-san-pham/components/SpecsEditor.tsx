"use client";

import React from "react";
import type { ProductSpec } from "../types";

interface SpecsEditorProps {
  specs: ProductSpec[];
  onChange: (specs: ProductSpec[]) => void;
}

const SpecsEditor = ({ specs, onChange }: SpecsEditorProps) => {
  const handleAdd = () => {
    const newSpec: ProductSpec = {
      label: "",
      value: "",
      order: specs.length + 1,
      showInListing: false,
    };
    onChange([...specs, newSpec]);
  };

  const handleRemove = (index: number) => {
    const updated = specs.filter((_, i) => i !== index);
    // Recalculate order
    const reordered = updated.map((spec, i) => ({ ...spec, order: i + 1 }));
    onChange(reordered);
  };

  const handleUpdate = (
    index: number,
    field: keyof ProductSpec,
    value: any
  ) => {
    const updated = [...specs];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...specs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Recalculate order
    const reordered = updated.map((spec, i) => ({ ...spec, order: i + 1 }));
    onChange(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === specs.length - 1) return;
    const updated = [...specs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    // Recalculate order
    const reordered = updated.map((spec, i) => ({ ...spec, order: i + 1 }));
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">
          Thông số kỹ thuật ({specs.length})
        </h4>
        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Thêm thông số
        </button>
      </div>

      {specs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm">Chưa có thông số nào</p>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Thêm thông số đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {/* Order controls */}
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Di chuyển lên"
                >
                  ↑
                </button>
                <span className="px-2 py-1 text-xs text-center text-gray-600 font-medium">
                  {spec.order}
                </span>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === specs.length - 1}
                  className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Di chuyển xuống"
                >
                  ↓
                </button>
              </div>

              {/* Inputs */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) =>
                      handleUpdate(index, "label", e.target.value)
                    }
                    placeholder="Tên thuộc tính (VD: CPU, RAM...)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <textarea
                    value={spec.value}
                    onChange={(e) =>
                      handleUpdate(index, "value", e.target.value)
                    }
                    placeholder="Giá trị (VD: Intel Core i9-13900K...)"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
              </div>

              {/* Checkbox & Delete */}
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={spec.showInListing}
                    onChange={(e) =>
                      handleUpdate(index, "showInListing", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700 whitespace-nowrap">
                    Hiện trong DS
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      {specs.length > 0 && (
        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="font-medium text-blue-700 mb-1">💡 Hướng dẫn:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-600">
            <li>
              Thông số với "Hiện trong DS" sẽ hiển thị trong danh sách sản phẩm
            </li>
            <li>Thứ tự hiển thị theo số thứ tự (1, 2, 3...)</li>
            <li>Tất cả thông số đều hiển thị trong trang chi tiết</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SpecsEditor;
