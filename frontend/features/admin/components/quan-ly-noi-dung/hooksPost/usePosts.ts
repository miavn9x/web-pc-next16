"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type React from "react";

import {
  postService,
  type Post,
  type PostListItem,
  type MediaCover,
} from "@/features/admin/components/quan-ly-noi-dung/servicsePost/postService";
import { useAdminMedia } from "@/features/admin/hooks/media/useAdminMedia";
import { MediaUsageEnum } from "@/features/admin/types/media/adminMedia.types";

interface UsePostsReturn {
  posts: PostListItem[];
  isLoading: boolean;
  error: string | null;
  createPost: (_postData: {
    title: string;
    description: string;
    content: string;
    cover: MediaCover;
  }) => Promise<Post>;
  updatePost: (
    _code: string,
    _postData: Partial<{
      title?: string;
      description?: string;
      content?: string;
      cover?: MediaCover;
    }>
  ) => Promise<Post>;
  deletePost: (_code: string) => Promise<void>;
  getPost: (_code: string) => Promise<Post | null>;
  refreshPosts: () => Promise<void>;
  uploadImage: (_file: File) => Promise<MediaCover>;
  deleteImage: (_mediaCode: string) => Promise<void>;
  uploadState: {
    isLoading: boolean;
    error: string | null;
  };
  coverImageInputRef: React.RefObject<HTMLInputElement | null>;
  clearCoverInput: () => void;
}

export function usePosts(): UsePostsReturn {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState({
    isLoading: false,
    error: null as string | null,
  });
  const { uploadSingle, uploadSingleState, hardDelete } = useAdminMedia();
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const clearCoverInput = useCallback(() => {
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = "";
    }
  }, []);

  const uploadImage = useCallback(
    async (file: File): Promise<MediaCover> => {
      setUploadState({ isLoading: true, error: null });
      try {
        if (!file) {
          throw new Error("No file selected");
        }
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
          throw new Error("File size exceeds 5MB limit");
        }
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
        ];
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Only JPG, PNG, and GIF files are allowed");
        }

        const result = await uploadSingle(file, MediaUsageEnum.POST);
        const uploadedMedia: MediaCover = {
          mediaCode: result.data.mediaCode,
          url: result.data.url,
        };
        setUploadState({ isLoading: false, error: null });
        return uploadedMedia;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setUploadState({ isLoading: false, error: errorMessage });
        throw new Error(errorMessage);
      }
    },
    [uploadSingle]
  );

  const deleteImage = useCallback(
    async (mediaCode: string): Promise<void> => {
      try {
        if (!mediaCode) {
          return;
        }
        await hardDelete(mediaCode);
        clearCoverInput();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Delete failed";
        throw new Error(errorMessage);
      }
    },
    [hardDelete, clearCoverInput]
  );

  // Helper to handle legacy multi-language data
  const normalizeContent = (content: any): string => {
    if (typeof content === "object" && content !== null && "vi" in content) {
      return content.vi || "";
    }
    return String(content || "");
  };

  const normalizePost = (post: any): Post => {
    return {
      ...post,
      title: normalizeContent(post.title),
      description: normalizeContent(post.description),
      content: normalizeContent(post.content),
    };
  };

  const refreshPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await postService.getPosts();
      // Normalize data to ensure strings even if backend sends legacy objects
      const normalizedPosts = response.items.map((item: any) => ({
        ...item,
        title: normalizeContent(item.title),
        description: normalizeContent(item.description),
      }));
      setPosts(normalizedPosts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load posts";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const createPost = useCallback(
    async (postData: {
      title: string;
      description: string;
      content: string;
      cover: MediaCover;
    }): Promise<Post> => {
      try {
        setError(null);
        const newPost = await postService.createPost(postData);
        const normalizedPost = normalizePost(newPost);
        setPosts((prevPosts) => [
          {
            code: normalizedPost.code,
            title: normalizedPost.title,
            description: normalizedPost.description,
            cover: normalizedPost.cover,
          },
          ...prevPosts,
        ]);
        clearCoverInput();
        return normalizedPost;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create post";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [clearCoverInput]
  );

  const updatePost = useCallback(
    async (
      code: string,
      postData: Partial<{
        title?: string;
        description?: string;
        content?: string;
        cover?: MediaCover;
      }>
    ): Promise<Post> => {
      try {
        setError(null);
        const updatedPost = await postService.updatePost(code, postData);
        const normalizedPost = normalizePost(updatedPost);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.code === code
              ? {
                  code: normalizedPost.code,
                  title: normalizedPost.title,
                  description: normalizedPost.description,
                  cover: normalizedPost.cover,
                }
              : post
          )
        );
        return normalizedPost;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update post";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const deletePost = useCallback(async (code: string): Promise<void> => {
    try {
      setError(null);
      await postService.deletePost(code);
      setPosts((prevPosts) => prevPosts.filter((post) => post.code !== code));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete post";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getPost = useCallback(async (code: string): Promise<Post | null> => {
    try {
      setError(null);
      const post = await postService.getPost(code);
      return normalizePost(post);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get post";
      setError(errorMessage);
      return null;
    }
  }, []);

  const combinedUploadState = {
    isLoading: uploadState.isLoading || uploadSingleState.isLoading,
    error:
      uploadState.error ||
      (uploadSingleState.error ? String(uploadSingleState.error) : null),
  };

  return {
    posts,
    isLoading,
    error,
    createPost,
    updatePost,
    deletePost,
    getPost,
    refreshPosts,
    uploadImage,
    deleteImage,
    uploadState: combinedUploadState,
    coverImageInputRef,
    clearCoverInput,
  };
}

export type { Post, PostListItem, MediaCover };
