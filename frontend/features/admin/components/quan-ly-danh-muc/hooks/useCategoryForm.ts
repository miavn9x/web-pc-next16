import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { createCategory, updateCategory } from "../services/categoryService";
import type {
  CreateCategoryDto,
  Category,
  PriceRange,
  UseCategoryFormProps,
} from "../types";

export const useCategoryForm = ({
  initialData,
  onSuccess,
}: UseCategoryFormProps = {}) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: initialData?.name || "",
    priceRanges: initialData?.priceRanges || [],
    children: initialData?.children || [],
    isActive: initialData?.isActive ?? true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = useCallback(
    (field: keyof CreateCategoryDto, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === "") {
      newErrors.name = "Tên danh mục là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);

      if (isEdit && initialData) {
        const { code, ...updateData } = formData;
        await updateCategory(initialData.code, updateData);
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await createCategory(formData);
        toast.success("Tạo danh mục thành công!");

        setFormData({
          name: "",
          priceRanges: [],
          children: [],
          isActive: true,
        });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const addPriceRange = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      priceRanges: [...(prev.priceRanges || []), { label: "", min: 0, max: 0 }],
    }));
  }, []);

  const removePriceRange = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      priceRanges: prev.priceRanges?.filter((_, i) => i !== index),
    }));
  }, []);

  const updatePriceRange = useCallback(
    (index: number, field: keyof PriceRange, value: any) => {
      setFormData((prev) => ({
        ...prev,
        priceRanges: prev.priceRanges?.map((range, i) =>
          i === index ? { ...range, [field]: value } : range
        ),
      }));
    },
    []
  );

  const addChild = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      children: [
        ...(prev.children || []),
        {
          name: "",
          priceRanges: [],
          children: [],
          isActive: true,
        },
      ],
    }));
  }, []);

  const removeChild = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children?.filter((_, i) => i !== index),
    }));
  }, []);

  const updateChild = useCallback(
    (index: number, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        children: prev.children?.map((child, i) =>
          i === index ? { ...child, [field]: value } : child
        ),
      }));
    },
    []
  );

  const addChildToChild = useCallback((parentIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      children: prev.children?.map((child, i) =>
        i === parentIndex
          ? {
              ...child,
              children: [
                ...(child.children || []),
                {
                  name: "",
                  priceRanges: [],
                  children: [],
                  isActive: true,
                },
              ],
            }
          : child
      ),
    }));
  }, []);

  const removeChildFromChild = useCallback(
    (parentIndex: number, childIndex: number) => {
      setFormData((prev) => ({
        ...prev,
        children: prev.children?.map((child, i) =>
          i === parentIndex
            ? {
                ...child,
                children: child.children?.filter((_, j) => j !== childIndex),
              }
            : child
        ),
      }));
    },
    []
  );

  const updateNestedChild = useCallback(
    (parentIndex: number, childIndex: number, field: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        children: prev.children?.map((child, i) =>
          i === parentIndex
            ? {
                ...child,
                children: child.children?.map((nestedChild, j) =>
                  j === childIndex
                    ? { ...nestedChild, [field]: value }
                    : nestedChild
                ),
              }
            : child
        ),
      }));
    },
    []
  );

  return {
    formData,
    errors,
    submitting,
    isEdit,
    updateField,
    handleSubmit,
    addPriceRange,
    removePriceRange,
    updatePriceRange,
    addChild,
    removeChild,
    updateChild,
    addChildToChild,
    removeChildFromChild,
    updateNestedChild,
  };
};
