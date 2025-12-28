export interface PCCombos {
  cpu: string;
  mainboard: string;
  ram: string;
  vga: string;
  storage: string;
  psu?: string;
  case?: string;
  cooling?: string;
}

export interface PCFilters {
  cpuFamily: string;
  vgaSeries: string;
  purpose: string;
}

export interface PCConfig {
  productCode: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  brand: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  slug: string;
  searchKey?: string;
  specs: PCCombos;
  filters: PCFilters;
  description?: string;
  isHot?: boolean;
}

export const PC_CONFIGS: PCConfig[] = [
  {
    productCode: "PC-GAMING-ULTRA",
    name: "PC Gaming Ultra Instinct (i9-14900K / RTX 4090 / 64GB DDR5)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Gaming",
    subcategorySlug: "pc-gaming",
    brand: "Republic of Gamers",
    price: 95990000,
    originalPrice: 105000000,
    discount: 9,
    image: "/product/pc-gaming-01.png",
    slug: "pc-gaming-ultra-instinct-i9-14900k-rtx-4090",
    isHot: true,
    specs: {
      cpu: "Intel Core i9 14900K (24 nhân 32 luồng)",
      mainboard: "ASUS ROG MAXIMUS Z790 HERO",
      ram: "64GB Corsair Dominator Titanium DDR5 6600MHz",
      vga: "ASUS ROG Strix GeForce RTX 4090 24GB OC",
      storage: "2TB Samsung 990 Pro NVMe Gen4",
      psu: "ROG Thor 1200W Platinum II",
      case: "Lian Li O11 Dynamic EVO XL",
      cooling: "ROG Ryujin III 360 ARGB",
    },
    filters: {
      cpuFamily: "Intel Core i9",
      vgaSeries: "RTX 4090",
      purpose: "Gaming",
    },
  },
  {
    productCode: "PC-GAMING-CYBER",
    name: "PC Gaming Cyberpunk Edition (i7-14700K / RTX 4080 Super)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Gaming",
    subcategorySlug: "pc-gaming",
    brand: "MSI",
    price: 68500000,
    originalPrice: 75000000,
    discount: 8,
    image: "/product/pc-gaming-02.png",
    slug: "pc-gaming-cyberpunk-i7-14700k-rtx-4080",
    specs: {
      cpu: "Intel Core i7 14700K (20 nhân 28 luồng)",
      mainboard: "MSI MPG Z790 CARBON WIFI",
      ram: "32GB G.Skill Trident Z5 RGB DDR5 6000MHz",
      vga: "MSI GeForce RTX 4080 Super 16GB Gaming X Slim",
      storage: "1TB Kingston KC3000 NVMe Gen4",
      psu: "MSI MPG A1000G PCIE5 1000W Gold",
      case: "Cooler Master HAF 700 Berserker",
      cooling: "MSI MAG CORELIQUID E360",
    },
    filters: {
      cpuFamily: "Intel Core i7",
      vgaSeries: "RTX 4080",
      purpose: "Gaming",
    },
  },
  {
    productCode: "PC-WORKSTATION-PRO",
    name: "PC Workstation Threadripper Pro (Ryzen 7965WX / Dual RTX 6000 Ada)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Workstation",
    subcategorySlug: "pc-workstation",
    brand: "Custom Workstation",
    price: 250000000,
    originalPrice: 280000000,
    discount: 10,
    image: "/product/pc-workstation-01.png",
    slug: "pc-workstation-threadripper-pro-7965wx",
    specs: {
      cpu: "AMD Ryzen Threadripper PRO 7965WX (24 nhân)",
      mainboard: "ASUS Pro WS WRX90E-SAGE SE",
      ram: "128GB (4x32GB) DDR5 ECC R-DIMM",
      vga: "2x NVIDIA RTX 6000 Ada Generation 48GB (NVLink)",
      storage: "4TB Samsung 990 Pro NVMe Gen4",
      psu: "Super Flower Leadex Platinum 1600W",
      case: "Fractal Design Define 7 XL",
      cooling: "Noctua NH-U14S TR5-SP6",
    },
    filters: {
      cpuFamily: "AMD Threadripper",
      vgaSeries: "Quadro/Pro",
      purpose: "Workstation",
    },
  },
  {
    productCode: "PC-OFFICE-LUX",
    name: "PC Office Premium (i5-13500 / 16GB RAM / Design nhỏ gọn)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Văn Phòng",
    subcategorySlug: "pc-van-phong",
    brand: "Asus",
    price: 18900000,
    originalPrice: 21000000,
    discount: 10,
    image: "/product/pc-office-01.png",
    slug: "pc-office-premium-i5-13500",
    specs: {
      cpu: "Intel Core i5 13500 (14 nhân 20 luồng)",
      mainboard: "ASUS ROG STRIX B760-I GAMING WIFI",
      ram: "16GB Kingston Fury Beast DDR5 5200MHz",
      vga: "Intel UHD Graphics 770",
      storage: "512GB Samsung 980 NVMe",
      psu: "InWin 450W Gold (Included)",
      case: "Jonsbo A4 Silver Mini-ITX",
      cooling: "ID-Cooling IS-55 ARGB",
    },
    filters: {
      cpuFamily: "Intel Core i5",
      vgaSeries: "Onboard",
      purpose: "Office",
    },
  },
  {
    productCode: "PC-GAMING-ENTRY",
    name: "PC Gaming Starter (i3-13100F / RTX 3050 / 16GB)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Gaming",
    subcategorySlug: "pc-gaming",
    brand: "Gigabyte",
    price: 12500000,
    originalPrice: 14000000,
    discount: 11,
    image: "/product/pc-gaming-02.png", // Reusing image 2 for variety or use existing
    slug: "pc-gaming-starter-i3-13100f-rtx-3050",
    specs: {
      cpu: "Intel Core i3 13100F",
      mainboard: "Gigabyte H610M H",
      ram: "16GB Corsair Vengeance LPX DDR4 3200MHz",
      vga: "Gigabyte RTX 3050 Eagle OC 6GB",
      storage: "500GB SSD NVMe Gen3",
      psu: "Deepcool PK550D 550W Bronze",
      case: "Xigmatek NYX Air 3F",
    },
    filters: {
      cpuFamily: "Intel Core i3",
      vgaSeries: "RTX 3050",
      purpose: "Gaming",
    },
  },
  {
    productCode: "PC-DESIGNER-MID",
    name: "PC Designer Mid-Range (i5-14600K / RTX 4060 Ti / 32GB)",
    category: "PC",
    categorySlug: "pc-may-tinh-bo",
    subcategory: "PC Workstation",
    subcategorySlug: "pc-workstation",
    brand: "Custom",
    price: 32900000,
    originalPrice: 36000000,
    discount: 9,
    image: "/product/pc-workstation-01.png", // Reusing WS image
    slug: "pc-designer-mid-range-i5-14600k",
    specs: {
      cpu: "Intel Core i5 14600K",
      mainboard: "MSI MAG B760M MORTAR WIFI",
      ram: "32GB Adata XPG Lancer DDR5 6000MHz",
      vga: "Gigabyte RTX 4060 Ti Aero OC 16GB",
      storage: "1TB WD Black SN770 Gen4",
      psu: "Corsair RM750e 750W Gold",
      case: "NZXT H6 Flow White",
      cooling: "Deepcool LT520 White",
    },
    filters: {
      cpuFamily: "Intel Core i5",
      vgaSeries: "RTX 4060 Ti",
      purpose: "Workstation",
    },
  },
];
