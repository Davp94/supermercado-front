import { apiClient } from "@/config/service.config";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import axios from "axios";
export class UsuariosService {
  private static instance: UsuariosService;

  private constructor() {}

  static getInstance(): UsuariosService {
    if (!UsuariosService.instance) {
      UsuariosService.instance = new UsuariosService();
    }
    return UsuariosService.instance;
  }

  async getUsers(): Promise<UsuariosResponse[]> {
    try {
      const response = await apiClient.get<UsuariosResponse[]>(
        "/usuarios"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener usuarios"
        );
      }
      throw new Error("Error obtener usuarios");
    }
  }

//   async logout(): Promise<void> {
//     try {
//       Cookies.remove('token');
//       Cookies.remove('refresh-token');
//     } catch (error) {
//       console.log("ERROR", error);
//     }
//   }

//   async refreshToken(): Promise<LoginResponse> {
//   }

//   getToken(): string | undefined {
//     return Cookies.get('token');
//   }

//   isAuthenticated(): boolean {
//     return !!this.getToken();
//   }
}
