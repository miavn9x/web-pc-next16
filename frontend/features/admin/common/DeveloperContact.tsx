"use client";

const DeveloperContact = () => {
  return (
    <div className="mt-6 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start">
        <div className="shrink-0">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="h-6 w-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Cần hỗ trợ kỹ thuật?
          </h3>
          <p className="text-gray-600 mb-4">
            Để tích hợp đầy đủ tính năng này với hệ thống thực tế, vui lòng liên
            hệ đội ngũ phát triển của chúng tôi.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📧</span>
              <div>
                <div className="text-sm font-medium text-gray-900">Email</div>
                <div className="text-sm text-gray-600">dev@wfourtech.com</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📱</span>
              <div>
                <div className="text-sm font-medium text-gray-900">Hotline</div>
                <div className="text-sm text-gray-600">0123-456-789</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💬</span>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Zalo/Telegram
                </div>
                <div className="text-sm text-gray-600">@wfourtech_dev</div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Liên hệ ngay
            </button>
            <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md text-sm hover:bg-blue-50 transition-colors">
              Xem báo giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperContact;
