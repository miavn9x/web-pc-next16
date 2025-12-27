"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm.");
    setLoading(false);
    // Reset form logic here if needed
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 uppercase">
        Gửi thắc mắc cho chúng tôi
      </h2>
      <p className="text-gray-500 mb-6">
        Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi
        sẽ liên lạc lại với bạn sớm nhất có thể.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Nhập họ tên của bạn"
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="0912 345 678"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            placeholder="Nội dung cần hỗ trợ..."
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-500 text-white font-bold uppercase rounded-lg hover:bg-[#c41530] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed group"
        >
          {loading ? (
            "Đang gửi..."
          ) : (
            <>
              <Send
                size={18}
                className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
              />
              Gửi tin nhắn
            </>
          )}
        </button>
      </form>
    </div>
  );
}
