import axiosInstance from "@/shared/lib/axios";

export enum AdvertisementPosition {
  LEFT = "left",
  RIGHT = "right",
  POPUP = "popup",
}

export interface AdvertisementMedia {
  mediaCode: string;
  url: string;
}

export interface Advertisement {
  code: string;
  title: string;
  position: AdvertisementPosition;
  media: AdvertisementMedia;
  link?: string;
  isActive: boolean;
  priority: number;
  width?: number;
  height?: number;
  offsetPercent?: number;
  offsetTop?: number;
}

export const getActiveAdvertisements = async (
  position?: AdvertisementPosition
) => {
  try {
    const response = await axiosInstance.get<{
      message: string;
      data: Advertisement[];
    }>("/advertisements", {
      params: {
        isActive: true,
        ...(position && { position }),
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch advertisements", error);
    return [];
  }
};
