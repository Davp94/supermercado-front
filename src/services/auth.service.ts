import { apiClient } from "@/config/service.config";
import { LoginRequest } from "@/types/login-request";
import { LoginResponse } from "@/types/login-response";
import axios from "axios";

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        loginRequest
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error en autenticacion"
        );
      }
      throw new Error("Error en autenticacion");
    }
  }

  async logout(): Promise<void> {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  async refreshToken(): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/auth/refresh-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw new Error("Error en autenticacion");
    }
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
