"use client";

import React, { useState } from "react";
import * as LucideIcons from "lucide-react";

import { Vga } from "@/shared/components/icons/IconRegistry";

// 2. Create Registry
const IconRegistry = { ...LucideIcons, Vga };

// 3. List of relevant icon names for tech store
const ALLOWED_ICONS = [
  // --- PC COMPONENTS (Linh kiện) ---
  "Vga", // Custom VGA Icon (Prioritized)
  "PcCase",
  "Monitor",
  "Cpu",
  "Microchip",
  "CircuitBoard",
  "MemoryStick",
  "HardDrive",
  "Database",
  "Disc",
  "Save",
  "Fan",
  "Wind",
  "Thermometer",
  "Droplet",
  "Plug",
  "Zap",
  "Power",
  "Battery",
  "BatteryCharging",
  "Cable",
  "Component",
  "Box",
  "Package",
  "Container",

  // --- DEVICES (Thiết bị) ---
  "Laptop",
  "Smartphone",
  "Tablet",
  "Computer",
  "Server",
  "Tv",
  "Tv2",
  "Projector",
  "Radio",
  "Watch",
  "Glasses",
  "Printer",
  "Scanner",
  "Camera",
  "Video",
  "Webcam",

  // --- PERIPHERALS & AUDIO (Phụ kiện & Âm thanh) ---
  "Keyboard",
  "Mouse",
  "MousePointer",
  "MousePointer2",
  "Headphones",
  "Headset",
  "Speaker",
  "Mic",
  "Mic2",
  "Gamepad",
  "Gamepad2",
  "Joystick",
  "Swords",

  // --- CONNECTIVITY (Kết nối) ---
  "Wifi",
  "Router",
  "Signal",
  "Network",
  "Globe",
  "Bluetooth",
  "Usb",
  "HdmiPort",
  "Cast",
  "Airplay",
  "RadioReceiver",
  "Satellite",

  // --- ABSTRACT & TOOLS (Trừu tượng & Công cụ) ---
  "Shield",
  "ShieldCheck",
  "Lock",
  "Unlock",
  "Wrench",
  "Hammer",
  "Settings",
  "Sliders",
  "CreditCard",
  "Wallet",
  "Banknote",
  "Tags",
  "Image",
  "FileDigit",
  "FileVideo",
  "FileAudio",
  "Layers",
  "Layout",
  "Grid",
  "List",
  "CheckCircle2",
  "AlertCircle",
  "HelpCircle",
  "Info",
];

interface IconSelectorProps {
  value?: string | null;
  onChange: (iconName: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get the actual Icon component based on value
  const SelectedIcon = value ? (IconRegistry as any)[value] : null;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Biểu tượng (Icon)
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {SelectedIcon ? (
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <SelectedIcon size={20} />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
              <LucideIcons.Image size={20} />
            </div>
          )}
          <span
            className={value ? "text-gray-900 font-medium" : "text-gray-400"}
          >
            {value || "Chọn biểu tượng..."}
          </span>
        </div>
        <LucideIcons.ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Grid */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white border border-gray-200 shadow-xl rounded-xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap gap-1">
            {ALLOWED_ICONS.map((iconName) => {
              const IconComponent = (IconRegistry as any)[iconName];
              if (!IconComponent) return null;

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => {
                    onChange(iconName);
                    setIsOpen(false);
                  }}
                  className={`p-1.5 rounded-lg flex flex-col items-center justify-center hover:bg-blue-50 transition-colors w-10 h-10 ${
                    value === iconName
                      ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                      : "text-gray-600"
                  }`}
                  title={iconName}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default IconSelector;
