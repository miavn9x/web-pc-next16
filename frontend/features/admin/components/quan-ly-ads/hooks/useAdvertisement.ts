import { useState, useEffect, useCallback } from "react";
import {
  advertisementService,
  Advertisement,
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
  AdvertisementPosition,
} from "../services/advertisementService";

export const useAdvertisement = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await advertisementService.getAdvertisements();
      setAds(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải quảng cáo"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createAd = async (data: CreateAdvertisementDto) => {
    setLoading(true);
    try {
      await advertisementService.createAdvertisement(data);
      await fetchAds();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo quảng cáo"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAd = async (code: string, data: UpdateAdvertisementDto) => {
    setLoading(true);
    try {
      await advertisementService.updateAdvertisement(code, data);
      await fetchAds();
      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi cập nhật quảng cáo"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAd = async (code: string) => {
    setLoading(true);
    try {
      await advertisementService.deleteAdvertisement(code);
      await fetchAds();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa quảng cáo"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Helper để lấy quảng cáo theo vị trí (ưu tiên cái mới nhất hoặc priority cao nhất)
  const getAdByPosition = (position: AdvertisementPosition) => {
    const filtered = ads.filter((ad) => ad.position === position);
    // Sort by priority desc, then updatedAt desc
    return (
      filtered.sort((a, b) => {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return (
          new Date(b.updatedAt || "").getTime() -
          new Date(a.updatedAt || "").getTime()
        );
      })[0] || null
    );
  };

  return {
    ads,
    loading,
    error,
    fetchAds,
    createAd,
    updateAd,
    deleteAd,
    getAdByPosition,
  };
};
