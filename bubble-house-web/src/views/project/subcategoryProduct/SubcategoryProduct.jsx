import { useEffect, useState } from 'react'
import NavBarPrincipal from '@/layouts/NavBarPrincipal'
import { FaPlus, FaArrowLeft } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux';
import { getSubcategories } from '@/redux/thunks/subcategoryThunks';
import { ToastError } from "@/assets/js/toastify";
import FormSubcategoryProduct from "./FormSubcategoryProduct";
import { getCategories } from "@/redux/thunks/categoryThunks";
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';

export default function SubcategoryProduct() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.user);
    const { subcategories, errorRedux } = useSelector(state => state.subcategory);
    const { categories } = useSelector(state => state.category);

    const loadSubcategories = () => {
        if (token) {
            dispatch(getSubcategories(token));
            dispatch(getCategories(token));
        }
    };

    useEffect(() => {
        loadSubcategories();
    }, [dispatch, token]);

    useEffect(() => {
        if (errorRedux) {
            ToastError(errorRedux);
        }
    }, [errorRedux]);

    const showModal = (subcategory = null) => {
        setSelectedSubcategory(subcategory);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedSubcategory(null);
    };

    return (
        <>
            <NavBarPrincipal
                title={"Productos"}
            />

            <div className="group self-start m-1 relative">

                <Tooltip title="Regresar a productos">
                    <Link
                        to="/products"
                        className="flex items-center text-white bg-gray-500 hover:bg-gray-600 font-bold p-3 rounded-full transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                    >
                        <FaArrowLeft className="mr-2" />
                    </Link>
                </Tooltip>
            </div>

            <div className="flex flex-col items-center min-h-screen px-6">
                <h1 className="text-4xl font-bold text-white mb-6">Listado de Subcategorías</h1>
                <div className="flex flex-col items-center gap-3 mb-4 md:flex-row md:justify-start w-full max-w-4xl">
                    <button
                        type='button'
                        onClick={() => showModal()}
                        className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-32 py-4 md:px-6 md:py-2 md:flex-row rounded"
                    >
                        <FaPlus className="text-3xl md:text-xl md:mx-1" />
                        Nueva Subcategoría
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-4xl">
                    {subcategories && subcategories.length > 0 ? (
                        subcategories.map(subcategory => (
                            <div
                                key={subcategory.id}
                                className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl"
                                onClick={() => showModal(subcategory)}
                            >
                                <h2 className="text-xl font-semibold mb-2">Categoría: {subcategory.category.name}</h2>
                                <h3 className="text-xl mb-2">{subcategory.name}</h3>
                            </div>
                        ))
                    ) : (
                        <p className="text-white text-xl">No hay subcategorías por mostrar</p>
                    )}
                </div>
            </div>

            <FormSubcategoryProduct
                isVisible={isModalVisible}
                onClose={handleCancel}
                refreshSubcategories={loadSubcategories}
                selectedSubcategory={selectedSubcategory}
                categories={categories}
            />
        </>
    )
}
