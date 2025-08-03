import { NotasService } from "@/services/notas.service";
import { NotasRequest } from "@/types/notas/notas-request";
import { useState } from "react";

export const useNotas = () => {
  const notasService = NotasService.getInstance();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getNotas = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await notasService.getNotas();
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

  const getEntidadesComerciales = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await notasService.getEntidadComercial();
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

  const crearNota = async (notaRequest: NotasRequest) => {
    setLoading(true);
    setError("");
    try {
      const response = await notasService.createNota(notaRequest);
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
    getNotas,
    crearNota,
    getEntidadesComerciales,
    loading,
    error,
  };
};
