
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Copy, Check } from "lucide-react";
import { couponService, Coupon } from "./services/servicesCoupons";

interface CouponsListProps {
  onAdd: () => void;
  onEdit: (id: string) => void;
}

const CouponsList = ({ onAdd, onEdit }: CouponsListProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'vi' | 'ja'>('vi');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getCouponName = (name: any) => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[language] || name['vi'] || '';
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await couponService.getAll();
      setCoupons(data);
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã giảm giá này?")) {
      try {
        await couponService.delete(id);
        fetchCoupons();
      } catch (error) {
        console.error("Failed to delete coupon", error);
      }
    }
  };

  const handleCopy = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  const getValueDisplay = (coupon: Coupon) => {
    return coupon.type === 'percent' 
      ? `${(coupon.value as any)[language] || (coupon.value as any).vi}%` 
      : language === 'vi' 
          ? `${((coupon.value as any).vi || 0).toLocaleString()} đ` 
          : `¥${((coupon.value as any).ja || 0).toLocaleString()}`;
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 id="coupons-list-header" className="text-xl md:text-2xl font-bold text-gray-800">
          {language === 'vi' ? 'Quản lý mã giảm giá' : 'クーポン管理'}
        </h2>
        <div id="coupons-toolbar-section" className="flex gap-2 w-full md:w-auto">
            <button
                id="coupons-lang-switcher"
                onClick={() => setLanguage(prev => prev === 'vi' ? 'ja' : 'vi')}
                className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm flex-1 md:flex-none text-center"
            >
                {language === 'vi' ? 'Tiếng Nhật' : 'Tiếng Việt'}
            </button>
            <button
                id="btn-add-coupon"
                onClick={onAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Plus size={18} />
                <span className="hidden md:inline">{language === 'vi' ? 'Thêm mã' : '新規追加'}</span>
            </button>
      
        </div>
      </div>

      {/* Desktop View - Table */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {language === 'vi' ? 'Mã Code' : 'コード'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 {language === 'vi' ? 'Tên chương trình' : '名前'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 {language === 'vi' ? 'Giá trị' : '値'}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 {language === 'vi' ? 'Giới hạn / Đã dùng' : '制限 / 使用済み'}
              </th>
               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                 {language === 'vi' ? 'Trạng thái' : 'ステータス'}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                 {language === 'vi' ? 'Hành động' : 'アクション'}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon, index) => (
              <tr key={coupon._id} id={`coupon-item-${index}`}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 group relative">
                  <div id={`coupon-code-${index}`} className="flex items-center gap-2">
                    {coupon.code}
                    <button 
                      onClick={() => handleCopy(coupon.code, coupon._id)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Copy code"
                    >
                      {copiedId === coupon._id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </td>
                <td id={`coupon-name-${index}`} className="px-6 py-4 whitespace-nowrap text-gray-500">
                  <div className="max-w-xs truncate" title={getCouponName(coupon.name)}>
                    {getCouponName(coupon.name)}
                  </div>
                </td>
                <td id={`coupon-value-${index}`} className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {getValueDisplay(coupon)}
                </td>
                <td id={`coupon-limit-${index}`} className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {coupon.used} / {coupon.limit}
                </td>
                 <td id={`coupon-status-${index}`} className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      coupon.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.isActive ? "Hoạt động" : "Tạm dừng"}
                  </span>
                </td>
                <td id={`coupon-actions-${index}`} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    id={`btn-edit-coupon-${index}`}
                    onClick={() => onEdit(coupon._id)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    id={`btn-delete-coupon-${index}`}
                    onClick={() => handleDelete(coupon._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
                 <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Chưa có mã giảm giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View - Cards */}
      <div className="md:hidden space-y-4">
        {coupons.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-lg shadow">
            {language === 'vi' ? 'Chưa có mã giảm giá nào.' : 'クーポンはありません。'}
          </div>
        ) : (
          coupons.map((coupon, index) => (
            <div key={coupon._id} id={`coupon-card-${index}`} className="bg-white rounded-lg shadow p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                   <div id={`coupon-code-mobile-${index}`} className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-gray-900">{coupon.code}</span>
                      <button 
                        onClick={() => handleCopy(coupon.code, coupon._id)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-1"
                      >
                        {copiedId === coupon._id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                   </div>
                   <p id={`coupon-name-mobile-${index}`} className="text-sm text-gray-600">{getCouponName(coupon.name)}</p>
                </div>
                <span
                    id={`coupon-status-mobile-${index}`}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      coupon.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {coupon.isActive ? "Hoạt động" : "Tạm dừng"}
                  </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div id={`coupon-card-value-${index}`}>
                  <p className="text-gray-500">{language === 'vi' ? 'Giá trị' : '値'}</p>
                  <p className="font-medium">{getValueDisplay(coupon)}</p>
                </div>
                <div id={`coupon-card-limit-${index}`}>
                  <p className="text-gray-500">{language === 'vi' ? 'Đã dùng / Giới hạn' : '使用済み / 制限'}</p>
                  <p className="font-medium">{coupon.used} / {coupon.limit}</p>
                </div>
              </div>

              <div id={`coupon-card-actions-${index}`} className="pt-3 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    id={`btn-edit-coupon-mobile-${index}`}
                    onClick={() => onEdit(coupon._id)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900 px-3 py-1.5 rounded bg-indigo-50"
                  >
                    <Edit size={16} />
                    <span>{language === 'vi' ? 'Sửa' : '編集'}</span>
                  </button>
                  <button
                    id={`btn-delete-coupon-mobile-${index}`}
                    onClick={() => handleDelete(coupon._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-900 px-3 py-1.5 rounded bg-red-50"
                  >
                    <Trash2 size={16} />
                    <span>{language === 'vi' ? 'Xóa' : '削除'}</span>
                  </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CouponsList;
