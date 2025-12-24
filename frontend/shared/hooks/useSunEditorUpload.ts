"use client";
import { useCallback } from "react";
import { mediaService } from "@/features/admin/services/media/adminMedia";
import { MediaUsageEnum } from "@/features/admin/types/media/adminMedia.types";

export function useSunEditorUpload() {
  const handleImageUpload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const result = await mediaService.uploadSingle(
          file,
          MediaUsageEnum.POST
        );
        // console.log("📦 Upload response:", result);
        let url = result?.data?.url || result?.url;
        if (!url) {
          return null;
        }

        // ✅ Trích xuất pathname từ URL tuyệt đối để luôn có đường dẫn tương đối
        try {
          const urlObj = new URL(url);
          url = urlObj.pathname; // Ví dụ: "/uploads/2025/08/..."
        } catch (e) {
          // Nếu URL không phải là URL tuyệt đối hợp lệ (ví dụ: đã là đường dẫn tương đối),
          // chúng ta giả định nó đã ở định dạng tương đối mong muốn.
     
        }

        return url; // Trả về đường dẫn tương đối
      } catch (error) {
        return null;
      }
    },
    []
  );

  return { handleImageUpload };
}
