import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, editProduct, deleteProduct, cleanAlertProduct } from '@/redux/thunks/productThunks';
import { ToastError, ToastSuccess } from "@/assets/js/toastify";
import { SweetAlertEliminar } from "@/assets/js/sweetAlert";
import ErrorMessage from '@/components/ErrorMessage';

const FormProduct = ({ isVisible, onClose, refreshProducts, selectedProduct, subcategories }) => {

    const { token } = useSelector(state => state.user);
    const { products } = useSelector(state => state.product);
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
            tax: 0,
            subcategory: "",
            isSoldOut: false,
        },
    });

    useEffect(() => {
        if (selectedProduct) {
            setValue('name', selectedProduct.name);
            setValue('price', selectedProduct.price);
            setValue('tax', selectedProduct.tax);
            setValue('subcategory', selectedProduct.subcategory.id);
            setValue('isSoldOut', selectedProduct.is_sold_out);
        } else {
            reset();
        }
    }, [selectedProduct, setValue, reset]);

    const isDuplicateProduct = (formData) => {
        const isDuplicateName = products.some(product => product.name === formData.name && product.id !== selectedProduct?.id);
        if (isDuplicateName) {
            ToastError("Ese producto ya existe.");
            return true;
        }

        return false;
    };

    const handleAddOrEditProduct = (formData) => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        if (isDuplicateProduct(formData)) return;

        const productData = {
            id: selectedProduct?.id,
            token,
            product: {
                name: formData.name,
                subcategory: null,
                subcategory_id: formData.subcategory,
                price: formData.price,
                tax: formData.tax,
                is_sold_out: formData.isSoldOut,
            }
        };

        if (selectedProduct) {
            dispatch(editProduct(productData))
                .unwrap()
                .then(() => {
                    ToastSuccess("Producto actualizado con éxito");
                    onClose();
                    reset();
                    refreshProducts();
                    dispatch(cleanAlertProduct());
                })
        } else {
            dispatch(addProduct(productData))
                .unwrap()
                .then(() => {

                    ToastSuccess("Producto agregado con éxito");
                    onClose();
                    reset();
                    refreshProducts();
                    dispatch(cleanAlertProduct());
                })
        }
    }

    const handleDeleteProduct = () => {
        if (!token) {
            ToastError("Token no disponible");
            return;
        }

        SweetAlertEliminar("¿Estás seguro de que deseas eliminar este producto?", () => {
            dispatch(deleteProduct({ id: selectedProduct.id, token }))
                .unwrap()
                .then(() => {
                    ToastSuccess("Producto eliminado con éxito");
                    setTimeout(() => {
                        onClose();
                        reset();
                        refreshProducts();
                        dispatch(cleanAlertProduct());
                    }, 0);
                })
        });
    }

    return (
        <Modal
            title={
                <span className="flex text-center text-lg font-semibold justify-center">
                    {selectedProduct ? "Modificar Producto" : "Agregar Producto"}
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
            <form onSubmit={handleSubmit(handleAddOrEditProduct)} className="space-y-4">
                {/* Nombre del Producto */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="name">Nombre del Producto</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Nombre del Producto"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("name", {
                            required: "El nombre del producto es obligatorio",
                            pattern: {
                                value: /^[a-zA-Z0-9@áéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                                message: "El nombre solo puede contener letras, números, '@' y espacios",
                            },
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                </div>

                {/* Precio del Producto */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="price">Precio</label>
                    <input
                        id="price"
                        type="number"
                        placeholder="Precio del Producto"
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
                    <label className="font-medium" htmlFor="tax">Descuento (%)</label>
                    <input
                        id="tax"
                        type="number"
                        placeholder="Descuento del Producto"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("tax", {
                            required: "El descuento es obligatorio",
                            min: { value: 0, message: "El descuento no puede ser menor a 0" },
                            valueAsNumber: true,
                        })}
                    />
                    {errors.tax && <ErrorMessage>{errors.tax.message}</ErrorMessage>}
                </div>

                {/* Categoría */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium" htmlFor="subcategory">Subcategoría</label>
                    <select
                        id="subcategory"
                        className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                        {...register("subcategory", { required: "La subcategoría es obligatoria" })}
                    >
                        <option value="">Selecciona una subcategoría</option>
                        {subcategories && subcategories.length > 0 ? (
                            subcategories.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                            ))
                        ) : (
                            <option value="">No hay subcategorías por mostrar</option>
                        )}
                    </select>
                    {errors.subcategory && <ErrorMessage>{errors.subcategory.message}</ErrorMessage>}
                </div>

                {/* Producto Vendido */}
                {selectedProduct && (
                    <div className="flex items-center gap-2">
                        <input
                            id="isSoldOut"
                            type="checkbox"
                            className="w-4 h-4 border-gray-300 rounded focus:ring-blue-400 cursor-pointer"
                            {...register("isSoldOut")}
                        />
                        <label className="font-medium" htmlFor="isSoldOut">¿Producto vendido?</label>
                    </div>
                )}


                {/* Botones */}
                <div className={`flex justify-center items-center gap-4 ${selectedProduct ? 'flex-row' : 'flex-col'}`}>
                    <Button type="primary" htmlType="submit" className="w-40">
                        {selectedProduct ? "Actualizar" : "Agregar"}
                    </Button>
                    {selectedProduct && (
                        <button
                            type="button"
                            className="w-40 bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-1.5"
                            onClick={handleDeleteProduct}
                        >
                            Eliminar
                        </button>
                    )}
                </div>
            </form>
        </Modal>
    );
}

export default FormProduct
