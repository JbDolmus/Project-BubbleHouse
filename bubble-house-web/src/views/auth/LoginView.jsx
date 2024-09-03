import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useState } from "react";
import { Tooltip } from '@mui/material';

export default function LoginView() {

  const initialValues = {
    email: '',
    password: '',
  }
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (formData) => { }

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white shadow-lg rounded-lg"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <ErrorMessage>{errors.email.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5 relative">
          <label
            className="font-normal text-2xl"
          >Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          <Tooltip title={showPassword.repeatPassword ? "Ocultar" : "Mostrar"} placement='top'>
            <button
              type="button"
              className="absolute right-3 flex items-center justify-center mt-16"
              onClick={() => togglePasswordVisibility('repeatPassword')}
            >
              {showPassword.repeatPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </Tooltip>
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer rounded-md"
        />
      </form>



      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to={'/auth/register'}
          className="text-center text-fuchsia-500 font-normal"
        >
          ¿No tienes una cuenta? {''}
          <span className="font-black">Crear cuenta</span>
        </Link>
      </nav>
    </>
  )
}