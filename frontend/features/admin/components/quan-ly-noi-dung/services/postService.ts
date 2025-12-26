"use client";

import axiosInstance from "@/shared/lib/axios"; // Axios có cấu hình token

export interface MediaCover {
  mediaCode: string;
  url: string;
  _id?: string;
}

export interface Post {
  _id: string;
  code: string;
  title: string;
  description: string;
  content: string;
  cover: MediaCover;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PostListItem {
  code: string;
  title: string;
  description: string;
  cover: MediaCover;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
  errorCode: string | null;
}

export interface ListApiResponse<T>
  extends ApiResponse<{ items: T[]; pagination: Pagination }> {}

class PostService {
  private baseUrl = "/posts"; // Đã có baseURL trong axiosInstance

  // GET /api/posts?page=x&limit=y - Lấy danh sách bài viết
  async getPosts(
    page = 1,
    limit = 50
  ): Promise<{ items: PostListItem[]; pagination: Pagination }> {
    try {
      const response = await axiosInstance.get<ListApiResponse<PostListItem>>(
        `${this.baseUrl}?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch posts");
    }
  }

  // GET /api/posts/:code - Lấy chi tiết một bài viết theo mã
  async getPost(code: string): Promise<Post | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Post>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`
      );
      return response.data.data;
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        return null;
      }
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string" &&
        error.message.includes("404")
      ) {
        return null;
      }
      throw new Error("Failed to fetch post");
    }
  }

  // POST /api/posts - Tạo mới bài viết
  async createPost(
    postData: Omit<Post, "_id" | "code" | "createdAt" | "updatedAt" | "__v">
  ): Promise<Post> {
    try {
      const response = await axiosInstance.post<ApiResponse<Post>>(
        this.baseUrl,
        postData
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to create post");
    }
  }

  // PATCH /api/posts/:code - Cập nhật bài viết (changed from PUT to PATCH)
  async updatePost(
    code: string,
    postData: Partial<{
      title?: string;
      description?: string;
      content?: string;
      cover?: MediaCover;
    }>
  ): Promise<Post> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Post>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`,
        postData
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to update post");
    }
  }

  // DELETE /api/posts/:code - Xoá bài viết
  async deletePost(code: string): Promise<Post> {
    try {
      const response = await axiosInstance.delete<ApiResponse<Post>>(
        `${this.baseUrl}/${encodeURIComponent(code)}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to delete post");
    }
  }
}

export const postService = new PostService();
