"use client";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
interface UsuariosViewProps {
  usuario: UsuariosResponse;
  hideDialog: () => void;
}
export default function UsuariosView<UsuariosViewProps>({
  usuario,
  hideDialog,
}: UsuariosViewProps) {

  return (
    <>
      <p>{JSON.stringify(usuario)}</p>
      <Button label="Cerrar" onClick={hideDialog} />
    </>
  );
}
