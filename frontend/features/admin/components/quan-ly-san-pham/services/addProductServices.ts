// addProductServices.ts
import type {
  ProductFormData,
  Variant,
  Media,
} from "../types/addProduct.Types";
import { mediaService } from "@/features/admin/components/media/services/adminMedia";
import { MediaUsageEnum } from "@/features/admin/components/media/types/adminMedia.types";
import axiosInstance from "@/shared/lib/axios"; // Import axiosInstance
import axios from "axios"; // Import axios for type checking AxiosError

// Lấy thông báo lỗi từ đối tượng lỗi
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  // Check if it's an AxiosError and try to extract message from response data
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return "An unknown error occurred";
};

// Ánh xạ phản hồi media thành đối tượng Media
const mapToMedia = (mediaResponse: any): Media => {
  // Handle null/undefined response
  if (!mediaResponse) {
    throw new Error("Media response is null or undefined");
  }
  let mediaData = null;
  // Try different response structures
  if (mediaResponse?.mediaCode && mediaResponse?.url) {
    mediaData = mediaResponse;
  } else if (mediaResponse?.data?.mediaCode && mediaResponse?.data?.url) {
    mediaData = mediaResponse.data;
  } else if (mediaResponse?.result?.mediaCode && mediaResponse?.result?.url) {
    mediaData = mediaResponse.result;
  } else if (Array.isArray(mediaResponse) && mediaResponse[0]?.mediaCode) {
    mediaData = mediaResponse[0];
  }
  // ✅ BUG FIX: Better validation
  if (!mediaData || !mediaData.mediaCode || !mediaData.url) {
    throw new Error(
      `Media service response invalid. Expected {mediaCode, url}, got: ${JSON.stringify(
        mediaResponse
      )}`
    );
  }
  return {
    mediaCode: mediaData.mediaCode,
    url: mediaData.url,
  };
};

// Ánh xạ phản hồi media thành mảng các đối tượng Media
const mapToMediaArray = (mediaResponse: any): Media[] => {
  // Handle null/undefined/empty response
  if (!mediaResponse) {
    return [];
  }
  // Handle direct array
  if (Array.isArray(mediaResponse)) {
    if (mediaResponse.length === 0) {
      return [];
    }
    return mediaResponse.map(mapToMedia);
  }
  // Handle nested arrays
  if (Array.isArray(mediaResponse?.data)) {
    return mediaResponse.data.length > 0
      ? mediaResponse.data.map(mapToMedia)
      : [];
  }
  if (Array.isArray(mediaResponse?.results)) {
    return mediaResponse.results.length > 0
      ? mediaResponse.results.map(mapToMedia)
      : [];
  }
  // Handle single item wrapped in response
  try {
    return [mapToMedia(mediaResponse)];
  } catch (error) {
    return [];
  }
};

// Gửi dữ liệu sản phẩm lên API
export const addProduct = async (productData: any): Promise<any> => {
  try {
    const response = await axiosInstance.post("/products", productData);
    return response.data; // Axios automatically parses JSON and throws for non-2xx status codes
  } catch (error: any) {
    const errorMessage = getErrorMessage(error);
    throw new Error(errorMessage);
  }
};

// Lấy ID danh mục từ tên tiếng Việt
const getCategoryId = (categoryVi: string): number => {
  const categoryMap: { [key: string]: number } = {
    "banh-trang": 1,
    "cac-loai-kho": 2,
    "do-an-vat": 3,
    "trai-cay": 4,
  };
  const categoryId = categoryMap[categoryVi];
  if (categoryId === undefined) {
    return 1;
  }
  return categoryId;
};

// Chuẩn hóa giá trị phần trăm giảm giá
const sanitizeDiscountPercent = (value: string | undefined): number => {
  if (!value || value.trim() === "") {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  if (isNaN(parsed)) {
    return 0;
  }
  // Ensure discount is between 0-100
  return Math.max(0, Math.min(100, parsed));
};

// Chuẩn hóa giá sản phẩm
const sanitizePrice = (value: string | undefined): number => {
  if (!value || value.trim() === "") {
    return 0;
  }
  const parsed = Number.parseInt(value, 10);
  if (isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return parsed;
};

// Hàm chính xử lý toàn bộ quá trình gửi dữ liệu sản phẩm
export const submitProductData = async (
  productData: ProductFormData,
  _parentProductCode: string // Kept for backward compatibility but unused
): Promise<void> => {
  // ✅ BUG FIX: More comprehensive validation
  const validationErrors: string[] = [];
  if (!productData.nameVi?.trim())
    validationErrors.push("Tên sản phẩm (VN) là bắt buộc");
  if (!productData.nameJa?.trim())
    validationErrors.push("Tên sản phẩm (JA) là bắt buộc");
  if (!productData.categoryVi?.trim())
    validationErrors.push("Danh mục (VN) là bắt buộc");
  if (!productData.categoryJa?.trim())
    validationErrors.push("Danh mục (JA) là bắt buộc");
  if (!productData.cover) validationErrors.push("Hình ảnh chính là bắt buộc");
  if (validationErrors.length > 0) {
    throw new Error(`Validation errors: ${validationErrors.join(", ")}`);
  }

  // ✅ STEP 1: Upload cover image (REQUIRED)
  let coverMedia: Media;
  try {
    const coverResponse = await mediaService.uploadSingle(
      productData.cover!,
      MediaUsageEnum.PRODUCT
    );
    coverMedia = mapToMedia(coverResponse);
  } catch (error) {
    throw new Error("Lỗi khi upload ảnh cover: " + getErrorMessage(error));
  }

  // ✅ STEP 2: Upload gallery images (OPTIONAL)
  let galleryMedia: Media[] = [];
  if (productData.gallery && productData.gallery.length > 0) {
    try {
      const galleryResponse = await mediaService.uploadMultiple(
        productData.gallery,
        MediaUsageEnum.PRODUCT
      );
      galleryMedia = mapToMediaArray(galleryResponse);
    } catch (error) {
      // ✅ BUG FIX: Don't fail the entire process for gallery upload errors
      galleryMedia = [];
    }
  }

  // ✅ STEP 3: Process variants according to API documentation
  const variants: any[] = [];
  if (
    productData.hasVariants &&
    productData.variants &&
    productData.variants.length > 0
  ) {
    productData.variants.forEach((variant: Variant, index: number) => {
      // ✅ BUG FIX: Handle missing variant data gracefully
      if (!variant) {
        return;
      }
      // ✅ Create variant matching EXACT API format
      const apiVariant = {
        label: {
          vi: variant.attributes?.size?.trim() || `Phiên bản ${index + 1}`,
          ja: variant.attributes?.size?.trim() || `バージョン${index + 1}`,
        },
        price: {
          vi: {
            original: sanitizePrice(variant.originalPriceVi),
            discountPercent: sanitizeDiscountPercent(variant.discountPercentVi),
          },
          ja: {
            original: sanitizePrice(variant.originalPriceJa),
            discountPercent: sanitizeDiscountPercent(variant.discountPercentJa),
          },
        },
      };
      variants.push(apiVariant);
    });
    // ✅ BUG FIX: Ensure at least one variant exists after processing
    if (variants.length === 0) {
    }
  }

  // ✅ Create default variant if no variants or all variants were invalid
  if (variants.length === 0) {
    // ✅ BUG FIX: Use maxPrice first, fallback to minPrice, then 0
    const defaultPriceVi =
      sanitizePrice(productData.maxPriceVi) ||
      sanitizePrice(productData.minPriceVi) ||
      0;
    const defaultPriceJa =
      sanitizePrice(productData.maxPriceJa) ||
      sanitizePrice(productData.minPriceJa) ||
      0;
    const defaultVariant = {
      label: {
        vi: "Mặc định",
        ja: "デフォルト",
      },
      price: {
        vi: {
          original: defaultPriceVi,
          discountPercent: sanitizeDiscountPercent(
            productData.discountPercentVi
          ),
        },
        ja: {
          original: defaultPriceJa,
          discountPercent: sanitizeDiscountPercent(
            productData.discountPercentJa
          ),
        },
      },
    };
    variants.push(defaultVariant);
  }

  // ✅ STEP 4: Create product payload in EXACT API format
  const productPayload = {
    // ✅ EXACT MATCH: category as number ID
    category: getCategoryId(productData.categoryVi),
    // ✅ EXACT MATCH: name object with vi/ja
    name: {
      vi: productData.nameVi.trim(),
      ja: productData.nameJa.trim(),
    },
    // ✅ EXACT MATCH: description object with vi/ja (can be empty strings)
    description: {
      vi: productData.description?.vi?.trim() || "",
      ja: productData.description?.ja?.trim() || "",
    },
    // ✅ EXACT MATCH: gallery as array of media objects
    gallery: galleryMedia,
    // ✅ EXACT MATCH: cover as single media object
    cover: coverMedia,
    // ✅ EXACT MATCH: variants array with label and price structure
    variants: variants,
  };

  // ✅ STEP 5: Send to API using the updated addProduct (which now uses axiosInstance)
  try {
    await addProduct(productPayload);
  } catch (error) {
    throw new Error("Lỗi khi lưu sản phẩm: " + getErrorMessage(error));
  }
};
