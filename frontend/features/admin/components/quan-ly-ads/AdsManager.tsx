"use client";

import { useEffect, useState } from "react";
import {
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Link as LinkIcon,
  RefreshCw,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { useAdvertisement } from "../../hooks/advertisement/useAdvertisement";
import { useAdminMedia } from "../../hooks/media/useAdminMedia";
import {
  AdvertisementPosition,
  Advertisement,
} from "../../services/advertisement/advertisementService";
import { MediaUsageEnum } from "../../types/media/adminMedia.types";

// Interface cho form state của từng slot
interface AdFormState {
  mediaCode: string;
  url: string;
  link: string;
  isActive: boolean;
  isDirty: boolean; // Để hiện nút Save khi có thay đổi chưa lưu
}

// Component hiển thị một Slot Quảng Cáo
const AdSlotCard = ({
  title,
  position,
  currentAd,
  onSave,
  onDelete,
  onToggleActive,
}: {
  title: string;
  position: AdvertisementPosition;
  currentAd: Advertisement | null;
  onSave: (position: AdvertisementPosition, data: { mediaCode: string; url: string; link: string; isActive: boolean }) => void;
  onDelete: (code: string) => void;
  onToggleActive: (code: string, currentStatus: boolean) => void;
}) => {
  const { uploadSingle, uploadSingleState } = useAdminMedia();
  const isUploading = uploadSingleState.isLoading;
  
  // Local state để edit
  const [formData, setFormData] = useState<AdFormState>({
    mediaCode: "",
    url: "",
    link: "",
    isActive: true,
    isDirty: false,
  });

  // Sync state với currentAd khi nó thay đổi
  useEffect(() => {
    if (currentAd) {
      setFormData({
        mediaCode: currentAd.media.mediaCode,
        url: currentAd.media.url,
        link: currentAd.link || "",
        isActive: currentAd.isActive,
        isDirty: false,
      });
    } else {
      // Reset về trống nếu không có ad
      setFormData({
        mediaCode: "",
        url: "",
        link: "",
        isActive: true,
        isDirty: false,
      });
    }
  }, [currentAd]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Use MediaUsageEnum.ADVERTISEMENT
      const uploaded = await uploadSingle(file, MediaUsageEnum.ADVERTISEMENT);
      if (uploaded) {
        setFormData(prev => ({
          ...prev,
          mediaCode: uploaded.mediaCode,
          url: uploaded.url,
          isDirty: true,
        }));
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload ảnh thất bại");
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, link: e.target.value, isDirty: true }));
  };

  const handleSaveClick = () => {
    if (!formData.mediaCode) {
      alert("Vui lòng chọn ảnh trước khi lưu!");
      return;
    }
    onSave(position, {
      mediaCode: formData.mediaCode,
      url: formData.url,
      link: formData.link,
      isActive: formData.isActive,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          {position === AdvertisementPosition.POPUP ? (
            <span className="bg-purple-100 text-purple-700 p-1 rounded"><ImageIcon size={16}/></span>
          ) : (
             <span className="bg-blue-100 text-blue-700 p-1 rounded"><ImageIcon size={16}/></span>
          )}
          {title}
        </h3>
        {currentAd && (
           <div className={`text-xs px-2 py-1 rounded-full ${currentAd.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
             {currentAd.isActive ? 'Đang hiện' : 'Đang ẩn'}
           </div>
        )}
      </div>

      {/* Image Preview Area */}
      <div className="relative group w-full aspect-video bg-gray-50 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden mb-4 hover:border-blue-400 transition-colors">
        {formData.url ? (
          <>
            <img src={formData.url} alt="Preview" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                <RefreshCw size={14} /> {isUploading ? "Đang tải..." : "Thay ảnh"}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
              </label>
            </div>
          </>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-blue-500">
             <Upload size={32} className="mb-2" />
             <span className="text-sm">{isUploading ? "Đang tải..." : "Tải ảnh lên"}</span>
             <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
          </label>
        )}
      </div>

      {/* Link Input */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 mb-1">Đường dẫn (Link)</label>
        <div className="relative">
           <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
           <input 
             type="text" 
             value={formData.link} 
             onChange={handleLinkChange}
             placeholder="https://..." 
             className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
           />
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-auto flex gap-2 pt-2 border-t border-gray-100">
        {/* Nút Save: Hiện khi chưa có Ad hoặc có thay đổi */}
        {(!currentAd || formData.isDirty) && (
           <button 
             onClick={handleSaveClick}
             disabled={isUploading}
             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:bg-gray-400"
           >
             <Save size={16} /> Lưu cài đặt
           </button>
        )}

        {/* Các nút hành động khi đã có Ad */}
        {currentAd && !formData.isDirty && (
          <>
             <button 
               onClick={() => onToggleActive(currentAd.code, currentAd.isActive)}
               className={`flex-1 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 border ${currentAd.isActive ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'}`}
             >
               {currentAd.isActive ? <><EyeOff size={16}/> Ẩn</> : <><Eye size={16}/> Hiện</>}
             </button>
             
             <button 
               onClick={() => {
                   if(window.confirm('Bạn có chắc chắn muốn xóa quảng cáo này không?')) onDelete(currentAd.code);
               }}
               className="px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
               title="Xóa quảng cáo"
             >
               <Trash2 size={16} />
             </button>
          </>
        )}
      </div>
    </div>
  );
};


const AdsManager = () => {
  const { 
    ads, 
    loading, 
    fetchAds, 
    createAd, 
    updateAd, 
    deleteAd, 
    getAdByPosition 
  } = useAdvertisement();
  
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleSave = async (
    position: AdvertisementPosition, 
    data: { mediaCode: string; url: string; link: string; isActive: boolean }
  ) => {
    const currentAd = getAdByPosition(position);

    if (currentAd) {
      // Update existing
      await updateAd(currentAd.code, {
        media: { mediaCode: data.mediaCode, url: data.url },
        link: data.link,
        isActive: data.isActive
      });
    } else {
      // Create new
      await createAd({
        title: `Quảng cáo ${position}`,
        position: position,
        media: { mediaCode: data.mediaCode, url: data.url },
        link: data.link,
        isActive: true, // Default active for new
        priority: 0
      });
    }
  };

  const handleToggleActive = async (code: string, currentStatus: boolean) => {
    await updateAd(code, { isActive: !currentStatus });
  };

  const handleDelete = async (code: string) => {
    await deleteAd(code);
  };

  if(!ads && loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Quảng Cáo</h1>
        <p className="text-sm text-gray-500 mt-1">Cài đặt banner hiển thị ở các vị trí trên website (Trái, Phải, Popup)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Banner Trái */}
        <div className="md:col-start-1">
          <AdSlotCard
            title="Banner Bên Trái"
            position={AdvertisementPosition.LEFT}
            currentAd={getAdByPosition(AdvertisementPosition.LEFT)}
            onSave={handleSave}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>

        {/* Popup Giữa (Ưu tiên hiển thị ở giữa để dễ nhìn trong grid) */}
        <div className="md:col-start-2">
          <AdSlotCard
            title="Popup Giữa Màn Hình"
            position={AdvertisementPosition.POPUP}
            currentAd={getAdByPosition(AdvertisementPosition.POPUP)}
            onSave={handleSave}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>

        {/* Banner Phải */}
        <div className="md:col-start-3">
          <AdSlotCard
            title="Banner Bên Phải"
            position={AdvertisementPosition.RIGHT}
            currentAd={getAdByPosition(AdvertisementPosition.RIGHT)}
            onSave={handleSave}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>
      
      {/* Hướng dẫn nhanh */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800">
        <h4 className="font-bold mb-2 flex items-center gap-2">💡 Ghi chú:</h4>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Hình ảnh sẽ hiển thị ngay khi bạn ấn <strong>Lưu cài đặt</strong> hoặc <strong>Hiện</strong>.</li>
          <li>Kích thước khuyến nghị: Banner dọc (Trái/Phải): <strong>160x600px</strong>. Popup: <strong>800x600px</strong>.</li>
          <li>Nếu bạn muốn tắt quảng cáo tạm thời, hãy dùng nút <strong>Ẩn</strong> thay vì Xóa.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdsManager;
