import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import NavBarPrincipal from '../../layouts/NavBarPrincipal';
import { Tooltip } from '@mui/material';

export default function UserView() {
  const initialValues = {
    firstName: '',
    lastName1: '',
    lastName2: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  };

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    repeatPassword: false,
  });

  const newPassword = watch('newPassword');

  const handleUserUpdate = (formData) => {
    console.log('Datos del formulario:', formData);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <>
      <NavBarPrincipal title={"Usuario"} />
      <div className="flex justify-center min-h-screen w-11/12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 my-5">
          <h1 className="text-2xl font-bold mb-6 text-center">Modificar Usuario</h1>
          <form onSubmit={handleSubmit(handleUserUpdate)} className="space-y-4" noValidate>
            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="firstName">Nombre</label>
              <input
                id="firstName"
                type="text"
                placeholder="Nombre"
                className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("firstName", { 
                  required: "El nombre es obligatorio",
                  pattern: {
                    value: /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                    message: "El nombre solo puede contener letras y espacios",
                  }, 
                })}
              />
              {errors.firstName && <ErrorMessage>{errors.firstName.message}</ErrorMessage>}
            </div>

            {/* Primer Apellido */}
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="lastName1">Primer Apellido</label>
              <input
                id="lastName1"
                type="text"
                placeholder="Primer Apellido"
                className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("lastName1", { 
                  required: "El primer apellido es obligatorio",
                  pattern: {
                    value: /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                    message: "El primer apellido solo puede contener letras y espacios",
                  },
                })}
              />
              {errors.lastName1 && <ErrorMessage>{errors.lastName1.message}</ErrorMessage>}
            </div>

            {/* Segundo Apellido */}
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="lastName2">Segundo Apellido</label>
              <input
                id="lastName2"
                type="text"
                placeholder="Segundo Apellido"
                className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("lastName2", { 
                  required: "El primer apellido es obligatorio",
                  pattern: {
                    value: /^[a-zA-ZáéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                    message: "El segundo apellido solo puede contener letras y espacios",
                  },
                })}
              />
              {errors.lastName2 && <ErrorMessage>{errors.lastName2.message}</ErrorMessage>}
            </div>

            {/* Correo */}
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                placeholder="Correo"
                className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Correo no válido" }
                })}
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            {/* Teléfono */}
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="phone">Teléfono</label>
              <input
                id="phone"
                type="number"
                placeholder="Teléfono"
                className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("phone", {
                  required: "El teléfono es obligatorio",
                  minLength: { value: 8, message: "Debe tener 8 caracteres" },
                  maxLength: { value: 8, message: "Debe tener 8 caracteres" },
                })}
              />
              {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
            </div>

            {/* Contraseña Actual */}
            <div className="flex flex-col gap-2 relative">
              <label className="font-medium" htmlFor="currentPassword">Contraseña Actual</label>
              <input
                id="currentPassword"
                type={showPassword.currentPassword ? "text" : "password"}
                placeholder="Contraseña Actual"
                className="w-full p-3 pr-10 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("currentPassword", { required: "La contraseña actual es obligatoria" })}
              />
              <Tooltip title={showPassword.currentPassword ? "Ocultar" : "Mostrar"} placement='top'>
                <button
                  type="button"
                  className="absolute right-3 flex items-center justify-center mt-12"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                >
                  {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </Tooltip>
              {errors.currentPassword && <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>}
            </div>

            {/* Nueva Contraseña */}
            <div className="flex flex-col gap-2 relative">
              <label className="font-medium" htmlFor="newPassword">Nueva Contraseña</label>
              <input
                id="newPassword"
                type={showPassword.newPassword ? "text" : "password"}
                placeholder="Nueva Contraseña"
                className="w-full p-3 pr-10 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("newPassword", {
                  required: "La nueva contraseña es obligatoria",
                  minLength: { value: 8, message: "Debe tener al menos 8 caracteres" }
                })}
              />
              <Tooltip title={showPassword.newPassword ? "Ocultar" : "Mostrar"} placement='top'>
                <button
                  type="button"
                  className="absolute right-3 flex items-center justify-center mt-12"
                  onClick={() => togglePasswordVisibility('newPassword')}
                >
                  {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </Tooltip>
              {errors.newPassword && <ErrorMessage>{errors.newPassword.message}</ErrorMessage>}
            </div>

            {/* Repetir Contraseña */}
            <div className="flex flex-col gap-2 relative">
              <label className="font-medium" htmlFor="repeatPassword">Repita Contraseña</label>
              <input
                id="repeatPassword"
                type={showPassword.repeatPassword ? "text" : "password"}
                placeholder="Repita Contraseña"
                className="w-full p-3 pr-10 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("repeatPassword", {
                  required: "Repetir la contraseña es obligatorio",
                  validate: value => value === newPassword || 'Las contraseñas no coinciden'
                })}
              />
              <Tooltip title={showPassword.repeatPassword ? "Ocultar" : "Mostrar"} placement='top'>
                <button
                  type="button"
                  className="absolute right-3 flex items-center justify-center mt-12"
                  onClick={() => togglePasswordVisibility('repeatPassword')}
                >
                  {showPassword.repeatPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </Tooltip>
              {errors.repeatPassword && <ErrorMessage>{errors.repeatPassword.message}</ErrorMessage>}
            </div>


            <input
              type="submit"
              value='Actualizar Perfil'
              className="bg-blue-500 hover:bg-blue-600 w-full p-3 text-white font-bold text-xl cursor-pointer rounded-md"
            />
          </form>
        </div>
      </div>
    </>
  );
}
