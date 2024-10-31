import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ErrorMessage';
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { Tooltip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, editUserwithoutPassword, deleteUser, cleanAlert } from '@/redux/thunks/userThunks';
import { ToastSuccess, ToastError } from '@/assets/js/toastify.js';
import { SweetAlertEliminar } from '@/assets/js/sweetAlert.js';

export default function FormUserView({ isVisible, onClose, refreshUsers, selectedUser, rolls }) {
    const dispatch = useDispatch();
    const { token, users } = useSelector(state => state.user);


    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
        setValue,
    } = useForm({
        defaultValues: {
            userName: '',
            email: '',
            rolls: [],
            newPassword: '',
            repeatPassword: '',
        }
    });

    const [showPassword, setShowPassword] = useState({
        newPassword: false,
        repeatPassword: false,
    });

    const newPassword = watch('newPassword');

    useEffect(() => {
        if (selectedUser) {
            setValue('userName', selectedUser.username);
            setValue('email', selectedUser.email);
            setValue('rolls', selectedUser.rolls_details.map(roll => roll.id));
            setValue('newPassword', '########');
            setValue('repeatPassword', '########');
        } else {
            reset();
        }
    }, [selectedUser, setValue, reset]);

    const isDuplicateUser = (formData) => {
        const isDuplicateEmail = users.some(user => user.email === formData.email && user.id !== selectedUser?.id);
        const isDuplicateUsername = users.some(user => user.username === formData.userName && user.id !== selectedUser?.id);

        if (isDuplicateEmail && isDuplicateUsername) {
            ToastError("El correo y el nombre de usuario ya estan en uso.");
            return true;
        } else if (isDuplicateUsername) {
            ToastError("El nombre de usuario ya está en uso.");
            return true;
        } else if (isDuplicateEmail) {
            ToastError("El correo ya está en uso.");
            return true;
        }

        return false;
    };


    const handleAddOrEditUser = (formData) => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        if (isDuplicateUser(formData)) return;

        const userData = {
            id: selectedUser?.id,
            token,
            user: {
                username: formData.userName,
                email: formData.email,
                rolls: [
                    formData.rolls[0],
                ]
            }
        };

        if (selectedUser) {
            dispatch(editUserwithoutPassword(userData))
                .unwrap()
                .then(() => {
                    onClose();
                    reset();
                    refreshUsers();
                    dispatch(cleanAlert());
                })
        } else {
            userData.user.password = formData.newPassword;
            dispatch(addUser(userData))
                .unwrap()
                .then(() => {
                    onClose();
                    reset();
                    refreshUsers();
                    dispatch(cleanAlert());
                })
        }
    };

    const handleDeleteUser = () => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        SweetAlertEliminar("¿Estás seguro de que deseas eliminar este usuario?", () => {
            dispatch(deleteUser({ id: selectedUser.id, token }))
                .unwrap()
                .then(() => {
                    setTimeout(() => {
                        onClose();
                        reset();
                        refreshUsers();
                        dispatch(cleanAlert());
                    }, 0);
                })
        });
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    return (
        <Modal
            title={
                <span className="flex text-center text-lg font-semibold justify-center">
                    {selectedUser ? "Modificar Usuario" : "Agregar Usuario"}
                </span>
            }
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
                {/* Nombre de usuario */}
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
                                value: /^[a-zA-Z0-9@áéíóúüÁÉÍÓÚÜñÑ]+$/,
                                message: "El nombre solo puede contener letras, números y '@', sin espacios",
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

                {/* Rol */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="rolls">Rol</label>
                    <select
                        id="rolls"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("rolls", { required: "El rol es obligatorio" })}
                    >
                        <option value="">Selecciona un rol</option>
                        {rolls && rolls.map((roll) => (
                            <option key={roll.id} value={roll.id}>{roll.name}</option>
                        ))}

                    </select>
                    {errors.rolls && <ErrorMessage>{errors.rolls.message}</ErrorMessage>}
                </div>

                {/* Nueva Contraseña */}
                <div className={`flex flex-col gap-2 relative ${!selectedUser ? "block" : "hidden"}`}>
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
                <div className={`flex flex-col gap-2 relative ${!selectedUser ? "block" : "hidden"}`} >
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

                {/* Botones */}
                <div className={`flex justify-center items-center gap-4 mx-7 ${selectedUser ? 'flex-row' : 'flex-col'}`}>
                    <Button type="primary" htmlType="submit" className="w-40">
                        {selectedUser ? "Actualizar" : "Agregar"}
                    </Button>
                    {selectedUser && (
                        <button
                            type='button'
                            className="w-40 bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-1.5"
                            onClick={handleDeleteUser}
                        >
                            Eliminar
                        </button>
                    )}
                </div>

            </form>
        </Modal>
    );
}
