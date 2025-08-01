import { InventarioService } from "@/services/inventario.service";
import { useState } from "react";

export const useInventario = () => {
  const inventarioService = InventarioService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getProductosPagination = async (params: any) => {
    setLoading(true);
    setError("");
    try {
      const response = await inventarioService.getProductos(params);
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

  const addProductoToAlmacen = async (productoId: number, almacenId: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await inventarioService.addProductoAlmacen(productoId, almacenId);
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

  const getSucursales = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await inventarioService.getSucursales();
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

  const getAlmacenes = async (sucursalId: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await inventarioService.getAlmacenes(sucursalId);
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

  return {
    getProductosPagination,
    addProductoToAlmacen,
    getSucursales,
    getAlmacenes,
    loading,
    error,
  };
};
