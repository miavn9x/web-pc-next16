"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Variant, Media } from "../../types/product/addProduct.Types";
import {
  getProductByCode,
  updateProduct,
} from "../../services/product/editProductServices";
import { useAdminMedia } from "@/features/admin/hooks/media/useAdminMedia";
import { MediaUsageEnum } from "@/features/admin/types/media/adminMedia.types";
import { ProductFormData } from "../../types/product/editProduct.Types";

interface FormVariant extends Variant {
  formId: string;
  isNew: boolean;
}

interface EditProductFormData extends ProductFormData {
  productCode: string;
  cover: File | Media | null;
  gallery: (File | Media)[];
  variants: FormVariant[];
  // Add missing price fields to match ProductsAdd
  minPriceVi: string;
  maxPriceVi: string;
  discountPercentVi: string;
  minPriceJa: string;
  maxPriceJa: string;
  discountPercentJa: string;
}

export const useEditProduct = (productCode: string) => {
  const [productData, setProductData] = useState<EditProductFormData | null>(
    null
  );
  const [_removedVariantIds, setRemovedVariantIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_originalCoverMediaCode, setOriginalCoverMediaCode] = useState<
    string | null
  >(null);
  const [_originalGalleryMediaCodes, setOriginalGalleryMediaCodes] = useState<
    string[]
  >([]);
  const [mediaToDelete, setMediaToDelete] = useState<string[]>([]);

  const detailImagesInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const MAX_DETAIL_IMAGES = 6;

  // Use media service
  const { uploadSingle, hardDelete } = useAdminMedia();

  // Mapping danh mục: slug -> số ID cho backend
  const categorySlugToId = useMemo(
    () => ({
      "banh-trang": 1,
      "cac-loai-kho": 2,
      "do-an-vat": 3,
      "trai-cay": 4,
    }),
    []
  );

  // Mapping danh mục: số ID -> slug cho hiển thị
  const categoryIdToSlug = useMemo(
    () => ({
      1: "banh-trang",
      2: "cac-loai-kho",
      3: "do-an-vat",
      4: "trai-cay",
    }),
    []
  );

  // Mapping danh mục: slug -> tên tiếng Nhật
  const categorySlugToJa = useMemo(
    () => ({
      "banh-trang": "ライスペーパー",
      "cac-loai-kho": "乾物類",
      "do-an-vat": "スナック",
      "trai-cay": "果物",
    }),
    []
  );

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productCode) {
        setError("Mã sản phẩm không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Gọi API lấy thông tin sản phẩm
        const product = await getProductByCode(productCode);

        // Kiểm tra dữ liệu trả về
        if (!product) {
          throw new Error("Không nhận được dữ liệu sản phẩm");
        }
        if (!product.productCode) {
          throw new Error("Dữ liệu sản phẩm không có mã sản phẩm");
        }

        // Lưu mã media gốc để theo dõi việc xóa
        if (product.cover?.mediaCode) {
          setOriginalCoverMediaCode(product.cover.mediaCode);
        }
        if (product.gallery?.length > 0) {
          const galleryCodes = product.gallery
            .map((img) => img.mediaCode)
            .filter(Boolean);
          setOriginalGalleryMediaCodes(galleryCodes);
        }

        // Chuyển đổi ID danh mục thành slug
        const categoryVi =
          categoryIdToSlug[product.category as keyof typeof categoryIdToSlug] ||
          "banh-trang";

        // Chuẩn bị dữ liệu form
        const formData: EditProductFormData = {
          productCode: product.productCode,
          nameVi: product.name?.vi || "",
          nameJa: product.name?.ja || "",
          description: {
            vi: product.description?.vi || "",
            ja: product.description?.ja || "",
          },
          categoryVi: categoryVi,
          categoryJa:
            categorySlugToJa[categoryVi as keyof typeof categorySlugToJa] || "",
          // Thêm trường giá để khớp với UI
          minPriceVi: product.priceRange?.vi?.min?.toString() || "",
          maxPriceVi: product.priceRange?.vi?.max?.toString() || "",
          discountPercentVi: "0",
          minPriceJa: product.priceRange?.ja?.min?.toString() || "",
          maxPriceJa: product.priceRange?.ja?.max?.toString() || "",
          discountPercentJa: "0",
          cover: product.cover || null,
          gallery: Array.isArray(product.gallery) ? product.gallery : [],
          hasVariants:
            Array.isArray(product.variants) && product.variants.length > 0,
          // Chuyển đổi variants từ backend sang form
          variants: Array.isArray(product.variants)
            ? product.variants.map((v: any, index: number) => {
                return {
                  formId: `variant_${index}_${Date.now()}`,
                  variantId: `variant_${index}_${Date.now()}`,
                  productCode: product.productCode,
                  attributes: { size: v.label?.vi || `Variant ${index + 1}` },
                  originalPriceVi: v.price?.vi?.original?.toString() || "",
                  discountPercentVi:
                    v.price?.vi?.discountPercent?.toString() || "0",
                  originalPriceJa: v.price?.ja?.original?.toString() || "",
                  discountPercentJa:
                    v.price?.ja?.discountPercent?.toString() || "0",
                  isNew: false,
                };
              })
            : [],
          error: null,
        };

        setProductData(formData);
      } catch (error: any) {
        const errorMessage = error.message || "Lỗi khi tải dữ liệu sản phẩm";
        setError(errorMessage);
        setProductData(null);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productCode, categorySlugToJa, categoryIdToSlug]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    // Đánh dấu ảnh cũ để xóa khi thay thế
    if (file && productData?.cover && !(productData.cover instanceof File)) {
      const mediaCode = (productData.cover as Media).mediaCode;
      if (mediaCode && !mediaToDelete.includes(mediaCode)) {
        setMediaToDelete((prev) => [...prev, mediaCode]);
      }
    }

    setProductData((prev) => (prev ? { ...prev, cover: file } : prev));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots =
      MAX_DETAIL_IMAGES - (productData?.gallery.length || 0);

    // Kiểm tra giới hạn số lượng ảnh
    if (files.length > remainingSlots) {
      toast.error(
        `Chỉ có thể tải lên tối đa ${MAX_DETAIL_IMAGES} hình ảnh chi tiết!`
      );
      if (detailImagesInputRef.current) detailImagesInputRef.current.value = "";
      return;
    }

    setProductData((prev) =>
      prev ? { ...prev, gallery: [...prev.gallery, ...files] } : prev
    );
  };

  const handleCoverDelete = () => {
    // Đánh dấu ảnh cover hiện tại để xóa
    if (productData?.cover && !(productData.cover instanceof File)) {
      const mediaCode = (productData.cover as Media).mediaCode;
      if (mediaCode && !mediaToDelete.includes(mediaCode)) {
        setMediaToDelete((prev) => [...prev, mediaCode]);
      }
    }

    setProductData((prev) => (prev ? { ...prev, cover: null } : prev));
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  };

  const handleGalleryImageDelete = (indexToDelete: number) => {
    if (!productData) return;

    const imageToDelete = productData.gallery[indexToDelete];

    // Đánh dấu ảnh để xóa nếu là media cũ
    if (imageToDelete && !(imageToDelete instanceof File)) {
      const mediaCode = (imageToDelete as Media).mediaCode;
      if (mediaCode && !mediaToDelete.includes(mediaCode)) {
        setMediaToDelete((prev) => [...prev, mediaCode]);
      }
    }

    // Xóa ảnh khỏi gallery
    setProductData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        gallery: prev.gallery.filter((_, index) => index !== indexToDelete),
      };
    });

    if (detailImagesInputRef.current) detailImagesInputRef.current.value = "";
  };

  const handleCategoryViChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Cập nhật cả danh mục tiếng Việt và tiếng Nhật
    setProductData((prev) =>
      prev
        ? {
            ...prev,
            categoryVi: value,
            categoryJa:
              categorySlugToJa[value as keyof typeof categorySlugToJa] || "",
          }
        : prev
    );
  };

  const addVariant = () => {
    // Tạo variant mới với ID duy nhất
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    const newVariant: FormVariant = {
      formId: `new_${timestamp}`,
      variantId: `var_${timestamp}`,
      productCode: `var_${timestamp}_${randomSuffix}`,
      attributes: { size: "" },
      originalPriceVi: "",
      discountPercentVi: "0",
      originalPriceJa: "",
      discountPercentJa: "0",
      isNew: true,
    };
    setProductData((prev) =>
      prev ? { ...prev, variants: [...prev.variants, newVariant] } : prev
    );
  };

  const removeVariant = (index: number) => {
    // Xóa variant và lưu ID để xóa khỏi DB
    setProductData((prev) => {
      if (!prev) return prev;
      const variant = prev.variants[index];
      if (!variant.isNew && variant.variantId) {
        setRemovedVariantIds((ids) => [...ids, variant.variantId]);
      }
      return {
        ...prev,
        variants: prev.variants.filter((_, i) => i !== index),
      };
    });
  };

  const updateVariant = (index: number, field: string, value: string) => {
    // Cập nhật thông tin variant
    setProductData((prev) => {
      if (!prev) return prev;
      const updatedVariants = [...prev.variants];
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        (updatedVariants[index] as any)[parent][child] = value;
      } else {
        (updatedVariants[index] as any)[field] = value;
      }
      return { ...prev, variants: updatedVariants };
    });
  };

  const handleDescriptionViChange = (content: string) => {
    // Cập nhật mô tả tiếng Việt
    setProductData((prev) =>
      prev
        ? { ...prev, description: { ...prev.description, vi: content } }
        : prev
    );
  };

  const handleDescriptionJaChange = (content: string) => {
    // Cập nhật mô tả tiếng Nhật
    setProductData((prev) =>
      prev
        ? { ...prev, description: { ...prev.description, ja: content } }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productData) {
      return;
    }

    try {
      // Bước 1: Xóa media cũ không cần thiết
      for (const mediaCode of mediaToDelete) {
        try {
          await hardDelete(mediaCode);
        } catch  {
          // Tiếp tục xử lý dù có lỗi xóa media
        }
      }

      // Bước 2: Upload ảnh cover mới nếu có
      let coverMedia = productData.cover;
      if (coverMedia instanceof File) {
        const coverResponse = await uploadSingle(
          coverMedia,
          MediaUsageEnum.PRODUCT
        );
        coverMedia = {
          mediaCode: coverResponse.data?.mediaCode || `cover_${Date.now()}`,
          url: coverResponse.data?.url || "",
        };
      } else if (!coverMedia) {
        coverMedia = null;
      }

      // Bước 3: Upload ảnh gallery mới
      const galleryMedia = await Promise.all(
        productData.gallery.map(async (item, index) => {
          if (item instanceof File) {
            const mediaResponse = await uploadSingle(
              item,
              MediaUsageEnum.PRODUCT
            );
            return {
              mediaCode:
                mediaResponse.data?.mediaCode ||
                `gallery_${Date.now()}_${index}`,
              url: mediaResponse.data?.url || "",
            };
          }
          return item as Media;
        })
      );

      // Bước 4: Chuyển đổi variants thành format backend
      const backendVariants = productData.variants.map((variant, index) => {
        return {
          label: {
            vi: variant.attributes.size || `Variant ${index + 1}`,
            ja: variant.attributes.size || `Variant ${index + 1}`,
          },
          price: {
            vi: {
              original: parseInt(variant.originalPriceVi) || 0,
              discountPercent: parseInt(variant.discountPercentVi) || 0,
            },
            ja: {
              original: parseInt(variant.originalPriceJa) || 0,
              discountPercent: parseInt(variant.discountPercentJa) || 0,
            },
          },
        };
      });

      // Bước 5: Chuẩn bị payload cho API
      const updatePayload: any = {
        name: {
          vi: productData.nameVi,
          ja: productData.nameJa,
        },
        description: productData.description,
        // Chuyển slug danh mục thành số ID
        category:
          categorySlugToId[
            productData.categoryVi as keyof typeof categorySlugToId
          ] || 1,
      };

      // Thêm cover nếu có
      if (coverMedia) {
        updatePayload.cover = coverMedia;
      }

      // Thêm gallery nếu có
      if (galleryMedia.length > 0) {
        updatePayload.gallery = galleryMedia;
      }

      // Thêm variants nếu có
      if (backendVariants.length > 0) {
        updatePayload.variants = backendVariants;
      }

      // Bước 6: Gửi request cập nhật sản phẩm
      await updateProduct(productData.productCode, updatePayload);

      toast.success("Sản phẩm đã được cập nhật thành công!");

      // Bước 7: Reset các state theo dõi
      setRemovedVariantIds([]);
      setMediaToDelete([]);

      // Bước 8: Refresh dữ liệu sản phẩm
      const updatedProduct = await getProductByCode(productData.productCode);
      if (updatedProduct) {
        // Cập nhật state theo dõi media mới
        if (updatedProduct.cover?.mediaCode) {
          setOriginalCoverMediaCode(updatedProduct.cover.mediaCode);
        }
        if (updatedProduct.gallery?.length > 0) {
          const galleryCodes = updatedProduct.gallery
            .map((img) => img.mediaCode)
            .filter(Boolean);
          setOriginalGalleryMediaCodes(galleryCodes);
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi cập nhật sản phẩm");
      throw error; // Re-throw để component xử lý
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
    handleDescriptionViChange,
    handleDescriptionJaChange,
    loading,
    error,
    mediaToDelete, // Export for debugging
  };
};
