"use client";

import { ProductSpecs } from "../../types";

interface ProductSpecsTableProps {
  specs: ProductSpecs;
}

export default function ProductSpecsTable({ specs }: ProductSpecsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <tbody className="divide-y divide-gray-100">
          {(Array.isArray(specs) ? specs : []).map((spec, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap w-1/3 md:w-1/4 capitalize">
                {spec.label}
              </td>
              <td className="px-6 py-4 text-gray-700">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
