import { apiClient } from "@/config/service.config";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { UsuarioUpdateRequest } from "@/types/usuarios/usuarios-update.request";
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

  async getUserByid(id: number): Promise<UsuariosResponse> {
    try {
      const response = await apiClient.get<UsuariosResponse>(
        `/usuarios/${id}`
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

  async createUsers(usuarioRequest: UsuarioRequest): Promise<UsuariosResponse> {
    try {
      const response = await apiClient.post<UsuariosResponse>(
        "/usuarios", usuarioRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al crear usuarios"
        );
      }
      throw new Error("Error crear usuarios");
    }
  }

    async updateUsers(usuarioRequest: UsuarioUpdateRequest, id: number): Promise<UsuariosResponse> {
    try {
      const response = await apiClient.put<UsuariosResponse>(
      `/usuarios/${id}`, usuarioRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al actualizar usuarios"
        );
      }
      throw new Error("Error al actualizar usuarios");
    }
  }

    async deleteUsuario(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<void>(
        `/usuarios/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al borrar usuarios"
        );
      }
      throw new Error("Error borrar usuarios");
    }
  }
}
