import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import NavBarPrincipal from '@/layouts/NavBarPrincipal';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { editUser, closeSession, cleanAlert, authMe } from '@/redux/thunks/userThunks';
import { ToastSuccess, ToastError } from '@/assets/js/toastify.js';
import { useNavigate } from 'react-router-dom';

export default function UserView() {

  const navigate = useNavigate();

  const initialValues = {
    userName: '',
    email: '',
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

  const dispatch = useDispatch();
  const { token, user, errorRedux, message } = useSelector(state => state.user);

  useEffect(() => {
    if (token) {
      dispatch(authMe(token));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (user) {
      reset({
        userName: user.username || '',
        email: user.email || '',
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (message === "Actualización exitosa" && token) {
      ToastSuccess("Usuario actualizado con éxito");
      dispatch(cleanAlert());
      dispatch(closeSession());
      setTimeout(() => {
        ToastSuccess("Sesión cerrada. Por favor, inicia sesión de nuevo.");
        navigate('/');
      }, 3000);
    }
    if (errorRedux) {
      ToastError(errorRedux);
      dispatch(cleanAlert());
    }
  }, [errorRedux, message, navigate, dispatch, token]);


  const handleUserUpdate = (formData) => {
    if (!user?.id) {
      ToastError("ID de usuario no disponible");
      return;
    }

    const userData = {
      id: user.id,
      token: token,
      usuario: {
        username: formData.userName,
        email: formData.email,
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      }
    };

    dispatch(editUser(userData));

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
      <div className="flex justify-center items-center min-h-screen w-11/12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 my-5">
          <h1 className="text-2xl font-bold mb-6 text-center">Modificar Usuario</h1>
          <form onSubmit={handleSubmit(handleUserUpdate)} className="space-y-4" noValidate>
            {/* Nombre */}
            <div className="flex flex-col gap-2">
              <label className="font-medium" htmlFor="userName">Nombre de usuario</label>
              <input
                id="userName"
                type="text"
                placeholder="Nombre"
                className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                {...register("userName", {
                  required: "El nombre es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9@áéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                    message: "El nombre solo puede contener letras, números, '@' y espacios",
                  },
                })}
              />
              {errors.userName && <ErrorMessage>{errors.userName.message}</ErrorMessage>}
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
                readOnly
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
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
                  className="absolute right-3 flex items-center justify-center"
                  style={{ marginTop: "3rem" }}
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
                  className="absolute right-3 flex items-center justify-center"
                  style={{ marginTop: "3rem" }}
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
                  className="absolute right-3 flex items-center justify-center"
                  style={{ marginTop: "3rem" }}
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
