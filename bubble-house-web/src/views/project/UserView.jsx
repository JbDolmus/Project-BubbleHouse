import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import NavBarPrincipal from '../../layouts/NavBarPrincipal';
import { useDispatch, useSelector } from 'react-redux';
import { authMe, editUser, getUser } from '../../redux/thunks/userThunks';
import { ToastSuccess, ToastError } from '@/assets/js/toastify.js';
import { useNavigate } from 'react-router-dom';

export default function UserView() {

  const navigate = useNavigate();

  const initialValues = {
    userName: '',
    email: '',
  };

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialValues });

  const dispatch = useDispatch();
  const { token, user, userSession } = useSelector(state => state.user);

  useEffect(() => {
    if (token) {
      dispatch(authMe(token));
      dispatch(getUser({ token:token, id: user?.id }));
    } else {
      console.error("Token no disponible");
      ToastError("Token no disponible");
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (userSession) {
      reset({
        userName: userSession.username || '',
        email: userSession.email || '',
      });
    }
  }, [userSession, reset]);


  const handleUserUpdate = (formData) => {
    if (!token || !userSession?.id) {
      console.error("Token o ID de usuario no disponible");
      ToastError("Token o ID de usuario no disponible");
      return;
    }

    const userData = {
      id: userSession.id,
      token: token,
      usuario: {
        username: formData.userName,
        email: formData.email,
      }
    };

    dispatch(editUser(userData))
      .unwrap()
      .then((response) => {
        console.log('Usuario actualizado con éxito:', response);
        ToastSuccess("Usuario actualizado con éxito");
        navigate('/orders');
      })
      .catch((error) => {
        console.error('Error al actualizar el usuario:', error);
        ToastError("Error al actualizar el usuario");
      });
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
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
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
