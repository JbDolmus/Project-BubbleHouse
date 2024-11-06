import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addIngredient, editIngredient, deleteIngredient } from '@/redux/thunks/ingredientThunks';
import { ToastError } from "@/assets/js/toastify";
import { SweetAlertEliminar } from "@/assets/js/sweetAlert";
import ErrorMessage from '@/components/ErrorMessage';

export default function FormIngredient({ isVisible, onClose, refreshIngredients, selectedIngredient, categories }) {

    const { token } = useSelector(state => state.user);
    const { ingredients } = useSelector(state => state.ingredient);
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
            price: 0,
            discount: 0,
            idCategoryIngredient: "",
            isSoldOut: false,
        },
    });

    useEffect(() => {
        if (selectedIngredient) {
            setValue('name', selectedIngredient.name);
            setValue('price', selectedIngredient.price);
            setValue('discount', selectedIngredient.discount);
            setValue('idCategoryIngredient', selectedIngredient.ingredient_category.id);
            setValue('isSoldOut', selectedIngredient.isSoldOut);
        } else {
            reset();
        }
    }, [selectedIngredient, setValue, reset]);

    const isDuplicateIngredient = (formData) => {
        const isDuplicateName = ingredients.some(ingredient => ingredient.name === formData.name && ingredient.id !== selectedIngredient?.id);
        if (isDuplicateName) {
            ToastError("Ese ingrediente ya existe!");
            return true;
        }

        return false;
    };

    const handleAddOrEditIngredient = (formData) => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        if (isDuplicateIngredient(formData)) return;

        const ingredientData = {
            id: selectedIngredient?.id,
            token,
            ingredient: {
                name: formData.name,
                ingredient_category: formData.idCategoryIngredient,
                price: formData.price,
                discount: formData.discount,
                isSoldOut: formData.isSoldOut,
            }
        };

        if (selectedIngredient) {
            dispatch(editIngredient(ingredientData))
                .unwrap()
                .then(() => {
                    onClose();
                    reset();
                    refreshIngredients();
                })
        } else {
            dispatch(addIngredient(ingredientData))
                .unwrap()
                .then(() => {
                    onClose();
                    reset();
                    refreshIngredients();
                })
        }
    }

    const handleDeleteIngredient = () => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        SweetAlertEliminar("¿Estás seguro de que deseas eliminar este ingrediente?", () => {
            dispatch(deleteIngredient({ id: selectedIngredient.id, token }))
                .unwrap()
                .then(() => {
                    setTimeout(() => {
                        onClose();
                        reset();
                        refreshIngredients();
                    }, 0);
                })
        });
    }

    return (
        <Modal
            title={
                <span className="flex text-center text-lg font-semibold justify-center">
                    {selectedIngredient ? "Modificar Ingrediente" : "Agregar Ingrediente"}
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
            <form onSubmit={handleSubmit(handleAddOrEditIngredient)} className="space-y-4">
                {/* Nombre del Ingrediente */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="name">Nombre del Ingrediente</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nombre del Ingrediente"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("name", {
                            required: "El nombre del ingrediente es obligatorio",
                            pattern: {
                                value: /^[a-zA-Z0-9áéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                                message: "El nombre solo puede contener letras, números y espacios",
                            },
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                {/* Precio del Ingrediente */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="price">Precio</label>
                    <input
                        id="price"
                        type="number"
                        placeholder="Precio del Ingrediente"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("price", {
                            required: "El precio es obligatorio",
                            min: { value: 1, message: "El precio debe ser mayor a 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.price && <ErrorMessage>{errors.price.message}</ErrorMessage>}
                </div>

                {/* Descuento */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="discount">Descuento (%)</label>
                    <input
                        id="discount"
                        type="number"
                        placeholder="Descuento del Ingrediente"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("discount", {
                            required: "El descuento es obligatorio",
                            min: { value: 0, message: "El descuento no puede ser menor a 0" },
                            max: { value: 100, message: "El descuento no puede ser mayor a 100" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.discount && <ErrorMessage>{errors.discount.message}</ErrorMessage>}
                </div>

                {/* Categoría */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="idCategoryIngredient">Categoría</label>
                    <select
                        id="idCategoryIngredient"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("idCategoryIngredient", { required: "La categoría es obligatoria" })}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories && categories.length > 0 ? (
                            categories.map((idCategoryIngredient) => (
                                <option key={idCategoryIngredient.id} value={idCategoryIngredient.id}>{idCategoryIngredient.name}</option>
                            ))
                        ) : (
                            <option value="">No hay categorías por mostrar</option>
                        )}
                    </select>
                    {errors.idCategoryIngredient && <ErrorMessage>{errors.idCategoryIngredient.message}</ErrorMessage>}
                </div>

                {/* Ingrediente Vendido */}
                {selectedIngredient && (
                    <div className="flex items-center gap-2">
                        <input
                            id="isSoldOut"
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded focus:ring-blue-400 cursor-pointer"
                            {...register("isSoldOut")}
                        />
                        <label className="font-medium" htmlFor="isSoldOut">¿Ingrediente vendido?</label>
                    </div>
                )}


                {/* Botones */}
                <div className={`flex justify-center items-center gap-4 ${selectedIngredient ? 'flex-row' : 'flex-col'}`}>
                    <Button type="primary" htmlType="submit" className="w-40">
                        {selectedIngredient ? "Actualizar" : "Agregar"}
                    </Button>
                    {selectedIngredient && (
                        <button
                            type="button"
                            className="w-40 bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-1.5"
                            onClick={handleDeleteIngredient}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    )
}
