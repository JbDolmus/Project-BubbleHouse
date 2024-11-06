import { Button, Modal } from 'antd';
import { useForm } from 'react-hook-form';
import ErrorMessage from '@/components/ErrorMessage';
import { useDispatch, useSelector } from 'react-redux';
import { addCategory, editCategory, deleteCategory } from '@/redux/thunks/categoryThunks';
import { useEffect } from 'react';
import { ToastError } from '@/assets/js/toastify';
import { SweetAlertEliminar } from '@/assets/js/sweetAlert';

export default function FormCategoryProducto({ isVisible, onClose, refreshCategories, selectedCategory }) {

    const { token } = useSelector(state => state.user);
    const { categories } = useSelector(state => state.category);
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
        const isDuplicateName = categories.some(category => category.name === formData.name && category.id !== selectedCategory?.id);
        if (isDuplicateName) {
            ToastError("¡Esa categoría ya existe!");
            return true;
        }

        return false;
    };

    const handleAddOrEditCategory = (formData) => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        if (isDuplicateCategory(formData)) return;

        const categoryData = {
            id: selectedCategory?.id,
            token,
            category: {
                name: formData.name,
            }
        };

        if (selectedCategory) {
            dispatch(editCategory(categoryData))
                .unwrap()
                .then(() => {
                    onClose();
                    reset();
                    refreshCategories();
                })
        } else {
            dispatch(addCategory(categoryData))
                .unwrap()
                .then(() => {
                    onClose();
                    reset();
                    refreshCategories();
                })
        }
    }

    const handleDeleteCategory = () => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }
        SweetAlertEliminar("¿Estás seguro de que deseas eliminar esta categoría?", () => {
            dispatch(deleteCategory({ id: selectedCategory.id, token }))
                .unwrap()
                .then(() => {
                    setTimeout(() => {
                        onClose();
                        reset();
                        refreshCategories();
                    }, 0);
                })
        });
    }

    return (
        <Modal
            title={
                <span className="flex text-center text-lg font-semibold justify-center">
                    {selectedCategory ? "Modificar Categoría" : "Agregar Categoría"}
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
            <form onSubmit={handleSubmit(handleAddOrEditCategory)} className="space-y-4">
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

                {/* Botones */}
                <div className={`flex justify-center items-center gap-4 ${selectedCategory ? 'flex-row' : 'flex-col'}`}>
                    <Button type="primary" htmlType="submit" className="w-40">
                        {selectedCategory ? "Actualizar" : "Agregar"}
                    </Button>
                    {selectedCategory && (
                        <button
                            type='button'
                            className="w-40 bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-1.5"
                            onClick={handleDeleteCategory}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    )
}
