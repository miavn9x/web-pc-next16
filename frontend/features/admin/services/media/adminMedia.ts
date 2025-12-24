// TUYỆT ĐỐI KHÔNG SỬA CODE NAY

import { MediaUsageEnum } from "../../types/media/adminMedia.types";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/media`;

export const mediaService = {
  async uploadSingle(file: File, usage: MediaUsageEnum) {
    const formData = new FormData();
    formData.append("file", file); // Gửi tệp với tên trường "file"
    formData.append("usage", usage); // Gửi giá trị enum (ví dụ: "PRODUCT_COVER") với tên trường "usage"

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw result;
    return result;
  },

  async uploadMultiple(files: File[], usage: MediaUsageEnum) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("usage", usage);

    const res = await fetch(`${API_BASE}/uploads`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw result;
    return result;
  },

  async hardDelete(mediaCode: string) {
    const res = await fetch(`${API_BASE}/${mediaCode}/hard-delete`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await res.json();
    if (!res.ok) throw result;
    return result;
  },
};
