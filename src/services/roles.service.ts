import { apiClient } from "@/config/service.config";
import { PermisoRequest } from "@/types/permisos/permiso-request";
import { PermisoResponse } from "@/types/permisos/permiso-response";
import { RolesRequest } from "@/types/roles/roles-request";
import { RolesResponse } from "@/types/roles/roles-response";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import axios from "axios";
export class RolesService {
  private static instance: RolesService;

  private constructor() {}

  static getInstance(): RolesService {
    if (!RolesService.instance) {
      RolesService.instance = new RolesService();
    }
    return RolesService.instance;
  }

  async getRoles(): Promise<RolesResponse[]> {
    try {
      const response = await apiClient.get<RolesResponse[]>("/roles");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener roles"
        );
      }
      throw new Error("Error obtener roles");
    }
  }

  async getRolById(id: number): Promise<RolesResponse> {
    try {
      const response = await apiClient.get<RolesResponse>(`/roles/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener roles"
        );
      }
      throw new Error("Error obtener roles");
    }
  }

  async guardarRol(rolRequest: RolesRequest): Promise<RolesResponse> {
    try {
      const response = await apiClient.post<RolesResponse>(
        "/roles",
        rolRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Error al crear roles");
      }
      throw new Error("Error creando roles");
    }
  }

  async updateRol(
    rolRequest: RolesRequest,
    id: number
  ): Promise<RolesResponse> {
    try {
      const response = await apiClient.put<RolesResponse>(
        `/roles/${id}`,
        rolRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al actualizar roles"
        );
      }
      throw new Error("Error actualizar roles");
    }
  }

  async getpermisos(): Promise<PermisoResponse[]> {
    try {
      const response = await apiClient.get<PermisoResponse[]>(
        "/roles/permisos"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al recuperar permisos"
        );
      }
      throw new Error("Error al recuperar permisos");
    }
  }

  async crearPermiso(permisoRequest: PermisoRequest): Promise<PermisoResponse> {
    try {
      const response = await apiClient.post<PermisoResponse>(
        "/roles/permiso",
        permisoRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Error al crear roles");
      }
      throw new Error("Error creando roles");
    }
  }
}
