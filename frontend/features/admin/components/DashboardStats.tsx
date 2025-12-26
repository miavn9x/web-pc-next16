"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  FileText,
  Ticket,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  Calendar,
  RefreshCw,
} from "lucide-react";
import ReactECharts from "echarts-for-react";

// Services
import { ordersService } from "../services/servicesOrders/Orders";
import { getAllProducts } from "../services/product/listProductServices";
import { postService } from "./quan-ly-noi-dung/servicsePost/postService";
import { couponService } from "../services/coupon/servicesCoupons";
import { useAdminPage } from "../contexts/AdminPageContext";

interface DashboardData {
  revenue: number;
  ordersCount: number;
  productsCount: number;
  activeProductsCount: number;
  postsCount: number;
  couponsCount: number;
  activeCouponsCount: number;
  customersCount: number;
  loading: boolean;
}

type TimeRange = 'day' | 'week' | 'month' | 'year';
type Locale = 'vi' | 'ja';

const TRANSLATIONS = {
    vi: {
        title: "Bảng Điều Khiển Tổng Quan",
        subtitle: "Dữ liệu được cập nhật theo thời gian thực từ hệ thống",
        revenue: "Doanh Thu",
        orders: "Đơn Hàng",
        products: "Sản Phẩm",
        customers: "Khách Hàng",
        productManage: "Quản Lý Sản Phẩm",
        orderManage: "Quản Lý Đơn Hàng",
        contentManage: "Quản Lý Nội Dung",
        couponManage: "Quản Lý Mã Giảm Giá",
        total: "Tổng cộng",
        seeAll: "Xem tất cả",
        posts: "bài viết",
        active: "đang hoạt động",
        revenueChart: "Biểu Đồ Doanh Thu",
        shortcuts: "Truy Cập Nhanh",
        recentOrders: "Đơn Hàng Gần Đây",
        seeHistory: "Xem toàn bộ lịch sử",
        systemStatus: "Trạng Thái Hệ Thống",
        connected: "Đã kết nối",
        revenueInPeriod: "Tổng doanh thu trong khoảng thời gian được chọn",
        ordersInSystem: "Tổng số đơn hàng trong hệ thống",
        productsAvailable: "Tổng số sản phẩm hiện có",
        customersInSystem: "Tổng số khách hàng đã mua hàng",
        updating: "Đang cập nhật",
        by: "Theo",
        day: "Ngày",
        week: "Tuần",
        month: "Tháng",
        year: "Năm",
        today: "Hôm nay",
        thisWeek: "Tuần này",
        thisMonth: "Tháng này",
        thisYear: "Năm nay",
        noRevenueData: "Chưa có dữ liệu doanh thu",
        noOrders: "Chưa có đơn hàng nào",
        options: {
             all: "Tất cả",
             pending: "Chờ xử lý",
             confirmed: "Đã xác nhận",
             complete: "Hoàn thành",
             cancelled: "Đã hủy"
        },
        refresh: "Làm mới dữ liệu"
    },
    ja: {
        title: "ダッシュボード総合管理",
        subtitle: "システムからリアルタイムでデータを更新しています",
        revenue: "売上高",
        orders: "注文数",
        products: "商品数",
        customers: "顧客数",
        productManage: "商品管理",
        orderManage: "注文管理",
        contentManage: "コンテンツ管理",
        couponManage: "クーポン管理",
        total: "合計",
        seeAll: "すべて表示",
        posts: "件の記事",
        active: "有効",
        revenueChart: "売上推移グラフ",
        shortcuts: "クイックアクセス",
        recentOrders: "最近の注文",
        seeHistory: "全履歴を表示",
        systemStatus: "システム状態",
        connected: "接続中",
        revenueInPeriod: "選択期間の総売上高",
        ordersInSystem: "システム内の総注文数",
        productsAvailable: "登録商品の総数",
        customersInSystem: "購入済み顧客の総数",
        updating: "更新中",
        by: "期間",
        day: "日",
        week: "週",
        month: "月",
        year: "年",
        today: "本日",
        thisWeek: "今週",
        thisMonth: "今月",
        thisYear: "今年",
        noRevenueData: "売上データがありません",
        noOrders: "注文はありません",
        options: {
             all: "すべて",
             pending: "処理待ち",
             confirmed: "確認済み",
             complete: "完了",
             cancelled: "キャンセル済み"
        },
        refresh: "データを更新"
    }
}

const DashboardStats = () => {
  const { setCurrentPage } = useAdminPage();
  const [locale, setLocale] = useState<Locale>('vi');
  const t = TRANSLATIONS[locale];

  const [data, setData] = useState<DashboardData>({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    activeProductsCount: 0,
    postsCount: 0,
    couponsCount: 0,
    activeCouponsCount: 0,
    customersCount: 0,
    loading: true,
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [chartOption, setChartOption] = useState<any>({});
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [revenueInPeriod, setRevenueInPeriod] = useState<{ vi: number; ja: number }>({ vi: 0, ja: 0 });

  const initDashboard = async () => {
       setData((prev) => ({ ...prev, loading: true }));
       try {
           // 1. Fetch Orders 
           const ordersRes = await ordersService.getOrders(1, 1000); 
           const fetchedOrders = ordersRes.data?.items || [];
           setRawOrders(fetchedOrders);
           
           // Initial processing
           processData(fetchedOrders, timeRange, locale);

           // 2. Fetch Products
            const productsRes = await getAllProducts(1, 1);
            const productsTotal = productsRes.pagination.totalItems;

            // 3. Fetch Posts
            const postsRes = await postService.getPosts(1, 1);
            const postsTotal = postsRes.pagination?.total || 0;

            // 4. Fetch Coupons
            const couponsRes = await couponService.getAll();
            const couponsTotal = couponsRes.length;
            const activeCoupons = couponsRes.filter((c: any) => c.isActive).length;

            // 5. Fetch Customers (New)
            const customersRes = await ordersService.getCustomersStats(1, 1);
            const customersTotal = customersRes.data?.meta?.total || 0;

            setData({
                revenue: 0, 
                ordersCount: ordersRes.data?.meta?.total || 0,
                productsCount: productsTotal,
                activeProductsCount: productsTotal,
                postsCount: postsTotal,
                couponsCount: couponsTotal,
                activeCouponsCount: activeCoupons,
                customersCount: customersTotal, // Added field
                loading: false,
            });

       } catch (error) {
           console.error("Dashboard init error:", error);
           setData((prev) => ({ ...prev, loading: false }));
       }
  };

  useEffect(() => {
    initDashboard();
  }, []);

  useEffect(() => {
    if (rawOrders.length > 0) {
        processData(rawOrders, timeRange, locale);
    }
  }, [timeRange, rawOrders, locale]);

  const processData = (orders: any[], range: TimeRange, currentLocale: Locale) => {
    if (!orders) return;

    const now = new Date();
    
    // 1. Filter Orders for Time Range
    const filteredOrders = orders.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        
        if (range === 'day') {
             return orderDate.getDate() === now.getDate() && 
                    orderDate.getMonth() === now.getMonth() && 
                    orderDate.getFullYear() === now.getFullYear();
        } else if (range === 'week') {
            const day = now.getDay();
            const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
            const monday = new Date(now);
            monday.setDate(diff);
            monday.setHours(0,0,0,0);
            return orderDate >= monday;
        } else if (range === 'month') {
            return orderDate.getMonth() === now.getMonth() && 
                   orderDate.getFullYear() === now.getFullYear();
        } else if (range === 'year') {
            return orderDate.getFullYear() === now.getFullYear();
        }
        return true;
    });

    // 2. Calculate Revenue based on LOCALE (Split)
    const rev = filteredOrders.reduce((acc, order) => {
        acc.vi += (order.totalPrice?.vi || 0);
        acc.ja += (order.totalPrice?.ja || 0);
        return acc;
    }, { vi: 0, ja: 0 });
    setRevenueInPeriod(rev);

    // 3. Update Recent Orders List (Show up to 10)
    setRecentOrders(filteredOrders.slice(0, 10));

    // 4. Prepare Chart Data with Full Range Filling
    let chartItemsVi: { [key: string]: number } = {};
    let chartItemsJa: { [key: string]: number } = {};
    let labels: string[] = [];

    // Initialize labels and map for the full range
    if (range === 'day') {
        for (let i = 0; i < 24; i++) {
            const key = `${i.toString().padStart(2, '0')}:00`;
            labels.push(key);
            chartItemsVi[key] = 0;
            chartItemsJa[key] = 0;
        }
    } else if (range === 'week') {
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
        const monday = new Date(now);
        monday.setDate(diff);
        
        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const key = d.toLocaleDateString(currentLocale === 'vi' ? 'vi-VN' : 'ja-JP', { day: '2-digit', month: '2-digit' });
            labels.push(key);
            chartItemsVi[key] = 0;
            chartItemsJa[key] = 0;
        }
    } else if (range === 'month') {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const key = i.toString();
            labels.push(key);
            chartItemsVi[key] = 0;
            chartItemsJa[key] = 0;
        }
    } else if (range === 'year') {
        for (let i = 0; i < 12; i++) {
            const key = currentLocale === 'vi' ? `T${i + 1}` : `${i + 1}月`;
            labels.push(key);
            chartItemsVi[key] = 0;
            chartItemsJa[key] = 0;
        }
    }

    // Fill data
    filteredOrders.forEach(order => {
        const priceVi = order.totalPrice?.vi || 0;
        const priceJa = order.totalPrice?.ja || 0;
        
        const date = new Date(order.createdAt);
        let key = '';

        if (range === 'day') {
            key = `${date.getHours().toString().padStart(2, '0')}:00`;
        } else if (range === 'week') {
             key = date.toLocaleDateString(currentLocale === 'vi' ? 'vi-VN' : 'ja-JP', { day: '2-digit', month: '2-digit' });
        } else if (range === 'month') {
             key = date.getDate().toString();
        } else if (range === 'year') {
             key = currentLocale === 'vi' ? `T${date.getMonth() + 1}` : `${date.getMonth() + 1}月`;
        }
        
        // Only add if key exists (it should, but safety check)
        if (chartItemsVi.hasOwnProperty(key)) {
            chartItemsVi[key] += priceVi;
            chartItemsJa[key] += priceJa;
        }
    });

    const seriesDataVi = labels.map(l => chartItemsVi[l]);
    const seriesDataJa = labels.map(l => chartItemsJa[l]);

    // 5. ECharts Option
    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                let res = `<b>${params[0].name}</b><br/>`;
                params.forEach((param: any) => {
                     const currency = param.seriesName === 'VND' ? 'VND' : 'JPY';
                     const localeCode = param.seriesName === 'VND' ? 'vi-VN' : 'ja-JP';
                     const val = new Intl.NumberFormat(localeCode, { style: 'currency', currency }).format(param.value);
                     res += `<span style="color:${param.color}">●</span> ${param.seriesName}: <b>${val}</b><br/>`;
                });
                return res;
            }
        },
        legend: {
            data: ['VND', 'JPY'],
            bottom: 0,
            itemGap: 20
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: labels,
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#64748b' }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: { type: 'dashed', color: '#e2e8f0' }
            },
            axisLabel: { 
                color: '#64748b',
                formatter: (value: number) => {
                    if (value >= 1000000) return `${value / 1000000}M`;
                    if (value >= 1000) return `${value / 1000}k`;
                    return value;
                }
            }
        },
        series: [
            {
                name: 'VND',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#ef4444', // Red
                    borderColor: '#fff',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#ef4444',
                    width: 3
                },
                data: seriesDataVi
            },
            {
                name: 'JPY',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#22c55e', // Green
                    borderColor: '#fff',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#22c55e',
                    width: 3
                },
                data: seriesDataJa
            }
        ]
    };

    setChartOption(option);
  };

  const getRangeLabel = () => {
       switch(timeRange) {
           case 'day': return t.today;
           case 'week': return t.thisWeek;
           case 'month': return t.thisMonth;
           case 'year': return t.thisYear;
           default: return '';
       }
  }

  const formatCurrency = (amount: number, cur: 'vi'|'ja') => {
      return new Intl.NumberFormat(cur === 'vi' ? 'vi-VN' : 'ja-JP', { 
          style: 'currency', 
          currency: cur === 'vi' ? 'VND' : 'JPY' 
      }).format(amount);
  }

  const formatMixedRevenue = (rev: { vi: number, ja: number }) => {
      const parts = [];
      if (rev.vi > 0) parts.push(formatCurrency(rev.vi, 'vi'));
      if (rev.ja > 0) parts.push(formatCurrency(rev.ja, 'ja'));
      return parts.length > 0 ? parts.join(' + ') : formatCurrency(0, 'vi');
  }

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'PENDING': return t.options.pending;
          case 'CONFIRMED': return t.options.confirmed;
          case 'COMPLETE': return t.options.complete;
          case 'CANCELLED': return t.options.cancelled;
          default: return status;
      }
  }

  const stats = [
    {
      title: t.revenue,
      value: formatMixedRevenue(revenueInPeriod),
      change: getRangeLabel(),
      isPositive: true,
      icon: DollarSign,
      color: "blue",
      description: t.revenueInPeriod,
      link: null 
    },
    {
      title: t.orders,
      value: data.loading ? "..." : data.ordersCount.toLocaleString(),
      change: t.total,
      isPositive: true,
      icon: ShoppingCart,
      color: "green",
      description: t.ordersInSystem,
      link: "orders-all"
    },
    {
      title: t.products,
      value: data.loading ? "..." : data.productsCount.toLocaleString(),
      change: t.total,
      isPositive: true,
      icon: Package,
      color: "purple",
      description: t.productsAvailable,
      link: "products-list"
    },
    {
      title: t.customers,
      value: data.loading ? "..." : data.customersCount.toLocaleString(),
      change: t.total,
      isPositive: true,
      icon: Users,
      color: "orange",
      description: t.customersInSystem,
      link: null
    }
  ];

  const sections = [
    {
      title: t.productManage,
      count: data.loading ? "..." : data.productsCount.toString(),
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      link: "products-list",
      details: [`${data.productsCount} ${t.total}`]
    },
    {
      title: t.orderManage,
      count: data.loading ? "..." : data.ordersCount.toString(),
      icon: ShoppingCart,
      color: "bg-green-50 text-green-600",
      link: "orders-all",
       details: [t.seeAll]
    },
    {
      title: t.contentManage,
      count: data.loading ? "..." : data.postsCount.toString(),
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
      link: "content-posts",
       details: [`${data.postsCount} ${t.posts}`]
    },
    {
      title: t.couponManage,
      count: data.loading ? "..." : data.couponsCount.toString(),
      icon: Ticket,
      color: "bg-orange-50 text-orange-600",
      link: "coupons-list",
       details: [`${data.activeCouponsCount} ${t.active}`]
    }
  ];

  return (
    <div id="dashboard-stats" className="p-6 space-y-8 min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
             {/* Language Toggle */}
            <div className="flex items-center bg-white border rounded-lg overflow-hidden">
                <button 
                    onClick={() => setLocale('vi')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${locale === 'vi' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    VI
                </button>
                <div className="w-px h-4 bg-gray-200"></div>
                <button 
                    onClick={() => setLocale('ja')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${locale === 'ja' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                    JA
                </button>
            </div>

            <button 
                onClick={initDashboard}
                className="p-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                disabled={data.loading}
                title={t.refresh}
            >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${data.loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((stat, index) => (
          <div 
             key={index} 
             id={`stat-${index}`}
             className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              {stat.isPositive && (
                  <button 
                    onClick={() => stat.link && setCurrentPage(stat.link)}
                    className={`flex items-center text-sm font-medium text-green-600 hover:text-green-700 transition-colors ${stat.link ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    {stat.change}
                  </button>
              )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Detailed Sections */}
        <div className="lg:col-span-2 space-y-6">
            
             <div id="chart-revenue" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">
                        {t.revenueChart} ({t.by} {
                            timeRange === 'day' ? t.day : 
                            timeRange === 'week' ? t.week : 
                            timeRange === 'month' ? t.month : t.year
                        })
                    </h3>
                    <select 
                        className="text-sm border-gray-200 rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-blue-100 outline-none"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                    >
                        <option value="day">{t.today}</option>
                        <option value="week">{t.thisWeek}</option>
                        <option value="month">{t.thisMonth}</option>
                        <option value="year">{t.thisYear}</option>
                    </select>
                </div>
                
                {/* ECHARTS CHART */}
                <div className="h-80 w-full">
                    {chartOption.series && chartOption.series[0].data.length > 0 ? (
                        <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
                    ) : (
                         <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                             <Activity className="w-8 h-8 opacity-20" />
                             <p>{t.noRevenueData}</p>
                         </div>
                    )}
                </div>
            </div>

            <div id="section-shortcuts-container">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t.shortcuts}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section, index) => (
                        <div 
                            key={index} 
                            id={`shortcut-${index}`}
                            onClick={() => setCurrentPage(section.link)}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:border-blue-200 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${section.color}`}>
                                    <section.icon className="w-6 h-6" />
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{section.count}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{section.title}</h3>
                            <div className="mt-4 flex gap-3">
                                {section.details.map((detail, idx) => (
                                    <span key={idx} className="text-xs font-medium px-2.5 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-200">
                                        {detail}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div id="section-recent-orders" className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-fit">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">{t.recentOrders} {getRangeLabel().toLowerCase()}</h3>
            </div>
            <div className="space-y-6">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                    <div key={order.code} className="flex gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-500">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">#{order.code}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {new Date(order.createdAt || Date.now()).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'ja-JP')}
                            </p>
                             <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    order.orderStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    order.orderStatus === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                    order.orderStatus === 'COMPLETE' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {getStatusLabel(order.orderStatus)}
                                </span>
                                <p className="text-xs font-semibold text-green-600">
                                    {formatMixedRevenue({ 
                                        vi: order.totalPrice?.vi || 0, 
                                        ja: order.totalPrice?.ja || 0 
                                    })}
                                </p>
                             </div>
                        </div>
                    </div>
                )) : (
                    <p className="text-sm text-gray-500 text-center py-4">{t.noOrders}</p>
                )}
            </div>
             <div className="mt-8 pt-6 border-t border-gray-100">
                 <button 
                    onClick={() => setCurrentPage("orders-all")}
                    className="w-full text-center text-sm font-medium text-gray-600 hover:text-blue-600 py-2 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors"
                 >
                    {t.seeHistory}
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
