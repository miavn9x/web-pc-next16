"use client";

import React, { useState, useEffect } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import type { Product } from "./types";

import { useAdminPage } from "../../contexts/AdminPageContext";
import { productService } from "./services/productService";
import { toast } from "react-toastify";

interface ProductManagerProps {
  view: "list" | "create" | "edit";
}

const ProductManager = ({ view }: ProductManagerProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { setCurrentPage } = useAdminPage();

  // ... inside component
  const handleEdit = async (productCode: string) => {
    try {
      const response = await productService.getByCode(productCode);
      // Backend returns { data: Product, ... } so we must extract .data
      setEditingProduct(response.data);
      setShowForm(true);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      toast.error("Không thể tải thông tin sản phẩm!");
    }
  };

  const handleBack = () => {
    if (view === "create") {
      setCurrentPage("products-list");
    } else {
      setShowForm(false);
      setEditingProduct(null);
    }
  };

  const handleSuccess = () => {
    if (view === "create") {
      setCurrentPage("products-list");
    } else {
      setShowForm(false);
      setEditingProduct(null);
    }
  };

  // Sync with view prop from sidebar
  useEffect(() => {
    if (view === "create") {
      setEditingProduct(null);
      setShowForm(true);
    } else if (view === "list") {
      setShowForm(false);
      setEditingProduct(null);
    }
  }, [view]);

  return (
    <div className="space-y-6">
      {/* List view */}
      {!showForm && view === "list" && <ProductList onEdit={handleEdit} />}

      {/* Form view */}
      {showForm && (
        <div>
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại danh sách
          </button>

          <ProductForm initialData={editingProduct} onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
};

export default ProductManager;
