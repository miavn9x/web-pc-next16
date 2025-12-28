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

> **Giải thích**:
>
> 1. Form nhập liệu sẽ dựa vào `category` để hiển thị các ô nhập `specs`.
> 2. `specs`: Dữ liệu dùng để **tự tạo bảng thông số kỹ thuật** và lọc chi tiết.
> 3. `filters`: Các trường key quan trọng để map vào **Menu** và **Bộ lọc tìm kiếm**.

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

#### 🧩 B. CPU (Bộ Vi Xử Lý)

```json
"specs": {
  "socket": "LGA 1700",
  "cores": "10 nhân",
  "threads": "16 luồng",
  "baseClock": "3.7GHz",
  "boostClock": "4.9GHz"
}
```

#### 🧩 C. Mainboard (Bo Mạch Chủ)

```json
"specs": {
  "chipset": "Z790", // Quan trọng để chia menu Intel/AMD
  "socket": "LGA 1700",
  "formFactor": "ATX",
  "ramSupport": "DDR5"
}
```

#### 🧩 D. VGA (Card Màn Hình)

```json
"specs": {
  "gpu": "GeForce RTX 4070", // Quan trọng để chia dòng
  "vram": "12GB",
  "busWidth": "192-bit"
}
```

#### 🧩 E. RAM (Bộ Nhớ Trong)

```json
"specs": {
  "type": "DDR5",
  "capacity": "32GB",
  "bus": "6000MHz",
  "led": "RGB"
}
```

#### 🧩 F. Storage (Ổ Cứng)

```json
"specs": {
  "type": "SSD NVMe",
  "capacity": "1TB",
  "connection": "PCIe Gen4"
}
```

#### 🧩 G. PSU (Nguồn)

```json
"specs": {
  "capacity": "750W",
  "certification": "80 Plus Gold",
  "modular": "Full Modular"
}
```

#### 🖱️ H. Màn Hình

```json
"specs": {
  "size": "27 inch",
  "resolution": "2K",
  "panel": "IPS",
  "refreshRate": "165Hz"
}
```

---

## 4. Ví Dụ Cấu Hình Menu (Frontend dùng JSON)

Đây chính là file `menuConfig.json` mà Frontend sẽ dùng:

```json
{
  "label": "PC - Máy Tính Bộ",
  "children": [
    {
      "groupName": "PC CHƠI GAME",
      "items": [
        {
          "label": "PC Gaming (< 10tr)",
          "query": { "subcategorySlug": "pc-gaming", "maxPrice": 10000000 }
        },
        {
          "label": "PC Gaming (10-15tr)",
          "query": {
            "subcategorySlug": "pc-gaming",
            "minPrice": 10000000,
            "maxPrice": 15000000
          }
        },
        {
          "label": "PC Gaming (15-25tr)",
          "query": {
            "subcategorySlug": "pc-gaming",
            "minPrice": 15000000,
            "maxPrice": 25000000
          }
        },
        {
          "label": "PC Gaming (> 40tr)",
          "query": { "subcategorySlug": "pc-gaming", "minPrice": 40000000 }
        }
      ]
    },
    {
      "groupName": "THEO MỨC GIÁ",
      "items": [
        {
          "label": "Dưới 5 Triệu",
          "query": { "categorySlug": "pc-may-tinh-bo", "maxPrice": 5000000 }
        },
        {
          "label": "Trên 20 Triệu",
          "query": { "categorySlug": "pc-may-tinh-bo", "minPrice": 20000000 }
        }
      ]
    }
  ]
}

// ==============================================================================
// 5. Ví Dụ Cấu Hình Menu Cho MAINBOARD (Khoảng giá khác hẳn PC)
// ==============================================================================

{
  "label": "Linh Kiện Máy Tính",
  "children": [
    {
      "groupName": "MAINBOARD - BO MẠCH CHỦ",
      "items": [
        {
          "label": "Mainboard Intel",
          "query": { "subcategorySlug": "mainboard-bo-mach-chu", "filters.group": "Mainboard Intel" }
        },
        {
          "label": "Mainboard AMD",
          "query": { "subcategorySlug": "mainboard-bo-mach-chu", "filters.group": "Mainboard AMD" }
        }
      ]
    },
    {
      "groupName": "THEO MỨC GIÁ (Mainboard)",
      "items": [
        {
          "label": "Dưới 2 Triệu",
          "query": { "subcategorySlug": "mainboard-bo-mach-chu", "maxPrice": 2000000 }
        },
        {
          "label": "2 - 5 Triệu",
          "query": { "subcategorySlug": "mainboard-bo-mach-chu", "minPrice": 2000000, "maxPrice": 5000000 }
        },
        {
          "label": "5 - 10 Triệu",
          "query": { "subcategorySlug": "mainboard-bo-mach-chu", "minPrice": 5000000, "maxPrice": 10000000 }
        },
        {
          "label": "Trên 10 Triệu",
          "query": { "subcategorySlug": "mainboard-bo-mach-chu", "minPrice": 10000000 }
        }
      ]
    }
  ]
}
```



tao cân categories theo khi tao danh mục sẻ có dât dang nhu nay.
luu ý children ca tôi da tạo được 2 children con không giới hạn
