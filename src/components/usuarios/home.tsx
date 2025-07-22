'use client'
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import { useEffect, useState } from "react";

export default function UsuariosHome() {
  const { getUsuarios, loading } = useUsuarios();
  const [usuarios, setUsuarios] = useState<UsuariosResponse[] | null>(null);
  const initComponent = async () => {
    setUsuarios(await getUsuarios());
  };
  useEffect(() => {
    initComponent();
  }, []);

  return (
    <>
        {loading && <p>Cargando...</p>}
        {!loading && <p>{JSON.stringify(usuarios)}</p>}
    </>
  );
}
