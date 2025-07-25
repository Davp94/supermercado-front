import { UsuariosService } from "@/services/usuarios.service";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { UsuarioUpdateRequest } from "@/types/usuarios/usuarios-update.request";
import { useState } from "react";

export const useUsuarios = () => {
  const usuariosService = UsuariosService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await usuariosService.getUsers();
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

  const getUsuarioById = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await usuariosService.getUserByid(id);
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

  const createUsuario = async (usuarioRequest: UsuarioRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await usuariosService.createUsers(usuarioRequest);
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

  const updateUsuario = async (usuarioUpdateRequest: UsuarioUpdateRequest, id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await usuariosService.updateUsers(usuarioUpdateRequest, id);
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

  const deleteUsuario = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const response = await usuariosService.deleteUsuario(id);
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
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loading,
    error,
  };
};
