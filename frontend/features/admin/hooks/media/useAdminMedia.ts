// TUYỆT ĐỐI KHÔNG SỬA CODE NAY

import { mediaService } from "@/features/admin/services/media/adminMedia";
import { MediaUsageEnum } from "../../types/media/adminMedia.types";
import { useCallback, useState } from "react";

type MediaResponse<T = any> = {
  isLoading: boolean;
  error: any;
  data: T | null;
};

export function useAdminMedia() {
  // uploadSingle state
  const [uploadSingleState, setUploadSingleState] = useState<MediaResponse>({
    isLoading: false,
    error: null,
    data: null,
  });
  // uploadMultiple state
  const [uploadMultipleState, setUploadMultipleState] = useState<MediaResponse>(
    {
      isLoading: false,
      error: null,
      data: null,
    }
  );
  // hardDelete state
  const [hardDeleteState, setHardDeleteState] = useState<MediaResponse>({
    isLoading: false,
    error: null,
    data: null,
  });

  const uploadSingle = useCallback(
    async (file: File, usage: MediaUsageEnum) => {
      setUploadSingleState({ isLoading: true, error: null, data: null });
      try {
        const data = await mediaService.uploadSingle(file, usage);
        setUploadSingleState({ isLoading: false, error: null, data });
        return data;
      } catch (error) {
        setUploadSingleState({ isLoading: false, error, data: null });
        throw error;
      }
    },
    []
  );

  const uploadMultiple = useCallback(
    async (files: File[], usage: MediaUsageEnum) => {
      setUploadMultipleState({ isLoading: true, error: null, data: null });
      try {
        const data = await mediaService.uploadMultiple(files, usage);
        setUploadMultipleState({ isLoading: false, error: null, data });
        return data;
      } catch (error) {
        setUploadMultipleState({ isLoading: false, error, data: null });
        throw error;
      }
    },
    []
  );

  const hardDelete = useCallback(async (mediaCode: string) => {
    setHardDeleteState({ isLoading: true, error: null, data: null });
    try {
      const data = await mediaService.hardDelete(mediaCode);
      setHardDeleteState({ isLoading: false, error: null, data });
      return data;
    } catch (error) {
      setHardDeleteState({ isLoading: false, error, data: null });
      throw error;
    }
  }, []);

  return {
    uploadSingle,
    uploadSingleState,
    uploadMultiple,
    uploadMultipleState,
    hardDelete,
    hardDeleteState,
  };
}
