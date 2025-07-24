'use client'
import { useAuth } from '@/hooks/useAuth';
import { LoginRequest } from '@/types/login-request';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useForm, Controller  } from 'react-hook-form';
export default function LoginForm() {
  const router = useRouter();
  const { login, loading, error} = useAuth();
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
      email: '',
      password: ''
    }
  })

  const onSubmit = async () => {
    try {
      const loginRequest: LoginRequest = getValues();
      await login(loginRequest);
      router.push('/')
    } catch (error) {
      console.log('ERROR LOGIN', error);
    }
  }

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }
  return (
    <>
      <div className='flex items-center justify-center w-[500px] p-4'>
        <Card 
        className='w-full shadow-2'
        title={
          <div className='text-center'>
            <h2 className='text-2xl font-bold mb-2'>SUPERMERCADO APP</h2>
          </div>
        }
        subTitle="Ingresa tus datos de acceso"
        >
          <div className='p-fluid'>
            {/* Campo de correo electronico */}
            <div className='field mb-4'>
              <label className='text-gray-900'>Correo Electronico</label>
              <Controller
                name='email'
                control={control}
                rules={
                  {
                    required: 'El correo electronico es requerido',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'El formato del correo electronico es invalido'
                    },
                  }
                }
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id={field.name}
                      {...field}
                      className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                      placeholder='Ingresa tu correo electronico'
                      autoComplete='email'
                      

                    />
                    {getFormErrorMessage(field.name)}
                    
                  </>
                )}
              />
            </div>
            {/* Campo de contraseña */}
           <div className='field mb-4'>
              <label className='text-gray-900'>Contraseña</label>
              <Controller
                name='password'
                control={control}
                rules={
                  {
                    required: 'La contraseña es requerida',
                    minLength: {
                      value: 6,
                      message: 'La contraseña debe tener al menos 6 caracteres'
                    },
                  }
                }
                render={({ field, fieldState }) => (
                  <>
                    <Password
                      id={field.name}
                      {...field}
                      className={`w-full ${fieldState.error ? 'p-invalid' : ''}`}
                      placeholder='Ingresa tu contraseña'
                      autoComplete='password'
                      toggleMask
                      feedback={false}
                    />
                    {getFormErrorMessage(field.name)}
                    
                  </>
                )}
              />
            </div>
            {/* Boton de inicio de sesion */}
            <Button
              type='submit'
              label='Iniciar Sesion'
              icon='pi pi-sign-in'
              className='w-full'
              loading={loading}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
