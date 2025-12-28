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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-medium text-gray-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
            {specs.length}
          </span>
          Thông số kỹ thuật
        </h4>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm thông số
        </button>
      </div>

      {specs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-sm mb-3">
            Sản phẩm này chưa có thông số kỹ thuật nào
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline underline-offset-2"
          >
            Thêm thông số đầu tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
            >
              {/* Order controls */}
              <div className="flex flex-col items-center gap-1 min-w-[32px]">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                  {spec.order}
                </div>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === specs.length - 1}
                  className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              {/* Inputs */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) =>
                      handleUpdate(index, "label", e.target.value)
                    }
                    placeholder="Tên (VD: CPU)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      handleUpdate(index, "value", e.target.value)
                    }
                    placeholder="Giá trị (VD: Core i5)"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow shadow-sm"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-3 min-w-[120px]">
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={spec.showInListing}
                      onChange={(e) =>
                        handleUpdate(index, "showInListing", e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                    Hiện trong DS
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="w-full px-3 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 group"
                >
                  <svg
                    className="w-4 h-4 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h5 className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-2">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Hướng dẫn cấu hình
        </h5>
        <ul className="space-y-1.5 text-xs text-blue-700 pl-7 list-disc">
          <li>
            <span className="font-semibold">Show in List (Hiện trong DS):</span>{" "}
            Nếu bật, thông số này sẽ hiển thị ngay ở danh sách sản phẩm bên
            ngoài (tối đa 3-4 thông số chính).
          </li>
          <li>
            <span className="font-semibold">Sắp xếp:</span> Sử dụng mũi tên
            lên/xuống để thay đổi thứ tự hiển thị ưu tiên.
          </li>
          <li>
            Tất cả thông số sẽ luôn hiển thị đầy đủ trong trang chi tiết sản
            phẩm.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SpecsEditor;
