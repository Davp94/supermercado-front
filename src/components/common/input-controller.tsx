import { InputText } from "primereact/inputtext";
import { Control, Controller, RegisterOptions } from "react-hook-form";

//TODO review control type
interface InputControllerProps {
  name: string;
  control: Control<any>;
  rules: RegisterOptions;
  label: string;
  icon?: string;
  placeholder?: string;
}
export default function InputController({
  name,
  control,
  rules,
  label,
  icon,
  placeholder,
}: InputControllerProps) {

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <InputText
            id={field.name}
            {...field}
            className={`${fieldState.error ? "p-invalid" : ""}`}
            placeholder={placeholder}
          />
          {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
