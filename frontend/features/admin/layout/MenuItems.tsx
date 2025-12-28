"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  FileText,
  Globe,
  Home,
  Ticket,
  Users,
  ChevronRight,
  ChevronDown,
  BookOpen,
  FolderTree,
  type LucideIcon,
} from "lucide-react";
import { useAdminPage } from "../contexts/AdminPageContext";
import { useSidebar } from "../contexts/SidebarContext";

interface MenuItemsProps {
  isSidebarOpen: boolean;
  idPrefix?: string;
}

interface SubMenuItem {
  label: string;
  page: string;
}

interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  page?: string;
  isWebLink?: boolean;
  href?: string;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const MenuItems = ({ isSidebarOpen, idPrefix = "" }: MenuItemsProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { setCurrentPage } = useAdminPage();
  const { toggleSidebar, toggleMobileMenu, isMobile } = useSidebar();

  const toggleSubmenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  // Mapping cho trang mặc định khi sidebar đóng
  const getDefaultPageForCollapsedMenu = (itemId: string): string | null => {
    const defaultPages: Record<string, string> = {
      products: "products-list",
      categories: "categories-list",
      orders: "orders-all",
      customers: "customers-list",
      users: "users-customers",
      coupons: "coupons-list",
      content: "content-posts",
      media: "media-gallery",
      reports: "reports-revenue",
      payment: "payment-methods",
      settings: "settings-website",
      security: "security-password",
      "developer-guide": "product-management",
    };
    return defaultPages[itemId] || null;
  };

  const menuSections: MenuSection[] = [
    // {
    //   title: "HƯỚNG DẪN",
    //   items: [
    //     {
    //       id: "guide-center",
    //       icon: BookOpen,
    //       label: "Trung tâm HD",
    //       page: "guide-center",
    //     },
    //   ],
    // },
    {
      title: "TỔNG QUAN",
      items: [
        {
          id: "dashboard",
          icon: Home,
          label: "Dashboard",
          page: "dashboard",
        },
        {
          id: "website",
          icon: Globe,
          label: "Xem trang web",
          isWebLink: true,
          href: "/",
        },
      ],
    },
    {
      title: "QUẢN LÝ SẢN PHẨM",
      items: [
        {
          id: "products",
          icon: Package,
          label: "Sản phẩm",
          hasSubmenu: true,
          submenu: [
            { label: "Danh sách sản phẩm", page: "products-list" },
            { label: "Thêm sản phẩm", page: "products-add" },
          ],
        },
      ],
    },
    {
      title: "QUẢN LÝ DANH MỤC",
      items: [
        {
          id: "categories",
          icon: FolderTree,
          label: "Danh mục",
          hasSubmenu: true,
          submenu: [
            { label: "Danh sách danh mục", page: "categories-list" },
            { label: "Tạo danh mục", page: "categories-create" },
          ],
        },
      ],
    },
    {
      title: "QUẢN LÝ ĐƠN HÀNG",
      items: [
        {
          id: "orders",
          icon: ShoppingCart,
          label: "Đơn hàng",
          hasSubmenu: true,
          submenu: [{ label: "Tất cả đơn hàng", page: "orders-all" }],
        },
      ],
    },
    {
      title: "QUẢN LÝ KHÁCH HÀNG",
      items: [
        {
          id: "customers",
          icon: Users,
          label: "Khách hàng",
          page: "customers-list",
        },
      ],
    },

    {
      title: "QUẢN LÝ NỘI DUNG",
      items: [
        {
          id: "content",
          icon: FileText,
          label: "Nội dung",
          hasSubmenu: true,
          submenu: [
            { label: "Danh sách bài viết", page: "content-posts" },
            { label: "Đăng bài viết", page: "content-create-post" },
          ],
        },
      ],
    },
    {
      title: "QUẢN LÝ QUẢNG CÁO",
      items: [
        {
          id: "advertisements",
          icon: Globe, // Tạm dùng icon Globe hoặc tìm cái khác
          label: "Quảng cáo",
          page: "ads-manager",
        },
      ],
    },
    {
      title: "QUẢN LÝ KHUYẾN MÃI",
      items: [
        {
          id: "coupons",
          icon: Ticket,
          label: "Mã giảm giá",
          hasSubmenu: true,
          submenu: [
            { label: "Danh sách mã", page: "coupons-list" },
            { label: "Thêm mã mới", page: "coupons-add" },
          ],
        },
      ],
    },
  ];

  const handleItemClick = (item: MenuItem) => {
    if (item.isWebLink && item.href) {
      window.open(item.href, "_blank");
      return;
    } else if (item.hasSubmenu) {
      // Nếu sidebar đang đóng và không phải mobile
      if (!isSidebarOpen && !isMobile) {
        // Mở trang mặc định và mở sidebar
        const defaultPage = getDefaultPageForCollapsedMenu(item.id);
        if (defaultPage) {
          setCurrentPage(defaultPage);
        }
        toggleSidebar(); // Mở sidebar
        return;
      }
      // Nếu sidebar đang mở và không phải mobile, toggle submenu
      if (isSidebarOpen && !isMobile) {
        toggleSubmenu(item.id);
        return;
      }
      // Nếu là mobile, toggle submenu
      toggleSubmenu(item.id);
    } else if (item.page) {
      // Nếu sidebar đang đóng và không phải mobile, mở sidebar và navigate
      if (!isSidebarOpen && !isMobile) {
        setCurrentPage(item.page);
        toggleSidebar();
        return;
      }
      // Nếu sidebar đã mở, navigate đến trang
      setCurrentPage(item.page);
      // Đóng menu tương ứng dựa trên thiết bị
      if (isMobile) {
        toggleMobileMenu(); // Đóng mobile menu trên thiết bị di động
      }
    }
  };

  const handleSubItemClick = (subItem: SubMenuItem) => {
    if (subItem.page) {
      setCurrentPage(subItem.page);
      // Đóng menu tương ứng dựa trên thiết bị
      if (isMobile) {
        toggleMobileMenu(); // Đóng mobile menu trên thiết bị di động
      }
    }
  };

  return (
    <div className="py-4">
      {menuSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-2">
          {isSidebarOpen && (
            <h3 className="px-4 py-2 text-red-600 font-bold text-sm">
              {section.title}
            </h3>
          )}

          {section.items.map((item) => (
            <div key={item.id}>
              <div
                id={`${idPrefix}${item.id}`}
                className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${
                  item.isWebLink
                    ? "text-blue-600 hover:bg-blue-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => handleItemClick(item)}
                title={!isSidebarOpen ? item.label : ""}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 shrink-0 ${
                    item.isWebLink ? "text-blue-600" : "text-gray-500"
                  }`}
                />

                {isSidebarOpen && (
                  <>
                    <span
                      className={`grow ${
                        item.isWebLink ? "text-blue-600 font-medium" : ""
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.hasSubmenu &&
                      (activeMenu === item.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      ))}
                  </>
                )}
              </div>

              {item.hasSubmenu &&
                activeMenu === item.id &&
                isSidebarOpen &&
                item.submenu && (
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        id={`${idPrefix}menu-subitem-${subItem.page}`}
                        className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 cursor-pointer text-sm transition-colors"
                        onClick={() => handleSubItemClick(subItem)}
                      >
                        <span>{subItem.label}</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MenuItems;
