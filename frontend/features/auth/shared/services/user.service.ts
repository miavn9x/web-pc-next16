import axiosInstance from "@/shared/lib/axios"; // hoặc đường dẫn đúng của bạn

export const userService = {
  async getCurrentUser() {
    try {
      const response = await axiosInstance.get("/user/me");
      return response.data.data;
    } catch (error) {
      // console.error("Lỗi khi lấy thông tin người dùng:", error);
      throw error;
    }
  },
};
