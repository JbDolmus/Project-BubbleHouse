import { Button, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ErrorMessage';
import { useDispatch, useSelector } from 'react-redux';
import { cleanAlert, addCategory, editCategory } from '@/redux/thunks/categoryThunks';
import { useEffect } from 'react';

export default function FormCategoryProducto({ isVisible, onClose, refreshCategories, selectedCategory }) {

    const { token } = useSelector(state => state.user);
    const { categories, errorRedux } = useSelector(state => state.category);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (selectedCategory) {
            setValue('name', selectedCategory.name);
        } else {
            reset();
        }
    }, [selectedCategory, setValue, reset]);

    const isDuplicateCategory = (formData) => {
        const isDuplicateName = users.results.some(user => user.email === formData.email && user.id !== selectedUser?.id);
        if (isDuplicateName) {
            ToastError("Esa categoría ya existe.");
            return true;
        }

        return false;
    };

    const handleAddOrEditUser = (formData) => {

    }

    const handleDeleteUser = () => {

    }

    return (
        <Modal
            title={selectedCategory ? "Modificar Categoría" : "Agregar Categoría"}
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
                    <label className="font-medium" htmlFor="name">Nombre de Categoría</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nombre de Categoría"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("name", {
                            required: "El nombre de la categoría es obligatorio",
                            pattern: {
                                value: /^[a-zA-Z0-9@áéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                                message: "El nombre solo puede contener letras, números, '@' y espacios",
                            },
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>
                <div className='flex flex-row gap-8'>
                    <Button type="primary" htmlType="submit" className="w-full">
                        {selectedCategory ? "Actualizar Categoría" : "Agregar Categoría"}
                    </Button>

                    {selectedCategory && (
                        <button
                            type='button'
                            className="w-full bg-red-500 text-white hover:bg-red-600 hover:text-white rounded-md"
                            style={{ padding: '0.32rem 0' }}
                            onClick={handleDeleteUser}
                        >
                            Eliminar Categoría
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    )
}
