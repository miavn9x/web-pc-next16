import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getAllCategories,
  getCategoryTree,
  deleteCategory,
  updateCategory,
} from "../services/categoryService";
import type { Category } from "../types";

export const useCategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"flat" | "tree">("tree");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const [flatData, treeData] = await Promise.all([
        getAllCategories(),
        getCategoryTree(),
      ]);
      setCategories(flatData);
      setCategoryTree(treeData);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (code: string, name: string = "danh mục này") => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${name}"?\n\nLưu ý: Tất cả danh mục con cũng sẽ bị xóa.`
    );

    if (!confirmed) return;

    try {
      setDeleting(code);
      await deleteCategory(code);
      toast.success("Xóa danh mục thành công");
      await fetchCategories();
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi xóa danh mục");
    } finally {
      setDeleting(null);
    }
  };

  const flattenTree = useCallback(
    (
      tree: Category[],
      level = 0
    ): Array<Category & { displayLevel: number }> => {
      const result: Array<Category & { displayLevel: number }> = [];

      tree.forEach((cat) => {
        result.push({ ...cat, displayLevel: level });
        if (cat.children && cat.children.length > 0) {
          result.push(...flattenTree(cat.children, level + 1));
        }
      });

      return result;
    },
    []
  );

  const displayCategories =
    viewMode === "tree"
      ? flattenTree(categoryTree)
      : categories.map((c) => ({ ...c, displayLevel: 0 }));

  const handleToggleActive = async (code: string, currentStatus: boolean) => {
    try {
      await updateCategory(code, { isActive: !currentStatus });
      await fetchCategories();
      toast.success(`Đã ${currentStatus ? "ẩn" : "hiện"} danh mục`);
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  return {
    categories: displayCategories,
    categoryTree,
    loading,
    deleting,
    viewMode,
    setViewMode,
    handleDelete,
    handleToggleActive,
    refreshCategories: fetchCategories,
  };
};
