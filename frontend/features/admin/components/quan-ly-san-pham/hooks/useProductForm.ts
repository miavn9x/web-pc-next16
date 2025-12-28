// Hook for Product Form management

import { useState, useCallback } from "react";
import { productService } from "../services/productService";
import { useAdminMedia } from "../../media/hooks/useAdminMedia";
import { MediaUsageEnum } from "../../media/types/adminMedia.types";
import { toast } from "react-toastify";
import type {
  Product,
  ProductFormData,
  ProductSpec,
  MediaItem,
} from "../types";

interface UseProductFormProps {
  initialData?: Product | null;
  onSuccess?: () => void;
}

export function useProductForm({
  initialData,
  onSuccess,
}: UseProductFormProps) {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    categoryCode: initialData?.categoryCode || "",
    brand: initialData?.brand || "",
    price: initialData?.price || 0,
    originalPrice: initialData?.originalPrice || undefined,
    discount: initialData?.discount || undefined,
    cover: initialData?.cover || undefined,
    gallery: initialData?.gallery || [],
    specs: initialData?.specs || [],
    description: initialData?.description || "",
    isActive: initialData?.isActive ?? true,
    isFeatured: initialData?.isFeatured ?? false,
    isBuildPc: initialData?.isBuildPc ?? false, // New flag
    content: initialData?.content || "",
    filters: initialData?.filters || {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const { uploadSingle, uploadMultiple, hardDelete } = useAdminMedia();

  const updateField = useCallback(
    (field: string, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error when field is updated
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên sản phẩm là bắt buộc";
    }

    if (!formData.categoryCode) {
      newErrors.categoryCode = "Danh mục là bắt buộc";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
    }

    if (formData.originalPrice && formData.originalPrice < formData.price) {
      newErrors.originalPrice = "Giá gốc phải lớn hơn hoặc bằng giá bán";
    }

    if (
      formData.discount &&
      (formData.discount < 0 || formData.discount > 100)
    ) {
      newErrors.discount = "Giảm giá phải từ 0-100%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warn("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit && initialData) {
        await productService.update(initialData.productCode, formData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.create(formData);
        toast.success("Tạo sản phẩm thành công!");
      }
      onSuccess?.();
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast.error(error.message || "Lỗi khi lưu sản phẩm!");
    } finally {
      setSubmitting(false);
    }
  };

  // Media upload handlers
  const handleCoverUpload = async (file: File) => {
    try {
      const result = await uploadSingle(file, MediaUsageEnum.PRODUCT);
      const coverData: MediaItem = {
        url: result.data.url,
        mediaCode: result.data.mediaCode,
      };
      updateField("cover", coverData);
    } catch (error) {
      console.error("Failed to upload cover:", error);
      toast.error("Upload ảnh đại diện thất bại!");
    }
  };

  const handleCoverDelete = async () => {
    if (!formData.cover) return;

    try {
      await hardDelete(formData.cover.mediaCode);
      updateField("cover", undefined);
    } catch (error) {
      console.error("Failed to delete cover:", error);
      toast.error("Xóa ảnh đại diện thất bại!");
    }
  };

  const handleGalleryUpload = async (files: File[]) => {
    try {
      const results = await uploadMultiple(files, MediaUsageEnum.PRODUCT);
      const newImages: MediaItem[] = results.data.map((item: any) => ({
        url: item.url,
        mediaCode: item.mediaCode,
      }));
      updateField("gallery", [...formData.gallery, ...newImages]);
    } catch (error) {
      console.error("Failed to upload gallery:", error);
      toast.error("Upload thư viện ảnh thất bại!");
    }
  };

  const handleGalleryDelete = async (mediaCode: string) => {
    try {
      await hardDelete(mediaCode);
      updateField(
        "gallery",
        formData.gallery.filter((item) => item.mediaCode !== mediaCode)
      );
    } catch (error) {
      console.error("Failed to delete from gallery:", error);
      toast.error("Xóa ảnh thất bại!");
    }
  };

  // Specs handler
  const handleSpecsChange = (specs: ProductSpec[]) => {
    updateField("specs", specs);
  };

  return {
    formData,
    errors,
    submitting,
    isEdit,
    updateField,
    handleSubmit,
    handleCoverUpload,
    handleCoverDelete,
    handleGalleryUpload,
    handleGalleryDelete,
    handleSpecsChange,
  };
}
