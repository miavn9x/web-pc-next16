"use client";

import React, { useState } from "react";
import { useCategoryList } from "./hooks/useCategoryList";
import CategoryList from "./components/CategoryList";
import CategoryForm from "./components/CategoryForm";
import type { Category } from "./types";

interface CategoryManagerProps {
  view: "list" | "create" | "edit";
}

const CategoryManager = ({ view }: CategoryManagerProps) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const {
    categoryTree,
    loading,
    deleting,
    handleDelete,
    handleToggleActive,
    refreshCategories,
  } = useCategoryList();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingCategory(null);
    refreshCategories();
  };

  // Sync với view prop từ sidebar
  React.useEffect(() => {
    if (view === "create") {
      setEditingCategory(null);
      setShowForm(true);
    } else if (view === "list") {
      setShowForm(false);
      setEditingCategory(null);
    }
  }, [view]);

  return (
    <div className="space-y-6">
      {/* List view - ẨN khi đang edit */}
      {!showForm && view === "list" && (
        <CategoryList
          categories={categoryTree}
          loading={loading}
          deleting={deleting}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onRefresh={refreshCategories}
        />
      )}
      {showForm && (
        <div>
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-900 flex items-center gap-2"
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

          <CategoryForm
            initialData={editingCategory}
            onSuccess={handleSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
