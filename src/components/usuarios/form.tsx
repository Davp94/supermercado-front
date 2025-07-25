import { ActionTypeEnum } from "@/constant/enum/action-type.enum";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";
import { UsuariosResponse } from "@/types/usuarios/usuarios.response";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputController from "../common/input-controller";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
interface UsuariosFormProps {
  usuario: UsuariosResponse;
  hideDialog: (updateData: boolean) => void;
  toast: RefObject<Toast>;
  flagAction: number;
}
export default function UsuariosForm({
  usuario,
  hideDialog,
  toast,
  flagAction,
}: UsuariosFormProps) {
  const [fechaNacimiento, setFechaNacimiento] = useState<any>("");
  const [rolesUsuario, setRolesUsuario] = useState<any>("");
  const { loading } = useUsuarios();
  //TODO create hook roles
  const [roles, setRoles] = useState<any>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: {
      id: 0,
      email: "",
      nombreCompleto: "",
      genero: "",
      telefono: "",
      direccion: "",
      dni: "",
      tipoDocumento: "",
      nacionalidad: "",
      estado: "",
      roles: [""],
    },
  });

  const initForm = async () => {
    if (usuario != null && flagAction == ActionTypeEnum.UPDATE) {
      setValue("id", usuario.id);
      setValue("email", usuario.email);
      setValue("nombreCompleto", usuario.nombreCompleto);
      setValue("genero", usuario.genero);
      setValue("telefono", usuario.telefono);
      setValue("direccion", usuario.direccion);
      setValue("dni", usuario.dni);
      setValue("tipoDocumento", usuario.tipoDocumento);
      setValue("nacionalidad", usuario.nacionalidad);
      setValue("estado", usuario.estado);
      setValue("roles", usuario.roles);
    }
  };

  const onSubmit = async () => {
    const result = getValues();
    if (ActionTypeEnum.CREATE) {
      onCloseForm(true);
      //TODO ADD CREATE Service
    }
    if (ActionTypeEnum.UPDATE) {
      onCloseForm(true);
      //TODO ADD UPDATE Service
    }
  };

  const onCloseForm = async (updateData?: boolean) => {
    hideDialog(updateData ? updateData: false);
  };

  useEffect(() => {
    initForm();
  }, []);

  return (
    <>
      <form className="">
        <div className="grid p-fluid">
          <div className="field col-12 md:col-6">
            <InputController
              name="email"
              control={control}
              rules={{
                required: "El correo electronico es requerido",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "El formato del correo electronico es invalido",
                },
              }}
              label="Correo*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="nombres"
              control={control}
              rules={{
                required: "Nombres son requerido",
              }}
              label="Nombres*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="apellidos"
              control={control}
              rules={{
                required: "Apellidos son requerido",
              }}
              label="Apellidos*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="telefono"
              control={control}
              rules={{
                required: "Telefono es requerido",
              }}
              label="Telefono*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="direccion"
              control={control}
              rules={{
                required: "Direccion es requerido",
              }}
              label="Direccion*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="dni"
              control={control}
              rules={{
                required: "Dni es requerido",
              }}
              label="Dni*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="tipoDocumento"
              control={control}
              rules={{
                required: "Tipo Documento es requerido",
              }}
              label="Tipo Documento*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <InputController
              name="nacionalidad"
              control={control}
              rules={{
                required: "Nacionalidad es requerido",
              }}
              label="Nacionalidad*"
            />
          </div>
          <div className="field col-12 md:col-6">
            <Calendar
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.value)}
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="field col-12 md:col-6">
            <MultiSelect
              value={rolesUsuario}
              onChange={(e) => setRolesUsuario(e.value)}
              options={roles}
              optionLabel="nombre"
              placeholder="Selecciones Roles para el usuario"
              maxSelectedLabels={3}
              className="w-full md:w-20rem"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end items-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            className="w-full"
            onClick={onCloseForm}
          />
          <Button
            type="button"
            label="Crear Usuario"
            className="w-full"
            onClick={onSubmit}
          />
        </div>
      </form>
    </>
  );
}
