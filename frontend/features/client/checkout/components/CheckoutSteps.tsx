"use client";

import { Check } from "lucide-react";

interface CheckoutStepsProps {
  currentStep: number;
}

const STEPS = [
  { id: 1, name: "Giỏ hàng" },
  { id: 2, name: "Thông tin & Thanh toán" },
  { id: 3, name: "Hoàn tất" },
];

export default function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="w-full ">
      <div className="flex items-start justify-center">
        {STEPS.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-start">
              {/* Step Circle & Text */}
              <div className="flex flex-col items-center z-10">
                <div
                  className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all duration-300 border ${
                    isCompleted
                      ? "bg-white text-green-600 border-green-600"
                      : isCurrent
                      ? "bg-white text-[#E31837] border-[#E31837] shadow-sm ring-2 ring-red-50"
                      : "bg-white text-gray-400 border-gray-300"
                  }`}
                >
                  {isCompleted ? <Check size={14} strokeWidth={3} /> : step.id}
                </div>
                <div
                  className={`mt-2 w-auto px-2 text-center text-[10px] md:text-xs font-bold transition-colors duration-300 ${
                    isCurrent ? "text-[#E31837]" : "text-gray-500"
                  }`}
                >
                  {step.name}
                </div>
              </div>

              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div
                  className={`w-6 md:w-16 h-[2px] mx-1 mt-3 rounded transition-all duration-300 ${
                    isCompleted ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
