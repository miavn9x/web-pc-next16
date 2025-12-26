"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  X,
  ExternalLink,
} from "lucide-react";
import { useAdvertisement } from "./hooks/useAdvertisement";
import { useAdminMedia } from "../media/hooks/useAdminMedia";
import {
  AdvertisementPosition,
  Advertisement,
} from "./services/advertisementService";
import { MediaUsageEnum } from "../media/types/adminMedia.types";

// Helper to get full image URL
const getFullImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  // Assumes NEXT_PUBLIC_API_URL is like 'http://localhost:5000/api'
  // We need to strip '/api' to get the base host, or adjust based on your actual env.
  // If the backend serves static files at root, we just need the domain.
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:4000";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface AdFormState {
  mediaCode: string;
  url: string;
}

// --- Component: Form thêm quảng cáo mới ---
const NewAdForm = ({
  position,
  onCancel,
  onSuccess,
}: {
  position: AdvertisementPosition;
  onCancel: () => void;
  onSuccess: () => void;
}) => {
  const { uploadSingle, uploadSingleState } = useAdminMedia();
  const { createAd, loading: creating } = useAdvertisement();
  const [formData, setFormData] = useState<AdFormState>({
    mediaCode: "",
    url: "",
  });

  const isUploading = uploadSingleState.isLoading;
  const isSubmitting = creating || isUploading;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Kết quả upload trả về: { message: '...', data: { mediaCode: '...', url: '...' } }
      const uploaded = await uploadSingle(file, MediaUsageEnum.ADVERTISEMENT);
      
      // Handle both wrapped and unwrapped response just in case
      const mediaData = uploaded?.data || uploaded;

      if (mediaData && mediaData.mediaCode) {
        setFormData({
          mediaCode: mediaData.mediaCode,
          url: mediaData.url,
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload ảnh thất bại");
    }
  };

  const handleSubmit = async () => {
    if (!formData.mediaCode) {
      alert("Vui lòng tải ảnh lên");
      return;
    }

    // Save to DB: mediaCode + url
    const success = await createAd({
      title: `Quảng cáo ${position} - ${new Date().toLocaleTimeString()}`,
      position: position,
      media: { mediaCode: formData.mediaCode, url: formData.url },
      link: "", // No link
      isActive: true, // Default active
      priority: 0,
    });

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-blue-100 mb-4 animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-sm font-semibold text-blue-800">Thêm ảnh mới</h4>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-500">
          <X size={16} />
        </button>
      </div>

      {/* Upload Area */}
      <div className="relative group w-full aspect-video bg-white rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden mb-3 hover:border-blue-400 transition-colors">
        {formData.url ? (
          <>
            <img
              src={getFullImageUrl(formData.url)}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-800 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                <RefreshCw size={12} /> {isUploading ? "..." : "Đổi ảnh"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-500">
            <Upload size={24} className="mb-1" />
            <span className="text-xs">{isUploading ? "Đang tải..." : "Tải ảnh"}</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
          </label>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !formData.mediaCode}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Lưu" : "Thêm vào danh sách"}
      </button>
    </div>
  );
};

// --- Component: Form chỉnh sửa quảng cáo (chỉ sửa ảnh) ---
const EditAdForm = ({
  ad,
  onCancel,
  onSuccess,
}: {
  ad: Advertisement;
  onCancel: () => void;
  onSuccess: () => void;
}) => {
  const { uploadSingle, uploadSingleState } = useAdminMedia();
  const { updateAd } = useAdvertisement();
  const [formData, setFormData] = useState<AdFormState>({
    mediaCode: ad.media.mediaCode,
    url: ad.media.url,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isUploading = uploadSingleState.isLoading;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploaded = await uploadSingle(file, MediaUsageEnum.ADVERTISEMENT);
      
      // Handle both wrapped and unwrapped response just in case
      const mediaData = uploaded?.data || uploaded;

      if (mediaData && mediaData.mediaCode) {
        setFormData({
          mediaCode: mediaData.mediaCode,
          url: mediaData.url,
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload ảnh thất bại");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await updateAd(ad.code, {
      media: { mediaCode: formData.mediaCode, url: formData.url },
    });
    setIsSubmitting(false);

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h5 className="text-xs font-semibold text-blue-800">Thay đổi hình ảnh</h5>
        <button onClick={onCancel} className="text-gray-400 hover:text-red-500">
           <X size={14} />
        </button>
      </div>

      {/* Upload Area */}
      <div className="relative group w-full aspect-video bg-white rounded border-2 border-dashed border-blue-200 flex flex-col items-center justify-center overflow-hidden hover:border-blue-400 transition-colors">
        <img
          src={getFullImageUrl(formData.url)}
          alt="Preview"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer bg-white text-gray-800 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <RefreshCw size={12} /> {isUploading ? "..." : "Chọn ảnh khác"}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting || isUploading}
            />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded text-xs font-medium transition-colors disabled:bg-gray-300"
        >
          {isSubmitting ? "Lưu" : "Cập nhật"}
        </button>
      </div>
    </div>
  );
};

// --- Component: Hiển thị 1 item quảng cáo ---
const AdItem = ({
  ad,
  onDelete,
  onToggle,
  onRefresh,
}: {
  ad: Advertisement;
  onDelete: (code: string) => void;
  onToggle: (code: string, currentStatus: boolean) => void;
  onRefresh: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <EditAdForm
        ad={ad}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => {
          setIsEditing(false);
          onRefresh();
        }}
      />
    );
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-3 flex gap-3 hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="w-24 h-16 shrink-0 bg-gray-50 rounded border border-gray-100 overflow-hidden flex items-center justify-center relative">
        <img
          src={getFullImageUrl(ad.media?.url)}
          alt={ad.title}
          className="w-full h-full object-contain"
          onError={(e) => {
             // Fallback if image load fails
             (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=No+Image';
          }}
        />
      </div>

      {/* Info & Actions */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className={`text-xs font-medium ${ad.isActive ? 'text-green-600' : 'text-gray-400'}`}>
             {ad.isActive ? '● Đang hiển thị' : '○ Đang ẩn'}
        </div>

        <div className="flex items-center gap-1.5 mt-2">
           {/* Nút Sửa: Thay ảnh */}
           <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-1 text-xs py-1 px-2 rounded border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
            title="Thay ảnh khác"
          >
            Sửa
          </button>

          {/* Nút Ẩn/Hiện */}
          <button
            onClick={() => onToggle(ad.code, ad.isActive)}
            className={`flex-1 flex items-center justify-center gap-1 text-xs py-1 px-2 rounded border ${
              ad.isActive
                ? "border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100"
                : "border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
            }`}
            title={ad.isActive ? "Ẩn quảng cáo" : "Hiện quảng cáo"}
          >
            {ad.isActive ? (
              <>
                <EyeOff size={12} /> Ẩn
              </>
            ) : (
              <>
                <Eye size={12} /> Hiện
              </>
            )}
          </button>

          {/* Nút Xóa */}
          <button
            onClick={() => {
              if (confirm("Chắc chắn xóa quảng cáo này?")) onDelete(ad.code);
            }}
            className="flex items-center justify-center gap-1 text-xs py-1 px-2 rounded border border-red-100 text-red-600 bg-red-50 hover:bg-red-100"
            title="Xóa quảng cáo"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Component: Cột hiển thị theo vị trí ---
const AdsColumn = ({
  title,
  position,
  ads,
  onDelete,
  onToggle,
  onRefresh,
}: {
  title: string;
  position: AdvertisementPosition;
  ads: Advertisement[];
  onDelete: (code: string) => void;
  onToggle: (code: string, currentStatus: boolean) => void;
  onRefresh: () => void;
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
           {position === AdvertisementPosition.POPUP ? (
             <span className="bg-purple-100 text-purple-700 p-1.5 rounded"><ImageIcon size={16}/></span>
           ) : (
              <span className="bg-blue-100 text-blue-700 p-1.5 rounded"><ImageIcon size={16}/></span>
           )}
           {title}
        </h3>
        <span className="bg-white px-2 py-0.5 rounded text-xs border border-gray-200 text-gray-500 font-medium">
          {ads.length}
        </span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30 scrollbar-thin">
        {showAddForm ? (
          <NewAdForm
            position={position}
            onCancel={() => setShowAddForm(false)}
            onSuccess={() => {
              setShowAddForm(false);
              onRefresh();
            }}
          />
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 mb-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium text-sm"
          >
            <Plus size={16} /> Thêm ảnh mới
          </button>
        )}

        <div className="space-y-3">
          {ads.map((ad) => (
            <AdItem
              key={ad.code}
              ad={ad}
              onDelete={onDelete}
              onToggle={onToggle}
              onRefresh={onRefresh}
            />
          ))}
          {ads.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Chưa có hình ảnh nào
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---
const AdsManager = () => {
  const {
    ads,
    loading,
    error,
    fetchAds,
    updateAd,
    deleteAd,
  } = useAdvertisement();

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleToggleActive = async (code: string, currentStatus: boolean) => {
    await updateAd(code, { isActive: !currentStatus });
    fetchAds();
  };

  const handleDelete = async (code: string) => {
    await deleteAd(code);
    fetchAds();
  };

  // Safe filter
  const safeAds = Array.isArray(ads) ? ads : [];
  const leftAds = safeAds.filter((ad) => ad.position === AdvertisementPosition.LEFT);
  const rightAds = safeAds.filter((ad) => ad.position === AdvertisementPosition.RIGHT);
  const popupAds = safeAds.filter((ad) => ad.position === AdvertisementPosition.POPUP);

  if (loading && safeAds.length === 0) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="p-4 sm:p-6 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
           <RefreshCw size={24} className="text-blue-600"/>
           Quản lý Quảng Cáo
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Quản lý hình ảnh banner hiển thị (Trái, Phải, Popup). 
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        <AdsColumn
          title="Banner Trái"
          position={AdvertisementPosition.LEFT}
          ads={leftAds}
          onDelete={handleDelete}
          onToggle={handleToggleActive}
          onRefresh={fetchAds}
        />
        
        <AdsColumn
          title="Popup Giữa"
          position={AdvertisementPosition.POPUP}
          ads={popupAds}
          onDelete={handleDelete}
          onToggle={handleToggleActive}
          onRefresh={fetchAds}
        />

        <AdsColumn
          title="Banner Phải"
          position={AdvertisementPosition.RIGHT}
          ads={rightAds}
          onDelete={handleDelete}
          onToggle={handleToggleActive}
          onRefresh={fetchAds}
        />
      </div>
    </div>
  );
};

export default AdsManager;
