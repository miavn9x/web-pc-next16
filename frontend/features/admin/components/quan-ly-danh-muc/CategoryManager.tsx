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
      {!showForm && (
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
