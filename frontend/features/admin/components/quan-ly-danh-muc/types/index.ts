/**
 * Category Module Type Definitions
 * Centralized type definitions for category management
 */

// ============= Core Types =============

export interface PriceRange {
  label: string;
  min: number;
  max: number;
}

export interface Category {
  _id?: string;
  code: string;
  name: string;
  slug: string;
  icon?: string; // Icon name
  priceRanges?: PriceRange[];
  children?: Category[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ============= DTO Types =============

export interface CreateCategoryDto {
  code?: string;
  name: string;
  icon?: string;
  priceRanges?: PriceRange[];
  children?: CreateCategoryDto[];
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  icon?: string;
  priceRanges?: PriceRange[];
  children?: CreateCategoryDto[];
  isActive?: boolean;
}

// ============= Component Props =============

export interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  deleting: string | null;
  onEdit: (category: Category) => void;
  onDelete: (code: string, name: string) => void;
  onToggleActive: (code: string, currentStatus: boolean) => void;
  onRefresh?: () => void;
}

export interface CategoryFormProps {
  initialData?: Category | null;
  onSuccess?: () => void;
}

// ============= Hook Types =============

export interface UseCategoryFormProps {
  initialData?: Category | null;
  onSuccess?: () => void;
}

export interface UseCategoryListReturn {
  categories: Array<Category & { displayLevel: number }>;
  categoryTree: Category[];
  loading: boolean;
  deleting: string | null;
  viewMode: "flat" | "tree";
  setViewMode: (mode: "flat" | "tree") => void;
  handleDelete: (code: string, name?: string) => Promise<void>;
  handleToggleActive: (code: string, currentStatus: boolean) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

export interface UseCategoryFormReturn {
  formData: CreateCategoryDto;
  submitting: boolean;
  errors: Record<string, string>;
  isEdit: boolean;
  updateField: (field: keyof CreateCategoryDto, value: any) => void;
  handleSubmit: () => Promise<void>;
  // Price ranges
  addPriceRange: () => void;
  removePriceRange: (index: number) => void;
  updatePriceRange: (
    index: number,
    field: keyof PriceRange,
    value: any
  ) => void;
  // Children (Level 1)
  addChild: () => void;
  removeChild: (index: number) => void;
  updateChild: (index: number, field: string, value: any) => void;
  // Nested children (Level 2+)
  addChildToChild: (parentIndex: number) => void;
  removeChildFromChild: (parentIndex: number, childIndex: number) => void;
  updateNestedChild: (
    parentIndex: number,
    childIndex: number,
    field: string,
    value: any
  ) => void;
}

// ============= Utility Types =============

export type CategoryWithLevel = Category & { displayLevel: number };
export type ViewMode = "flat" | "tree";
export type SortBy = "name" | "date";
export type FilterActive = "all" | "active" | "inactive";
