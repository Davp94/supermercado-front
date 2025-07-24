import { InputText } from "primereact/inputtext";
import { Controller, RegisterOptions } from "react-hook-form";

interface InputControllerProps {
  name: string;
  control: () => void;
  rules: RegisterOptions;
  label: string;
  icon: string;
  placeholder: string;
}
export default function InputController<InputControllerProps>({
  name,
  control,
  rules,
  label,
  icon,
  placeholder,
}) {

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
            className={`w-full ${fieldState.error ? "p-invalid" : ""}`}
            placeholder={placeholder}
          />
          {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
