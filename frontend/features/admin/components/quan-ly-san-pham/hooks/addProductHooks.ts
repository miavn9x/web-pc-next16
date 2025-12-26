"use client";
import React, { useRef } from "react";
import { toast } from "react-toastify";
import type { ProductFormData, Variant } from "../types/addProduct.Types"; // Corrected import path
import { submitProductData } from "../services/addProductServices"; // Corrected import path

/**
 * Hook chính quản lý trạng thái và logic thêm sản phẩm
 */
export const useAddProduct = () => {
  const [productData, setProductData] = React.useState<ProductFormData>({
    nameVi: "",
    nameJa: "",
    description: {
      vi: "",
      ja: "",
    },
    categoryVi: "",
    categoryJa: "",
    minPriceVi: "",
    maxPriceVi: "",
    discountPercentVi: "0",
    minPriceJa: "",
    maxPriceJa: "",
    discountPercentJa: "0",
    cover: null,
    gallery: [],
    hasVariants: false,
    variants: [],
    error: null,
  });

  const detailImagesInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const MAX_DETAIL_IMAGES = 6;

  const categoryMap: { [key: string]: string } = {
    "banh-trang": "ライスペーパー",
    "cac-loai-kho": "乾燥食品",
    "do-an-vat": "スナック",
    "trai-cay": "フルーツ",
  };

  /**
   * Chuẩn hóa giá trị phần trăm giảm giá
   */
  const sanitizeDiscountPercent = (value: string): string => {
    if (!value || value.trim() === "") return "0";
    return value;
  };

  /**
   * Xử lý thay đổi mô tả tiếng Việt
   */
  const handleDescriptionViChange = (value: string) => {
    setProductData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        vi: value,
      },
    }));
  };

  /**
   * Xử lý thay đổi mô tả tiếng Nhật
   */
  const handleDescriptionJaChange = (value: string) => {
    setProductData((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        ja: value,
      },
    }));
  };

  /**
   * Xử lý thay đổi ảnh bìa
   */
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProductData((prev) => ({ ...prev, cover: file }));
  };

  /**
   * Xử lý thay đổi ảnh thư viện
   */
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = MAX_DETAIL_IMAGES - productData.gallery.length;
    if (files.length > remainingSlots) {
      toast.error(
        `Chỉ có thể tải lên tối đa ${MAX_DETAIL_IMAGES} hình ảnh chi tiết!`
      );
      if (detailImagesInputRef.current) {
        detailImagesInputRef.current.value = "";
      }
      return;
    }
    setProductData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, ...files],
    }));
  };

  /**
   * Xóa ảnh bìa
   */
  const handleCoverDelete = () => {
    setProductData((prev) => ({ ...prev, cover: null }));
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  };

  /**
   * Xóa ảnh thư viện theo chỉ mục
   */
  const handleGalleryImageDelete = (indexToDelete: number) => {
    setProductData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== indexToDelete),
    }));
    if (detailImagesInputRef.current) {
      detailImagesInputRef.current.value = "";
    }
  };

  /**
   * Xử lý thay đổi danh mục tiếng Việt và cập nhật tiếng Nhật
   */
  const handleCategoryViChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setProductData((prev) => ({
      ...prev,
      categoryVi: value,
      categoryJa: categoryMap[value] || "",
    }));
  };

  /**
   * Thêm một biến thể sản phẩm mới
   */
  const addVariant = () => {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000);
    const newVariant: Variant = {
      variantId: `var_${timestamp}_${randomSuffix}`,
      productCode: "",
      attributes: { size: "" },
      originalPriceVi: "",
      discountPercentVi: "0",
      originalPriceJa: "",
      discountPercentJa: "0",
    };
    setProductData((prev) => {
      const updatedData = {
        ...prev,
        variants: [...prev.variants, newVariant],
      };
      return updatedData;
    });
  };

  /**
   * Xóa một biến thể sản phẩm theo chỉ mục
   */
  const removeVariant = (index: number) => {
    setProductData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  /**
   * Cập nhật thông tin của một biến thể sản phẩm
   */
  const updateVariant = (index: number, field: string, value: string) => {
    setProductData((prev) => {
      const updatedVariants = [...prev.variants];
      if (field === "discountPercentVi" || field === "discountPercentJa") {
        value = sanitizeDiscountPercent(value);
      }
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        (updatedVariants[index] as any)[parent][child] = value;
      } else {
        (updatedVariants[index] as any)[field] = value;
      }
      return { ...prev, variants: updatedVariants };
    });
  };

  /**
   * Xử lý gửi dữ liệu form sản phẩm
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductData((prev) => ({ ...prev, error: null }));

    const sanitizedProductData: ProductFormData = {
      ...productData,
      discountPercentVi: sanitizeDiscountPercent(productData.discountPercentVi),
      discountPercentJa: sanitizeDiscountPercent(productData.discountPercentJa),
      variants: productData.variants
        ? productData.variants.map((variant) => ({
            ...variant,
            discountPercentVi: sanitizeDiscountPercent(
              variant.discountPercentVi
            ),
            discountPercentJa: sanitizeDiscountPercent(
              variant.discountPercentJa
            ),
          }))
        : [],
    };

    try {
      await submitProductData(sanitizedProductData, "");
      toast.success(
        "Sản phẩm và các biến thể (nếu có) đã được lưu thành công!"
      );
      resetForm();
    } catch (error: any) {
      const errorMessage =
        error.message ||
        "Lỗi khi lưu sản phẩm hoặc biến thể. Vui lòng thử lại.";
      setProductData((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      toast.error(errorMessage);
    }
  };

  /**
   * Đặt lại form về trạng thái ban đầu
   */
  const resetForm = () => {
    setProductData({
      nameVi: "",
      nameJa: "",
      categoryVi: "",
      categoryJa: "",
      minPriceVi: "",
      maxPriceVi: "",
      discountPercentVi: "0",
      minPriceJa: "",
      maxPriceJa: "0",
      discountPercentJa: "0",
      cover: null,
      gallery: [],
      hasVariants: false,
      variants: [],
      error: null,
      description: {
        vi: "",
        ja: "",
      },
    });
    if (detailImagesInputRef.current) {
      detailImagesInputRef.current.value = "";
    }
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  };

  return {
    productData,
    setProductData,
    detailImagesInputRef,
    coverImageInputRef,
    MAX_DETAIL_IMAGES,
    handleCoverChange,
    handleGalleryChange,
    handleCoverDelete,
    handleGalleryImageDelete,
    handleCategoryViChange,
    addVariant,
    removeVariant,
    updateVariant,
    handleSubmit,
    resetForm,
    handleDescriptionViChange,
    handleDescriptionJaChange,
  };
};
