import * as LucideIcons from "lucide-react";
import React from "react";

// 1. Define Custom Icons not in Lucide
export const Vga = ({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 7v10" />
    <path d="M5 5h17a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    <circle cx="9.5" cy="12" r="2.5" />
    <circle cx="16.5" cy="12" r="2.5" />
    <path d="M2 12h1" />
  </svg>
);

// 2. Create Registry
export const IconRegistry = { ...LucideIcons, Vga };

// 3. Helper to get icon component
export const getIconComponent = (name: string) => {
  if (!name) return null;
  return (IconRegistry as any)[name] || null;
};
