
import { useState, useEffect } from "react";
import { ArrowLeft, Save, Tag, Globe, Percent, Calendar, DollarSign, Type, CheckCircle } from "lucide-react";
import { couponService, Coupon } from "./services/servicesCoupons";

interface CouponsAddProps {
  onBack: () => void;
  couponId?: string | null;
}

const CouponsAdd = ({ onBack, couponId }: CouponsAddProps) => {
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: "",
    name: { vi: "", ja: "" },
    type: "percent",
    value: { vi: 0, ja: 0 },
    limit: 100,
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<'vi' | 'ja'>('vi');

  useEffect(() => {
    if (couponId) {
      fetchCoupon(couponId);
    }
  }, [couponId]);

  const fetchCoupon = async (id: string) => {
    try {
      setLoading(true);
      const data = await couponService.getById(id);
      setFormData(data);
    } catch (err) {
      setError(language === 'vi' ? "Không thể tải thông tin mã giảm giá" : "クーポンの情報を読み込めません");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'limit') {
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleValueChange = (lang: 'vi' | 'ja', val: string) => {
    setFormData(prev => ({
        ...prev,
        value: {
            ...prev.value as { vi: number; ja: number },
            [lang]: Number(val)
        }
    }));
  };

  const handleNameChange = (lang: 'vi' | 'ja', value: string) => {
    setFormData(prev => ({
        ...prev,
        name: {
            ...prev.name as { vi: string; ja: string },
            [lang]: value
        }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (couponId) {
        await couponService.update(couponId, formData);
      } else {
        await couponService.create(formData);
      }
      onBack();
    } catch (err: any) {
      setError(err.response?.data?.message || (language === 'vi' ? "Có lỗi xảy ra" : "エラーが発生しました"));
    } finally {
      setLoading(false);
    }
  };

  if (loading && couponId) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group"
          >
            <ArrowLeft size={24} className="text-gray-600 group-hover:text-blue-600" />
          </button>
          <div id="coupon-add-header">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              {couponId 
                ? (language === 'vi' ? "Chỉnh sửa mã giảm giá" : "クーポンを編集") 
                : (language === 'vi' ? "Thêm mã giảm giá mới" : "新しいクーポンを追加")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {language === 'vi' ? 'Điền thông tin chi tiết để tạo chương trình khuyến mãi' : 'プロモーションを作成するための詳細情報を入力してください'}
            </p>
          </div>
        </div>
        
        <button
            onClick={() => setLanguage(prev => prev === 'vi' ? 'ja' : 'vi')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
        >
            <Globe size={18} />
            <span className="font-medium text-sm">{language === 'vi' ? 'Tiếng Nhật' : 'Tiếng Việt'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {error && (
          <div className="m-6 mb-0 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* Main Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Code */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Mã Code' : 'クーポンコード'}
                <span className="text-gray-400 font-normal ml-2 text-xs">
                  {language === 'vi' ? '(Để trống sẽ tự tạo)' : '(空白の場合は自動生成)'}
                </span>
              </label>
              <div id="coupon-code-input" className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder={language === 'vi' ? "VD: SALE50" : "例: SALE50"}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all uppercase font-medium tracking-wide"
                />
              </div>
            </div>

            {/* Program Name Group */}
            <div id="coupon-name-group" className="col-span-1 md:col-span-2 space-y-6 bg-gray-50 p-6 rounded-xl border border-dashed border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center gap-2">
                <Type size={16} className="text-blue-500" />
                {language === 'vi' ? 'Tên chương trình' : 'プログラム名'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {language === 'vi' ? 'Tiếng Việt' : 'ベトナム語'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name?.vi || ''}
                    onChange={(e) => handleNameChange('vi', e.target.value)}
                    placeholder="VD: Khuyến mãi hè"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                     {language === 'vi' ? 'Tiếng Nhật' : '日本語'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name?.ja || ''}
                    onChange={(e) => handleNameChange('ja', e.target.value)}
                    placeholder="VD: サマーセール"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Type */}
            <div id="coupon-type-group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Loại giảm giá' : '割引タイプ'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {formData.type === 'percent' ? <Percent size={18} /> : <DollarSign size={18} />}
                </div>
                <select
                  id="coupon-type-select"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="percent">{language === 'vi' ? 'Phần trăm (%)' : 'パーセント (%)'}</option>
                  <option value="fixed">{language === 'vi' ? 'Số tiền cố định' : '固定額'}</option>
                </select>
              </div>
            </div>

            {/* Limit */}
            <div id="coupon-limit-group">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'vi' ? 'Giới hạn số lần dùng' : '使用制限'}
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="coupon-limit-input"
                  type="number"
                  name="limit"
                  required
                  min="1"
                  value={formData.limit}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

             {/* Discount Value Group */}
             <div id="coupon-value-group" className="col-span-1 md:col-span-2 space-y-6 bg-blue-50/50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-900 border-b border-blue-100 pb-2 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-blue-500" />
                {language === 'vi' ? 'Giá trị giảm' : '割引額'}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Value VI */}
                <div>
                   <label className="block text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
                    Vietnam ({formData.type === 'percent' ? '%' : 'VND'})
                  </label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 font-bold">VI</span>
                    <input
                      type="number"
                      required
                      min="0"
                      max={formData.type === 'percent' ? 100 : undefined}
                      value={formData.value?.vi || 0}
                      onChange={(e) => handleValueChange('vi', e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Value JA */}
                <div>
                  <label className="block text-xs font-semibold text-blue-800 uppercase tracking-wider mb-2">
                    Japan ({formData.type === 'percent' ? '%' : 'JPY'})
                  </label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 font-bold">JA</span>
                    <input
                      type="number"
                      required
                      min="0"
                      max={formData.type === 'percent' ? 100 : undefined}
                      value={formData.value?.ja || 0}
                      onChange={(e) => handleValueChange('ja', e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
            
             {/* Active Status */}
             <div id="coupon-status-group" className="col-span-1 md:col-span-2 pt-4 border-t border-gray-100">
                <label className="flex items-center cursor-pointer group">
                  <div className="relative">
                    <input
                        id="isActive"
                        name="isActive" // Keeping original name prop
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${formData.isActive ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                    <div className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${formData.isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <div className="ml-3">
                     <span className="block text-sm font-medium text-gray-900">
                        {language === 'vi' ? 'Kích hoạt ngay' : 'すぐに有効化'}
                     </span>
                     <span className="block text-xs text-gray-500">
                        {language === 'vi' ? 'Mã giảm giá sẽ có hiệu lực ngay sau khi lưu' : 'クーポンは保存後すぐに有効になります'}
                     </span>
                  </div>
                </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-50">
            <button
              id="btn-cancel-coupon"
              type="button"
              onClick={onBack}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all"
            >
               {language === 'vi' ? "Hủy" : "キャンセル"}
            </button>
            <button
              id="btn-save-coupon"
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2 hover:bg-blue-700 hover:shadow-blue-300 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading 
                ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{language === 'vi' ? "Đang lưu..." : "保存中..."}</span>
                  </>
                ) 
                : (
                  <>
                    <CheckCircle size={18} />
                    <span>{language === 'vi' ? "Lưu mã giảm giá" : "クーポンを保存"}</span>
                  </>
                )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponsAdd;
