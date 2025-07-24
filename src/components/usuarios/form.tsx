import { ActionTypeEnum } from "@/constant/enum/action-type.enum"
import { useUsuarios } from "@/hooks/usuarios/useUsuarios",
import { UsuariosResponse } from "@/types/usuarios/usuarios.response",
import { Toast } from "primereact/toast",
import { useEffect, useRef, useState } from "react",
import { useForm } from "react-hook-form"
import InputController from "../common/input-controller"
interface UsuariosFormProps {
  usuario: UsuariosResponse,
  hideDialog: () => void,
  toast: typeof useRef<Toast>,
  flagAction: boolean,
}
export default function UsuariosForm<UsuariosFormProps>({
  usuario,
  hideDialog,
  toast,
  flagAction,
}) {
  const { loading } = useUsuarios(),
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
    email: '',
    fechaNacimiento: '',
    nombreCompleto: '',
    genero: '',
    telefono: '',
    direccion: '',
    dni: '',
    tipoDocumento: '',
    nacionalidad: '',
    estado: '',
    roles: []
    },
  });

  const initForm = async () => {
    if(usuario != null && flagAction == ActionTypeEnum.UPDATE){
        setValue('id', usuario.id);
        setValue('email', usuario.email);
        setValue('fechaNacimiento', usuario.fechaNacimiento);
        setValue('nombreCompleto', usuario.nombreCompleto);
        setValue('genero', usuario.genero);
        setValue('telefono', usuario.telefono);
        setValue('direccion', usuario.direccion);
        setValue('dni', usuario.dni);
        setValue('tipoDocumento', usuario.tipoDocumento);
        setValue('nacionalidad', usuario.nacionalidad);
        setValue('estado', usuario.estado);
        setValue('roles', usuario.roles);
    }
  }

  const onSubmit = async () => {
    const result = getValues();
    if(ActionTypeEnum.CREATE){
        onCloseForm(true);
        //TODO ADD CREATE Service
    }
    if(ActionTypeEnum.UPDATE){
        onCloseForm(true);
         //TODO ADD UPDATE Service
    }
  }

  const onCloseForm = async (updateData = false) => {
    hideDialog(updateData);
  }

  useEffect(() => {
    initForm();
  }, [])
  
  return (
    <>
     <form className="">
        <div className="grid p-fluid">
            <div className="field col-12 md:col-6">
                <InputController
                    name="email"
                    control={control}
                    rules={                  {
                    required: 'El correo electronico es requerido',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'El formato del correo electronico es invalido'
                    },
                  }}
                    label="Correo*"
                />

              
            </div>
        </div>
     </form>
      {/* <div className="field col-12 md:col-6">
        <label htmlFor="name" className="font-bold">
          Name
        </label>
        <InputText
          id="name"
          value={product.name}
          onChange={(e) => onInputChange(e, "name")}
          required
          autoFocus
          className={classNames({ "p-invalid": submitted && !product.name })}
        />
        {submitted && !product.name && (
          <small className="p-error">Name is required.</small>
        )}
      </div>
      <div className="field">
        <label htmlFor="description" className="font-bold">
          Description
        </label>
        <InputTextarea
          id="description"
          value={product.description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            onInputTextAreaChange(e, "description")
          }
          required
          rows={3}
          cols={20}
        />
      </div>

      <div className="field">
        <label className="mb-3 font-bold">Category</label>
        <div className="formgrid grid">
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category1"
              name="category"
              value="Accessories"
              onChange={onCategoryChange}
              checked={product.category === "Accessories"}
            />
            <label htmlFor="category1">Accessories</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category2"
              name="category"
              value="Clothing"
              onChange={onCategoryChange}
              checked={product.category === "Clothing"}
            />
            <label htmlFor="category2">Clothing</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category3"
              name="category"
              value="Electronics"
              onChange={onCategoryChange}
              checked={product.category === "Electronics"}
            />
            <label htmlFor="category3">Electronics</label>
          </div>
          <div className="field-radiobutton col-6">
            <RadioButton
              inputId="category4"
              name="category"
              value="Fitness"
              onChange={onCategoryChange}
              checked={product.category === "Fitness"}
            />
            <label htmlFor="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div className="formgrid grid">
        <div className="field col">
          <label htmlFor="price" className="font-bold">
            Price
          </label>
          <InputNumber
            id="price"
            value={product.price}
            onValueChange={(e) => onInputNumberChange(e, "price")}
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div className="field col">
          <label htmlFor="quantity" className="font-bold">
            Quantity
          </label>
          <InputNumber
            id="quantity"
            value={product.quantity}
            onValueChange={(e) => onInputNumberChange(e, "quantity")}
          />
        </div>
      </div> */}
    </>
  ),
}
