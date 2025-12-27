# Danh Mục Sản Phẩm (Dự Kiến Database)

## 1. PC (Máy Tính Bộ)

### PC Chơi Game

- PC Gaming (< 10tr)
- PC Gaming (10-15tr)
- PC Gaming (15-25tr)
- PC Gaming (25-40tr)
- PC Gaming (> 40tr)

### PC Đồ Họa & Văn Phòng

- PC Đồ Họa, PC Giả Lập
- PC Văn Phòng, PC Đồng Bộ
- **Theo Mức Giá**:

  - Dưới 5 Triệu
  - 5 - 8 Triệu
  - 8 - 12 Triệu
  - 12 - 15 Triệu
  - 15 - 20 Triệu
  - Trên 20 Triệu

- **CPU**: Bộ Vi Xử Lý
  - CPU Intel
  - CPU AMD
  - _Mức Giá_: Dưới 3tr, 3-5tr, 5-10tr, 10-15tr, > 15tr
- **Mainboard**: Bo Mạch Chủ

  - Mainboard Intel: Z790/Z690, B760/B660, H610...
  - Mainboard AMD: X670/X670E, B650/B650E, X570...
  - _Mức Giá_: Dưới 2tr, 2-5tr, 5-10tr, > 10tr

- **VGA**: Card Màn Hình

  - NVIDIA GeForce: RTX 4090, 4080, 4070...
  - AMD Radeon: RX 7900, 7800...
  - _Mức Giá_: Dưới 5tr, 5-10tr, 10-20tr, 20-40tr, > 40tr

- **RAM**: Bộ Nhớ Trong
  - Loại: DDR5, DDR4, DDR3,
  - Dung lượng:4GB, 8GB, 16GB, 32GB, 64GB...
  - _Mức Giá_: Dưới 1tr, 1-3tr, 3-5tr, > 5tr
- **Storage**: Ổ Cứng HDD, SSD
  - Loại: SSD NVMe, SSD SATA, HDD...
  - Dung lượng: 256GB, 512GB, 1TB, 2TB...
  - _Mức Giá_: Dưới 1tr, 1-2tr, 2-3tr, 3-5tr, > 5tr
- **PSU**: Nguồn Máy Tính
  - Chuẩn: 80 Plus Bronze, Gold, Platinum...
  - Công suất: <500W, 500-650W, 650-750W, >750W...
  - _Mức Giá_: Dưới 1tr, 1-2tr, 2-3tr, 3-5tr, > 5tr

## 3. Phụ Kiện & Thiết Bị Ngoại Vi

- **Màn Hình**: Monitor
  - Kích thước: 24", 27", 32", Ultrawide...
  - _Mức Giá_: Dưới 3tr, 3-5tr, 5-10tr, > 10tr

---

---

# 🛠️ PHẦN KỸ THUẬT: Cấu Trúc Data Chuẩn & Ví Dụ Đầy Đủ (JSON)

> **Mô hình**: Dữ liệu Menu này sẽ được **Lưu Trực Tiếp Trong Database** (Table: `Menus` hoặc `Categories`).
> Frontend sẽ gọi API để lấy cục JSON này về và hiển thị. Admin sẽ có Tool để sửa cục JSON này.

## 1. Ví Dụ: PC GAMING (Đầy đủ nhất)

```json
{
  "productCode": "PC001",
  "name": "PC Gaming Ultra Instinct (i9-13900K / RTX 4090 / 64GB RAM)",
  "category": "PC",
  "categorySlug": "pc-may-tinh-bo", // Dùng để tạo URL cấp 1
  "subcategory": "PC Gaming",
  "subcategorySlug": "pc-gaming", // Dùng để tạo URL cấp 2
  "brand": "Custom",
  "price": 85990000,
  "originalPrice": 95000000,
  "discount": 10,
  "image": "https://example.com/pc_image.jpg",
  "slug": "pc-gaming-ultra-instinct-i9-13900k-pc001", // URL sẽ là: domain.com/pc-gaming-ultra-instinct-i9-13900k-pc001
  "searchKey": "pc gaming ultra instinct i9 13900k rtx 4090 64gb ram custom", // Chuỗi tìm kiếm (Tự sinh khi lưu)

  // 1. DATA ĐỂ TẠO BẢNG THÔNG SỐ (Tự động) & Lọc chi tiết
  "specs": {
    "cpu": "Intel Core i9-13900K (24 nhân 32 luồng)",
    "mainboard": "Gigabyte Z790 Aorus Master",
    "ram": "Corsair Dominator Platinum 64GB DDR5 6000MHz",
    "vga": "Asus ROG Strix RTX 4090 24GB",
    "storage": "Samsung 990 Pro 2TB NVMe Gen4",
    "psu": "Thor 1200W 80 Plus Platinum",
    "case": "Lian Li O11 Dynamic EVO",
    "cooling": "NZXT Kraken Z73 RGB"
  },

  // 2. DATA ĐỂ LỌC & GÁN MENU (Frontend dùng cái này để phân loại)
  "filters": {
    "cpuFamily": "Intel Core i9",
    "vgaSeries": "RTX 4090",
    "purpose": "Gaming" // Dùng để gom vào nhóm PC Gaming
  },

  // 3. MÔ TẢ (Bài viết marketing - Soạn thảo bằng Editor)
  "description": "<div><h1>Sức mạnh hủy diệt</h1><p>PC Gaming Ultra Instinct mang đến...</p><img src='...' /></div>"
}
```

## 2. Ví Dụ: MAINBOARD (Linh Kiện)

```json
{
  "productCode": "MB001",
  "name": "Mainboard ASUS ROG MAXIMUS Z790 HERO",
  "category": "Linh Kiện",
  "categorySlug": "linh-kien",
  "subcategory": "Mainboard",
  "subcategorySlug": "mainboard-bo-mach-chu",
  "brand": "ASUS",
  "price": 15990000,
  "originalPrice": 17000000,
  "discount": 5,
  "image": "https://example.com/z790_hero.jpg",
  "slug": "mainboard-asus-rog-maximus-z790-hero-mb001",
  "searchKey": "mainboard asus rog maximus z790 hero linh kien",

  "specs": {
    "chipset": "Z790",
    "socket": "LGA 1700",
    "formFactor": "ATX",
    "ramSupport": "DDR5",
    "maxRam": "192GB",
    "slots": "4 khe",
    "wifi": "Wifi 6E"
  },

  "filters": {
    "priceRange": "Trên 10 Triệu",
    "group": "Mainboard Intel", // Để hiện trong menu Mainboard Intel
    "chipsetTypes": "Intel Z790" // Để hiện trong menu con Z790
  }
}
```

---

## 3. Nội Dung `specs` Cho Từng Loại (Form Nhập Liệu)

Khi chọn danh mục, Form sẽ tự động hiện các ô nhập này:

#### 🖥️ A. PC (Máy Tính Bộ)

```json
"specs": {
  "cpu": "Intel Core i5-12400F",
  "vga": "RTX 3060 12GB",
  "ram": "16GB DDR4 3200MHz",
  "storage": "500GB SSD NVMe",
  "mainboard": "B760M",
  "psu": "650W Bronze",
  "case": "Xigmatek Gaming X"
}
```

_(Các mục specs khác như cũ - đã lưu)_

---

## 4. MASTER MENU DATA (Dữ Liệu Menu Cần Lưu Vào DB)

> **Cấu trúc phẳng, đồng nhất 100%**: Mỗi item chỉ dùng 4 trường cố định: `label`, `category`, `subcategory`, `price_min`, `price_max`.
>
> - `subcategory = null` nghĩa là lọc toàn bộ danh mục cha.
> - `price_max = null` nghĩa là không giới hạn trên.

```json
[
  {
    "label": "PC - Máy Tính Bộ",
    "children": [
      {
        "groupName": "PC CHƠI GAME",
        "items": [
          {
            "label": "PC Gaming (< 10tr)",
            "category": "PC",
            "subcategory": "PC Gaming"
          },
          {
            "label": "PC Gaming (10-15tr)",
            "category": "PC",
            "subcategory": "PC Gaming"
          },
          {
            "label": "PC Gaming (15-25tr)",
            "category": "PC",
            "subcategory": "PC Gaming"
          },
          {
            "label": "PC Gaming (> 40tr)",
            "category": "PC",
            "subcategory": "PC Gaming"
          }
        ]
      },
      {
        "groupName": "PC VĂN PHÒNG",
        "items": [
          {
            "label": "PC Đồ Họa",
            "category": "PC",
            "subcategory": "PC Đồ Họa"
          },
          {
            "label": "PC Văn Phòng",
            "category": "PC",
            "subcategory": "PC Văn Phòng"
          }
        ]
      },
      {
        "groupName": "THEO MỨC GIÁ",
        "items": [
          {
            "label": "Dưới 5 Triệu",
            "category": "PC",
            "subcategory": null,
            "price_min": 0,
            "price_max": 5000000
          },
          {
            "label": "5 - 8 Triệu",
            "category": "PC",
            "subcategory": null,
            "price_min": 5000000,
            "price_max": 8000000
          },
          {
            "label": "Trên 20 Triệu",
            "category": "PC",
            "subcategory": null,
            "price_min": 20000000,
            "price_max": null
          }
        ]
      }
    ]
  },

  {
    "label": "Linh Kiện Máy Tính",
    "children": [
      {
        "groupName": "CPU - BỘ VI XỬ LÝ",
        "items": [
          {
            "label": "CPU Intel",
            "category": "Linh Kiện",
            "subcategory": "CPU Intel"
          },
          {
            "label": "CPU AMD",
            "category": "Linh Kiện",
            "subcategory": "CPU AMD"
          },
          {
            "label": "Dưới 3 Triệu",
            "category": "Linh Kiện",
            "subcategory": "CPU",
            "price_min": 0,
            "price_max": 3000000
          }
        ]
      },
      {
        "groupName": "MAINBOARD - BO MẠCH CHỦ",
        "items": [
          {
            "label": "Mainboard Intel",
            "category": "Linh Kiện",
            "subcategory": "Mainboard Intel"
          },
          {
            "label": "Mainboard AMD",
            "category": "Linh Kiện",
            "subcategory": "Mainboard AMD"
          },
          {
            "label": "Dưới 2 Triệu",
            "category": "Linh Kiện",
            "subcategory": "Mainboard",
            "price_min": 0,
            "price_max": 2000000
          }
        ]
      },
      {
        "groupName": "VGA - CARD MÀN HÌNH",
        "items": [
          {
            "label": "NVIDIA GeForce",
            "category": "Linh Kiện",
            "subcategory": "VGA NVIDIA"
          },
          {
            "label": "AMD Radeon",
            "category": "Linh Kiện",
            "subcategory": "VGA AMD"
          },
          {
            "label": "Trên 40 Triệu",
            "category": "Linh Kiện",
            "subcategory": "VGA",
            "price_min": 40000000,
            "price_max": null
          }
        ]
      },
      {
        "groupName": "LINH KIỆN KHÁC",
        "items": [
          {
            "label": "RAM",
            "category": "Linh Kiện",
            "subcategory": "RAM"
          },
          {
            "label": "SSD/HDD",
            "category": "Linh Kiện",
            "subcategory": "Storage"
          },
          {
            "label": "PSU",
            "category": "Linh Kiện",
            "subcategory": "PSU"
          },
          {
            "label": "Màn Hình",
            "category": "Thiết Bị",
            "subcategory": "Monitor"
          }
        ]
      }
    ]
  }
]
```

```
**
```
