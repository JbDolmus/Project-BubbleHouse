import React, { useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ErrorMessage';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, editUserPut, deleteUser } from '../../redux/thunks/userThunks';
import { ToastSuccess, ToastError } from '@/assets/js/toastify.js';

export default function FormUserView({ isVisible, onClose, refreshUsers, selectedUser }) {
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.user);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
        }
    });

    useEffect(() => {
        if (selectedUser) {
            setValue('userName', selectedUser.username);
            setValue('email', selectedUser.email);
        } else {
            reset();
        }
    }, [selectedUser, setValue, reset]);

    const handleAddOrEditUser = (formData) => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        const userData = {
            id: selectedUser?.id,
            token,
            user: {
                username: formData.userName,
                email: formData.email,
                rolls: [],
            }
        };
        if (selectedUser) {
            dispatch(editUserPut(userData))
                .unwrap()
                .then((response) => {
                    console.log(response);
                    ToastSuccess("Usuario actualizado con éxito");
                    onClose();
                    reset();
                    refreshUsers();
                })
                .catch((error) => {
                    console.error('Error al actualizar el usuario:', error);
                    ToastError("Error al actualizar el usuario");
                });
        } else {
            dispatch(addUser(userData))
                .unwrap()
                .then((response) => {
                    console.log(response.email);
                    if (response.email) {
                        ToastError("El email ya existe");
                    } else {
                        ToastSuccess("Usuario agregado con éxito");
                        onClose();
                        reset();
                        refreshUsers();
                    }

                })
                .catch((error) => {
                    console.error('Error al agregar el usuario:', error);
                    ToastError("Error al agregar el usuario");
                });
        }
    };

    const handleDeleteUser = () => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        dispatch(deleteUser({ id: selectedUser.id, token }))
            .unwrap()
            .then((response) => {
                console.log('Usuario eliminado con éxito:', response);
                ToastSuccess("Usuario eliminado con éxito");

                setTimeout(() => {
                    onClose();
                    reset();
                    refreshUsers();
                }, 1000);
            })
            .catch((error) => {
                console.error('Error al eliminar el usuario:', error);
                ToastError("Error al eliminar el usuario");
            });
    };


    return (
        <Modal
            title={selectedUser ? "Modificar Usuario" : "Agregar Usuario"}
            open={isVisible}
            onCancel={() => {
                reset();
                onClose();
            }}
            footer={null}
            centered
            width={500}
        >
            <form onSubmit={handleSubmit(handleAddOrEditUser)} className="space-y-4">
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

                <Button type="primary" htmlType="submit" className="w-full">
                    {selectedUser ? "Actualizar Usuario" : "Agregar Usuario"}
                </Button>

                {selectedUser && (
                    <Button
                        type="danger"
                        className="w-full mt-2"
                        onClick={handleDeleteUser}
                    >
                        Eliminar Usuario
                    </Button>
                )}
            </form>
        </Modal>
    );
}
