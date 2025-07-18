import { AuthService } from "@/services/auth.service";
import { LoginRequest } from "@/types/login-request";
import { useState } from "react";

export const useAuth = () => {
  const authService = AuthService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const login = async (loginRequest: LoginRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await authService.login(loginRequest);
      return response;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    logout,
    loading,
    error
  }
};
