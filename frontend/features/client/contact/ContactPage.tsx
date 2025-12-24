import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Liên hệ với chúng tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <h2 className="text-xl font-semibold">Thông tin liên hệ</h2>
           <p className="flex items-center gap-2"><MapPin size={20}/> Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
           <p className="flex items-center gap-2"><Phone size={20}/> Hotline: 1900 1234</p>
           <p className="flex items-center gap-2"><Mail size={20}/> Email: contact@vuabanhtrangjb.com</p>
        </div>
        <form className="space-y-4 border p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold">Gửi tin nhắn</h2>
            <div>
                <label className="block mb-1 font-medium">Họ tên</label>
                <input type="text" className="w-full border p-2 rounded" placeholder="Nhập họ tên của bạn" />
            </div>
            <div>
                <label className="block mb-1 font-medium">Email</label>
                <input type="email" className="w-full border p-2 rounded" placeholder="Nhập email của bạn" />
            </div>
            <div>
                <label className="block mb-1 font-medium">Nội dung</label>
                <textarea className="w-full border p-2 rounded h-32" placeholder="Nội dung cần liên hệ..."></textarea>
            </div>
            <button type="button" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full">Gửi liên hệ</button>
        </form>
      </div>
    </div>
  );
}
