import {
  Monitor,
  Cpu,
  CircuitBoard,
  HardDrive,
  Zap,
  CreditCard,
} from "lucide-react";
// danh mục sản phẩm
export const categories = [

  { name: "PC - Máy Tính Bộ", icon: <Monitor size={20} /> },

  { name: "CPU - Bộ Vi Xử Lý", icon: <Cpu size={20} /> },
  { name: "Mainboard - Bo Mạch Chủ", icon: <CircuitBoard size={20} /> },
  { name: "VGA - Card Màn Hình", icon: <CreditCard size={20} /> },
  { name: "RAM - Bộ Nhớ Trong", icon: <HardDrive size={20} /> },
  { name: "Ổ Cứng HDD, SSD", icon: <HardDrive size={20} /> },
  { name: "PSU - Nguồn Máy Tính", icon: <Zap size={20} /> },

  { name: "Màn Hình", icon: <Monitor size={20} /> },
];
