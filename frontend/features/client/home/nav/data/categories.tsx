import { Component, Cpu, HardDrive, Wrench, Monitor, Mouse, Network, Camera } from 'lucide-react';

export const categories = [
    { name: "Linh kiện máy tính", icon: <Component size={20} /> },
    { name: "CPU, Mainboard, VGA", icon: <Cpu size={20} /> },
    { name: "RAM, SSD, HDD", icon: <HardDrive size={20} /> },
    { name: "Case, Tản, Nguồn", icon: <Wrench size={20} /> },
    { name: "PC Gaming, Đồ Họa, AI", icon: <Monitor size={20} /> },
    { name: "PC văn phòng - doanh nghiệp", icon: <Monitor size={20} /> },
    { name: "Laptop", icon: <Monitor size={20} /> },
    { name: "Màn hình, Tivi, Máy chiếu", icon: <Monitor size={20} /> },
    { name: "Phím, chuột, tai nghe", icon: <Mouse size={20} /> },
    { name: "Thiết bị mạng", icon: <Network size={20} /> },
    { name: "Thiết bị âm thanh", icon: <Network size={20} /> },
    { name: "Camera, webcam, thẻ nhớ", icon: <Camera size={20} /> },
];
