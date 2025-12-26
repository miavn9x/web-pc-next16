"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from "lucide-react";
import { ordersService, CustomerStat } from "../quan-ly-don-hang/services/Orders";

type Locale = 'vi' | 'ja';

const TRANSLATIONS = {
  vi: {
    title: "Quản Lý Khách Hàng",
    subtitle: "Tổng hợp thông tin khách hàng từ lịch sử đơn hàng",
    searchPlaceholder: "Tìm theo tên, email, sđt...",
    refresh: "Làm mới",
    customer: "Khách hàng",
    contactInfo: "Thông tin liên hệ",
    address: "Địa chỉ",
    orders: "Đơn hàng",
    totalSpent: "Tổng chi tiêu",
    loading: "Đang tải dữ liệu...",
    noData: "Không tìm thấy khách hàng nào",
    lastPurchase: "Mua gần nhất",
    pagination: "Trang {page} / {totalPages} ({total} khách hàng)",
    viewDetails: "Xem chi tiết"
  },
  ja: {
    title: "顧客管理",
    subtitle: "注文履歴から顧客情報を集計",
    searchPlaceholder: "名前、メール、電話番号で検索...",
    refresh: "更新",
    customer: "顧客",
    contactInfo: "連絡先",
    address: "住所",
    orders: "注文数",
    totalSpent: "総支出額",
    loading: "データを読み込み中...",
    noData: "顧客が見つかりません",
    lastPurchase: "最終購入",
    pagination: "ページ {page} / {totalPages} ({total} 人)",
    viewDetails: "詳細を表示"
  }
};

const CustomersManagement = () => {
  const [locale, setLocale] = useState<Locale>('vi');
  const t = TRANSLATIONS[locale];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CustomerStat[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchCustomers = useCallback(async (page: number, search: string) => {
    setLoading(true);
    try {
      const res = await ordersService.getCustomersStats(page, 20, search);
      setData(res.data?.items || []);
      if (res.data?.meta) {
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(1, debouncedSearch);
  }, [fetchCustomers, debouncedSearch]);

  const formatCurrency = (val: number, cur: 'vi' | 'ja') => {
    return new Intl.NumberFormat(cur === 'vi' ? 'vi-VN' : 'ja-JP', {
      style: 'currency',
      currency: cur === 'vi' ? 'VND' : 'JPY'
    }).format(val);
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  const getPaginationText = () => {
    return t.pagination
      .replace('{page}', meta.page.toString())
      .replace('{totalPages}', meta.totalPages.toString())
      .replace('{total}', meta.total.toString());
  }

  // Loading Skeleton Component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white p-4 rounded-lg border border-gray-200 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-4 w-24 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Mobile Card View Component
  const CustomerCard = ({ customer, index }: { customer: CustomerStat; index: number }) => (
    <div id={`mobile-customer-card-${index}`} className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 id={`mobile-customer-name-${index}`} className="font-semibold text-gray-900 text-base sm:text-lg truncate">{customer.fullName}</h3>
          <div id={`mobile-customer-last-purchase-${index}`} className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
            <Calendar className="w-3 h-3 shrink-0" />
            <span className="truncate">{t.lastPurchase}: {formatDate(customer.lastOrderDate)}</span>
          </div>
        </div>
        <div className="shrink-0 ml-3">
          <span id={`mobile-customer-order-count-${index}`} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            {customer.totalOrders} {locale === 'vi' ? 'đơn' : '件'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {customer.email && (
          <div id={`mobile-customer-email-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="truncate">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div id={`mobile-customer-phone-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{customer.phone}</span>
          </div>
        )}
        {customer.address && (
          <div id={`mobile-customer-address-${index}`} className="flex items-start gap-2 text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <span className="line-clamp-2">{customer.address}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase">{t.totalSpent}</span>
          <div id={`mobile-customer-total-spent-${index}`} className="flex flex-col items-end gap-1">
            {customer.totalSpent.vi > 0 && (
              <span className="text-sm font-semibold text-red-600">
                {formatCurrency(customer.totalSpent.vi, 'vi')}
              </span>
            )}
            {customer.totalSpent.ja > 0 && (
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(customer.totalSpent.ja, 'ja')}
              </span>
            )}
            {customer.totalSpent.vi === 0 && customer.totalSpent.ja === 0 && (
              <span className="text-sm text-gray-400">0</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div id="customers-page" className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div id="customers-header" className="flex flex-col gap-4">
        <div>
          <h1 id="customers-title" className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 shrink-0" />
            <span className="truncate">{t.title}</span>
          </h1>
          <p id="customers-subtitle" className="text-sm sm:text-base text-gray-500 mt-1">
            {t.subtitle}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {/* Language Toggle */}
          <div id="customers-lang-toggle" className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden w-fit">
            <button
              id="btn-lang-vi"
              onClick={() => setLocale('vi')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors ${locale === 'vi' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              VI
            </button>
            <div className="w-px h-4 bg-gray-200"></div>
            <button
              id="btn-lang-ja"
              onClick={() => setLocale('ja')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium transition-colors ${locale === 'ja' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              JA
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="input-search-customer"
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none bg-white transition-shadow"
            />
          </div>

          {/* Refresh Button */}
          <button
            id="btn-refresh-customers"
            onClick={() => fetchCustomers(meta.page, debouncedSearch)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white transition-colors self-start sm:self-auto"
            title={t.refresh}
            aria-label={t.refresh}
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && data.length === 0 ? (
        <LoadingSkeleton />
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t.noData}</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View (< md) */}
          <div className="md:hidden space-y-3">
            {data.map((customer, index) => (
              <CustomerCard key={customer.id} customer={customer} index={index} />
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div id="customers-table" className="hidden md:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead id="customers-table-header" className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th id="th-customer" className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.customer}</th>
                    <th id="th-contact" className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.contactInfo}</th>
                    <th id="th-address" className="px-4 lg:px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">{t.address}</th>
                    <th id="th-orders" className="px-4 lg:px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.orders}</th>
                    <th id="th-total-spent" className="px-4 lg:px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.totalSpent}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((customer, index) => (
                    <tr key={customer.id} id={index === 0 ? "customer-row-0" : undefined} className="hover:bg-blue-50/50 transition-colors group">
                      <td className="px-4 lg:px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 text-sm lg:text-base">{customer.fullName}</span>
                          <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t.lastPurchase}: {formatDate(customer.lastOrderDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4">
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="truncate max-w-[200px]">{customer.email}</span>
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-600">
                              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-start gap-2 max-w-xs">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-1 shrink-0" />
                          <span className="text-sm text-gray-600 line-clamp-2" title={customer.address}>
                            {customer.address}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {customer.totalOrders}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 text-right">
                        <div className="flex flex-col gap-1">
                          {customer.totalSpent.vi > 0 && (
                            <span className="text-xs lg:text-sm font-medium text-red-600">
                              {formatCurrency(customer.totalSpent.vi, 'vi')}
                            </span>
                          )}
                          {customer.totalSpent.ja > 0 && (
                            <span className="text-xs lg:text-sm font-medium text-green-600">
                              {formatCurrency(customer.totalSpent.ja, 'ja')}
                            </span>
                          )}
                          {customer.totalSpent.vi === 0 && customer.totalSpent.ja === 0 && (
                            <span className="text-sm text-gray-400">0</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div id="customers-pagination" className="bg-white rounded-xl border border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {getPaginationText()}
            </span>
            <div className="flex gap-2">
              <button
                id="btn-prev-page"
                onClick={() => fetchCustomers(meta.page - 1, debouncedSearch)}
                disabled={meta.page <= 1}
                className="min-w-[40px] p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white active:scale-95"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                id="btn-next-page"
                onClick={() => fetchCustomers(meta.page + 1, debouncedSearch)}
                disabled={meta.page >= meta.totalPages}
                className="min-w-[40px] p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white active:scale-95"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomersManagement;
