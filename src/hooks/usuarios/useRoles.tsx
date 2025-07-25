import { RolesService } from "@/services/roles.service";
import { PermisoRequest } from "@/types/permisos/permiso-request";
import { RolesRequest } from "@/types/roles/roles-request";
import { useState } from "react";

export const useRoles = () => {
  const rolesService = RolesService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await rolesService.getRoles();
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

  const getRolById = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await rolesService.getRolById(id);
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

  const createRol = async (rolesRquest: RolesRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await rolesService.guardarRol(rolesRquest);
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

  const crearPermiso = async (permisoRequest: PermisoRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await rolesService.crearPermiso(permisoRequest);
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
    getRoles,
    getRolById,
    createRol,
    crearPermiso,
    loading,
    error,
  };
};
