import { apiClient } from "@/config/service.config";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { GetProductosRequest } from "@/types/inventario/get-productos.request";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { SucursalResponse } from "@/types/inventario/sucursal.response";
import { NotasRequest } from "@/types/notas/notas-request";
import { NotasResponse } from "@/types/notas/notas-response";
import { PaginationRequest } from "@/types/pagination/pagination.request";
import { PaginationResponse } from "@/types/pagination/pagination.response";
import { PermisoRequest } from "@/types/permisos/permiso-request";
import { PermisoResponse } from "@/types/permisos/permiso-response";
import { RolesRequest } from "@/types/roles/roles-request";
import { RolesResponse } from "@/types/roles/roles-response";
import axios from "axios";
export class NotasService {
  private static instance: NotasService;

  private constructor() {}

  static getInstance(): NotasService {
    if (!NotasService.instance) {
      NotasService.instance = new NotasService();
    }
    return NotasService.instance;
  }

  async getNotas(): Promise<NotasResponse[]> {
    try {
      const response = await apiClient.get<NotasResponse[]>(`/notas`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener notas"
        );
      }
      throw new Error("Error al obtener notas");
    }
  }

  async createNota(notaRequest: NotasRequest): Promise<NotasResponse> {
    try {
      const response = await apiClient.post<NotasResponse>(
        "/notas",
        notaRequest
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al guardar nota"
        );
      }
      throw new Error("Error al guardar nota");
    }
  }
}
