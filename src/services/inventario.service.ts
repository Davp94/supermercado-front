import { apiClient } from "@/config/service.config";
import { AlmacenResponse } from "@/types/inventario/almacen.response";
import { GetProductosRequest } from "@/types/inventario/get-productos.request";
import { ProductosResponse } from "@/types/inventario/productos.response";
import { SucursalResponse } from "@/types/inventario/sucursal.response";
import { PaginationRequest } from "@/types/pagination/pagination.request";
import { PaginationResponse } from "@/types/pagination/pagination.response";
import { PermisoRequest } from "@/types/permisos/permiso-request";
import { PermisoResponse } from "@/types/permisos/permiso-response";
import { RolesRequest } from "@/types/roles/roles-request";
import { RolesResponse } from "@/types/roles/roles-response";
import axios from "axios";
export class InventarioService {
  private static instance: InventarioService;

  private constructor() {}

  static getInstance(): InventarioService {
    if (!InventarioService.instance) {
      InventarioService.instance = new InventarioService();
    }
    return InventarioService.instance;
  }

  async getProductos(params: {
    pageNumber?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: "ASC" | "DESC";
    filterValue?: string;
    almacenId?: number;
    nombre?: string;
    descripcion?: string;
    codigoBarra?: string;
    marca?: string;
    nombreCategoria?: string;
    activo?: boolean;
    precioMin?: number;
    precioMax?: number;
    fechaRegistroDesde?: string;
    fechaRegistroHasta?: string;
  }): Promise<PaginationResponse<ProductosResponse>> {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([_, value]) => value !== undefined && value !== null && value !== ""
        )
      );
      const response = await apiClient.get<
        PaginationResponse<ProductosResponse>
      >("/productos/pagination", { params: cleanParams });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener productos"
        );
      }
      throw new Error("Error obtener productos");
    }
  }

  async getSucursales(): Promise<SucursalResponse[]> {
    try {
      const response = await apiClient.get<SucursalResponse[]>(`/sucursales`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener sucursales"
        );
      }
      throw new Error("Error obtener sucursales");
    }
  }

  async getAlmacenes(sucursalId: number): Promise<AlmacenResponse[]> {
    try {
      const response = await apiClient.get<AlmacenResponse[]>(`/sucursales/almacenes/${sucursalId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener almacenes"
        );
      }
      throw new Error("Error al obtener almacenes");
    }
  }

  async addProductoAlmacen(
    productoId: number,
    almacenId: number
  ): Promise<ProductosResponse> {
    try {
      const response = await apiClient.post<ProductosResponse>(
        "/productos/almacen",
        { productoId: productoId, almacenId: almacenId }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Error al obtener almacenes"
        );
      }
      throw new Error("Error al obtener almacenes");
    }
  }
}
