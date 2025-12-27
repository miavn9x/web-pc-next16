export const PRODUCT_DETAIL_DATA = {
  pc: {
    productCode: "PC001",
    name: "PC Gaming Ultra Instinct (i9-13900K / RTX 4090 / 64GB RAM)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Gaming",
    subcategorySlug: "pc-gaming",
    brand: "Custom",
    price: 85990000,
    originalPrice: 95000000,
    discount: 10,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200", // Placeholder high quality image
    images: [
       "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1200",
       "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=1200",
       "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200",
       "https://images.unsplash.com/photo-1555617778-dc29ab0101d3?auto=format&fit=crop&q=80&w=1200",
    ],
    slug: "pc-gaming-ultra-instinct-i9-13900k-pc001",
    searchKey: "pc gaming ultra instinct i9 13900k rtx 4090 64gb ram custom",
    specs: {
      cpu: "Intel Core i9-13900K (24 nhân 32 luồng)",
      mainboard: "Gigabyte Z790 Aorus Master",
      ram: "Corsair Dominator Platinum 64GB DDR5 6000MHz",
      vga: "Asus ROG Strix RTX 4090 24GB",
      storage: "Samsung 990 Pro 2TB NVMe Gen4",
      psu: "Thor 1200W 80 Plus Platinum",
      case: "Lian Li O11 Dynamic EVO",
      cooling: "NZXT Kraken Z73 RGB",
    },
    filters: {
      cpuFamily: "Intel Core i9",
      vgaSeries: "RTX 4090",
      purpose: "Gaming",
    },
    description: `
      <div class="space-y-4">
        <h1 class="text-2xl font-bold text-blue-600">Sức mạnh hủy diệt từ cấu hình khủng</h1>
        <p class="text-gray-700 leading-relaxed">
          PC Gaming Ultra Instinct được trang bị vi xử lý <strong>Intel Core i9-13900K</strong> mới nhất với 24 nhân 32 luồng, mang lại hiệu năng xử lý đa nhiệm vượt trội. Kết hợp cùng "quái vật" đồ họa <strong>RTX 4090</strong>, chiếc PC này sẵn sàng chiến mượt mọi tựa game AAA ở độ phân giải 4K Ultra Settings.
        </p>
        <img src="https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000" alt="RTX 4090" class="rounded-lg shadow-lg my-4 w-full object-cover h-96" />
        <h2 class="text-xl font-semibold text-gray-800">Thiết kế tản nhiệt tối ưu</h2>
        <p class="text-gray-700 leading-relaxed">
          Hệ thống tản nhiệt nước <strong>NZXT Kraken Z73 RGB</strong> không chỉ giúp CPU luôn mát mẻ mà còn tạo điểm nhấn thẩm mỹ với màn hình LCD tùy chỉnh. Case <strong>Lian Li O11 Dynamic EVO</strong> khoe trọn linh kiện bên trong với 2 mặt kính cường lực.
        </p>
         <h2 class="text-xl font-semibold text-gray-800">Bộ nhớ & Lưu trữ</h2>
        <ul class="list-disc pl-5 text-gray-700">
            <li>RAM 64GB DDR5 6000MHz đảm bảo đa nhiệm mượt mà, render video 4K nhanh chóng.</li>
            <li>SSD 2TB NVMe Gen4 tốc độ đọc ghi cực cao, load game chỉ trong nháy mắt.</li>
        </ul>
      </div>
    `
  },
  mainboard: {
    productCode: "MB001",
    name: "Mainboard ASUS ROG MAXIMUS Z790 HERO",
    category: "Linh Kiện",
    categorySlug: "linh-kien",
    subcategory: "Mainboard",
    subcategorySlug: "mainboard-bo-mach-chu",
    brand: "ASUS",
    price: 15990000,
    originalPrice: 17000000,
    discount: 5,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200",
    images: [
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200"
    ],
    slug: "mainboard-asus-rog-maximus-z790-hero-mb001",
    searchKey: "mainboard asus rog maximus z790 hero linh kien",
    specs: {
      chipset: "Z790",
      socket: "LGA 1700",
      formFactor: "ATX",
      ramSupport: "DDR5",
      maxRam: "192GB",
      slots: "4 khe",
      wifi: "Wifi 6E",
    },
    filters: {
      priceRange: "Trên 10 Triệu",
      group: "Mainboard Intel",
      chipsetTypes: "Intel Z790",
    },
    description: "<div>Mô tả đang cập nhật...</div>"
  }
};
