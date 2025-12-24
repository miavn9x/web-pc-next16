"use client";
import Link from "next/link"; // Import Link
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRegister } from "../hooks/useRegister";

const Register = () => {
  const { register, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <div className="bg-white min-h-screen">
      <nav className=" text-[13px] px-4 sm:px-6 py-2">
        <div className="container mx-auto">
          <ul className="flex flex-wrap gap-x-1 text-[#b5b5b5] text-xs sm:text-sm">
            <li>
              <Link href="/" className="text-[#b5b52f] hover:underline">
                Trang chủ
              </Link>
              <span className="mx-1">/</span>
            </li>
            <li>
              <Link
                href="/tai-khoan"
                className="text-[#b5b52f] hover:underline"
              >
                Tài khoản
              </Link>
              <span className="mx-1">/</span>
            </li>
            <li className="text-[#b5b5b5]">Đăng ký</li>
          </ul>
        </div>
      </nav>
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <section
          className="bg-white rounded-lg p-6 sm:p-8 max-w-4xl mx-auto"
          aria-label="Đăng ký tài khoản"
        >
          <h1 className="text-[18px] sm:text-[20px] font-semibold mb-2">
            Đăng ký
          </h1>
          <p className="text-[#b5b52f] text-xs sm:text-sm mb-6 sm:mb-8">
            Bạn đã có tài khoản?{" "}
            <Link href="/tai-khoan/dang-nhap" className="underline">
              Đăng nhập ngay
            </Link>
          </p>
          <form
            className="max-w-xl mx-auto"
            aria-label="Form đăng ký"
            onSubmit={(e) => {
              e.preventDefault();
              register(formData);
            }}
          >
            <h2 className="text-[#b5b52f] font-semibold text-center mb-6 text-xs sm:text-sm">
              THÔNG TIN CÁ NHÂN
            </h2>
            {[
              {
                id: "email",
                label: "Email",
                type: "email",
                placeholder: "Nhập email",
              },
              {
                id: "matkhau",
                label: "Mật khẩu",
                type: "password",
                placeholder: "Nhập mật khẩu",
              },
            ].map(({ id, label, type, placeholder }) => {
              if (id === "email") {
                return (
                  <div key={id} className="mb-4">
                    <label
                      htmlFor={id}
                      className="block text-[11px] sm:text-[13px] font-semibold text-[#b5b52f] mb-1"
                    >
                      <span className="text-red-700 text-[9px] sm:text-[10px] align-top">
                        *
                      </span>{" "}
                      {label}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={placeholder}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#b5b52f]"
                    />
                  </div>
                );
              }
              if (id === "matkhau") {
                return (
                  <div key={id} className="mb-4">
                    <label
                      htmlFor={id}
                      className="block text-[11px] sm:text-[13px] font-semibold text-[#b5b52f] mb-1"
                    >
                      <span className="text-red-700 text-[9px] sm:text-[10px] align-top">
                        *
                      </span>{" "}
                      {label}
                    </label>
                    <div className="relative">
                      <input
                        id="matkhau"
                        name="matkhau"
                        type={showPassword ? "text" : "password"}
                        placeholder={placeholder}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#b5b52f] pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                );
              }
              return (
                <div key={id} className="mb-4">
                  <label
                    htmlFor={id}
                    className="block text-[11px] sm:text-[13px] font-semibold text-[#b5b52f] mb-1"
                  >
                    <span className="text-red-700 text-[9px] sm:text-[10px] align-top">
                      *
                    </span>{" "}
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    className="w-full border border-gray-300 rounded px-2 sm:px-3 py-2 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#b5b52f]"
                  />
                </div>
              );
            })}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-normal text-sm sm:text-base rounded-md py-3 hover:bg-yellow-600 transition-colors"
            >
              Đăng ký
            </button>
            {error && (
              <p className="text-red-500 text-xs mt-2 text-center">{error}</p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
};

export default Register;
