import { useState } from "react";
import { loginUser } from "../services/LoginService";
import { LoginPayload } from "../types/LoginType";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutate = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await loginUser(payload);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading, error };
};
