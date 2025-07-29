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
import { useRoles } from "@/hooks/usuarios/useRoles";
import { RolesResponse } from "@/types/roles/roles-response";
import { UsuarioRequest } from "@/types/usuarios/usuario.request";
import { DateFormat } from "@/utils/DateFormat";
import { UsuarioUpdateRequest } from "@/types/usuarios/usuarios-update.request";
import { PermisoResponse } from "@/types/permisos/permiso-response";
interface RolesFormPros {
  rol: RolesResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}
export default function UsuariosForm({
  rol,
  hideDialog,
  toast,
  flagAction,
}: RolesFormPros) {
  const [permisos, setPermisos] = useState<PermisoResponse[]>([]);
  const [permisosRol, setPermisosRol] = useState<any>("");
  const {
    loading: loadingUsuarios,
    createUsuario,
    updateUsuario,
  } = useRoles();
  const { getRoles, loading: loadingRoles } = useRoles();
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
      id: null,
      email: "",
      nombres: "",
      apellidos: "",
      genero: "",
      telefono: "",
      direccion: "",
      dni: "",
      tipoDocumento: "",
      nacionalidad: "",
      estado: "",
    },
  });

  const initForm = async () => {
    const rolesRetrieved = await getRoles();
    setRoles(rolesRetrieved);
    if (usuario != null && flagAction == ActionTypeEnum.UPDATE) {
      setValue("email", usuario.email);
      setValue("nombres", usuario.nombres);
      setValue("apellidos", usuario.apellidos);
      setValue("genero", usuario.genero);
      setValue("telefono", usuario.telefono);
      setValue("direccion", usuario.direccion);
      setValue("dni", usuario.dni);
      setValue("tipoDocumento", usuario.tipoDocumento);
      setValue("nacionalidad", usuario.nacionalidad);
      setValue("estado", usuario.estado);
    }
  };

  const onSubmit = async () => {
    if (ActionTypeEnum.CREATE) {
      const result: UsuarioRequest = getValues();
      result.fechaNacimiento = DateFormat.dateFormat(fechaNacimiento);
      result.rolesIds = rolesUsuario;
      try {
        await createUsuario(result);
        reset();
        onCloseForm(true);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "Error al crear usuario",
          life: 3000,
        });
      }
    }
    if (ActionTypeEnum.UPDATE) {
      const resultUpdate: UsuarioUpdateRequest = {
        email: getValues("email"),
        direccion: getValues("direccion"),
        telefono: getValues("telefono"),
        rolesIds: rolesUsuario,
      };
      try {
        await updateUsuario(resultUpdate, usuario!.id as number);
        reset();
        onCloseForm(true);
      } catch (error) {
        toast.current?.show({
          severity: "error",
          summary: "Rejected",
          detail: "Error al actualizar el usuario",
          life: 3000,
        });
      }
      onCloseForm(true);
    }
  };

  const onCloseForm = async (updateData?: boolean) => {
    hideDialog(updateData ? updateData : false);
  };

  useEffect(() => {
    initForm();
  }, []);

  return (
    <>
      <form className="w-full mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 p-fluid gap-4 mb-4">
          <div className="">
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
              placeholder="Correo"
            />
          </div>
          <div className="">
            <InputController
              name="nombres"
              control={control}
              rules={{
                required: "Nombres son requerido",
              }}
              label="Nombres*"
              placeholder="Nombres"
            />
          </div>
          <div className="">
            <InputController
              name="apellidos"
              control={control}
              rules={{
                required: "Apellidos son requerido",
              }}
              label="Apellidos*"
              placeholder="Apellidos"
            />
          </div>
          <div className="">
            <InputController
              name="telefono"
              control={control}
              rules={{
                required: "Telefono es requerido",
              }}
              label="Telefono*"
              placeholder="Telefono"
            />
          </div>
          <div className="">
            <InputController
              name="direccion"
              control={control}
              rules={{
                required: "Direccion es requerido",
              }}
              label="Direccion*"
              placeholder="Direccion"
            />
          </div>
          <div className="">
            <InputController
              name="dni"
              control={control}
              rules={{
                required: "Dni es requerido",
              }}
              label="Dni*"
              placeholder="Dni"
            />
          </div>
          <div className="">
            <InputController
              name="tipoDocumento"
              control={control}
              rules={{
                required: "Tipo Documento es requerido",
              }}
              label="Tipo Documento*"
              placeholder="Tipo documento"
            />
          </div>
          <div className="">
            <InputController
              name="nacionalidad"
              control={control}
              rules={{
                required: "Nacionalidad es requerido",
              }}
              label="Nacionalidad*"
              placeholder="nacionalidad"
            />
          </div>
          <div className="">
            <Calendar
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.value)}
              dateFormat="yy-mm-dd"
              placeholder="fecha nacimiento"
            />
          </div>
          <div className="">
            <MultiSelect
              value={rolesUsuario}
              onChange={(e) => setRolesUsuario(e.value)}
              options={roles}
              optionLabel="nombre"
              placeholder="Selecciones Roles para el usuario"
              maxSelectedLabels={3}
              optionValue="id"
              className="w-full md:w-20rem"
            />
          </div>
        </div>
        <div className="flex flex-row justify-end items-end gap-2">
          <Button
            type="button"
            label="Cancelar"
            className="w-full"
            onClick={() => onCloseForm}
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
