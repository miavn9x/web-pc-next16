"use client";
import axiosInstance from "@/shared/lib/axios";
import { useEffect, useState } from "react";

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      try {
        await axiosInstance.post("/auth/re-access-token");
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    refresh();
  }, []);

  return { loading };
};
