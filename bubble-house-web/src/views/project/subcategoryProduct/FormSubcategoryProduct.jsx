import { useDispatch, useSelector } from "react-redux";
import { addSubcategory, editSubcategory, deleteSubcategory, cleanAlertSubcategory } from '@/redux/thunks/subcategoryThunks';
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Button, Modal } from "antd";
import { ToastSuccess, ToastError } from "@/assets/js/toastify";
import { SweetAlertEliminar } from "@/assets/js/sweetAlert";
import ErrorMessage from '@/components/ErrorMessage';


export default function FormSubcategoryProduct({ isVisible, onClose, refreshSubcategories, selectedSubcategory, categories }) {

  const { token } = useSelector(state => state.user);
  const { subcategories } = useSelector(state => state.subcategory);
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
      category: "",
    },
  });

  useEffect(() => {
    if (selectedSubcategory) {
      setValue('name', selectedSubcategory.name);
      setValue('category', selectedSubcategory.category.id);
    } else {
      reset();
    }
  }, [selectedSubcategory, setValue, reset]);

  const isDuplicateSubcategory = (formData) => {
    const isDuplicateName = subcategories.some(subcategory => subcategory.name === formData.name && subcategory.id !== selectedSubcategory?.id);
    if (isDuplicateName) {
      ToastError("Esa subcategoría ya existe.");
      return true;
    }

    return false;
  };

  const handleAddOrEditSubcategory = (formData) => {
    if (!token) {
      ToastError("Token no disponible");
      return;
    }

    if (isDuplicateSubcategory(formData)) return;

    const subcategoryData = {
      id: selectedSubcategory?.id,
      token,
      subcategory: {
        name: formData.name,
        category: null,
        category_id: formData.category
      }
    };

    if (selectedSubcategory) {
      dispatch(editSubcategory(subcategoryData))
        .unwrap()
        .then(() => {
          ToastSuccess("Subcategoría actualizada con éxito");
          onClose();
          reset();
          refreshSubcategories();
          dispatch(cleanAlertSubcategory());
        })
    } else {
      dispatch(addSubcategory(subcategoryData))
        .unwrap()
        .then(() => {

          ToastSuccess("Subcategoría agregada con éxito");
          onClose();
          reset();
          refreshSubcategories();
          dispatch(cleanAlertSubcategory());
        })
    }
  }

  const handleDeleteSubcategory = () => {
    if (!token) {
      ToastError("Token no disponible");
      return;
    }

    SweetAlertEliminar("¿Estás seguro de que deseas eliminar esta subcategoría?", () => {
      dispatch(deleteSubcategory({ id: selectedSubcategory.id, token }))
        .unwrap()
        .then(() => {
          ToastSuccess("Subcategoría eliminada con éxito");
          setTimeout(() => {
            onClose();
            reset();
            refreshSubcategories();
            dispatch(cleanAlertSubcategory());
          }, 0);
        })
    });
  }

  return (
    <Modal
      title={selectedSubcategory ? "Modificar Subcategoría" : "Agregar Subcategoría"}
      open={isVisible}
      onCancel={() => {
        reset();
        onClose();
      }}
      footer={null}
      centered
      width={500}
    >
      <form onSubmit={handleSubmit(handleAddOrEditSubcategory)} className="space-y-4">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="name">Nombre de Subcategoría</label>
          <input
            id="name"
            type="text"
            placeholder="Nombre de Subcategoría"
            className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("name", {
              required: "El nombre de la subcategoría es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9@áéíóúüÁÉÍÓÚÜñÑ\s]+$/,
                message: "El nombre solo puede contener letras, números, '@' y espacios",
              },
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-2">
          <label className="font-medium" htmlFor="category">Categoría</label>
          <select
            id="category"
            className="w-full p-3 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("category", { required: "La categoría es obligatoria" })}
          >
            <option value="">Selecciona una categoría</option>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))
            ) : (
              <option value="">No hay categorías por mostrar</option>
            )}

          </select>
          {errors.category && <ErrorMessage>{errors.category.message}</ErrorMessage>}
        </div>

        {/* Botones */}
        <div className={`flex justify-center items-center gap-4 ${selectedSubcategory ? 'flex-row' : 'flex-col'}`}>
          <Button type="primary" htmlType="submit" className="w-40">
            {selectedSubcategory ? "Actualizar" : "Agregar"}
          </Button>
          {selectedSubcategory && (
            <button
              type='button'
              className="w-40 bg-red-500 text-white hover:bg-red-600 rounded-md px-4 py-1.5"
              onClick={handleDeleteSubcategory}
            >
              Eliminar
            </button>
          )}
        </div>
      </form>
    </Modal>
  )
}
