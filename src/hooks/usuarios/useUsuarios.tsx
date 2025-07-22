import { UsuariosService } from "@/services/usuarios.service";
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


  return {
    getUsuarios,
    loading,
    error
  }
};
