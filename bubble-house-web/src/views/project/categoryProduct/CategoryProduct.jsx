import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaSearch } from "react-icons/fa";
import NavBarPrincipal from "@/layouts/NavBarPrincipal";
import FormCategoryProducto from "./FormCategoryProducto";
import { useDispatch, useSelector } from "react-redux";
import { getCategories, cleanAlertCategory } from "@/redux/thunks/categoryThunks";
import { ToastError, ToastSuccess } from "@/assets/js/toastify";
import { Tooltip } from "antd";
import { removeAccents } from "@/utils/removeAccents";
import Spinner from "@/components/Spinner";

export default function CategoryProduct() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const dispatch = useDispatch();
    const { categories, errorRedux, loading, message } = useSelector(state => state.category);

    const loadCategories = () => {
        dispatch(getCategories());
    };

    useEffect(() => {
        loadCategories();
    }, [dispatch]);

    useEffect(() => {
        if (message) {
            ToastSuccess(message);
            dispatch(cleanAlertCategory());
        }
        if (errorRedux) {
            ToastError(errorRedux);
            dispatch(cleanAlertCategory());
        }
    }, [errorRedux, message]);

    useEffect(() => {
        if (categories) {
            const filtered = categories.filter(category =>
                removeAccents(category.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
            );
            setFilteredCategories(filtered);
        }
    }, [searchTerm, categories]);

    const showModal = (category = null) => {
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedCategory(null);
    };

    return (
        <>
            <NavBarPrincipal
                title={"Productos"}
            />
            {loading ?
                <Spinner />
                :
                <>
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

                    <div className="flex flex-col items-center min-h-screen p-6">

                        <h1 className="text-4xl font-bold text-white mb-6">Listado de Categorías</h1>
                        <div className="flex flex-col items-center gap-3 mb-4 md:flex-row md:justify-start w-full max-w-4xl">
                            <button
                                type='button'
                                onClick={() => showModal()}
                                className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-32 py-4 md:px-6 md:py-2 md:flex-row rounded"
                            >
                                <FaPlus className="text-3xl md:text-xl md:mx-1" />
                                Nueva Categoría
                            </button>
                        </div>
                        <div className="relative mb-6 w-full max-w-4xl">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Buscar categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 p-2 w-full border rounded-md"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-4xl">
                            {filteredCategories && filteredCategories.length > 0 ? (
                                filteredCategories.map(category => (
                                    <div
                                        key={category.id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl"
                                        onClick={() => showModal(category)}
                                    >
                                        <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-3 w-full text-center mt-10 p-6 max-w-lg mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
                                    <p className="text-white text-xl font-bold mb-2 animate-pulse">
                                        No se encontraron categorías que coincidan con tu búsqueda
                                    </p>
                                    <p className="text-lg text-gray-200">
                                        Intenta con un término diferente o{' '}
                                        <span
                                            className="text-blue-300 underline font-semibold cursor-pointer transition-colors duration-200 hover:text-blue-400"
                                            onClick={() => setSearchTerm('')}
                                        >
                                            borra el filtro
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            }
            <FormCategoryProducto
                isVisible={isModalVisible}
                onClose={handleCancel}
                refreshCategories={loadCategories}
                selectedCategory={selectedCategory}
            />
        </>
    )
}
