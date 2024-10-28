import { useEffect, useState } from 'react'
import NavBarPrincipal from '@/layouts/NavBarPrincipal'
import { FaPlus, FaArrowLeft, FaSearch } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { getSubcategories } from '@/redux/thunks/subcategoryThunks';
import { ToastError } from "@/assets/js/toastify";
import FormSubcategoryProduct from "./FormSubcategoryProduct";
import { getCategories } from "@/redux/thunks/categoryThunks";
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { removeAccents } from '@/utils/removeAccents';

export default function SubcategoryProduct() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const dispatch = useDispatch();
    const { subcategories, errorRedux } = useSelector(state => state.subcategory);
    const { categories } = useSelector(state => state.category);

    const loadSubcategories = () => {
        dispatch(getSubcategories());
        dispatch(getCategories());
    };

    useEffect(() => {
        loadSubcategories();
    }, [dispatch]);

    useEffect(() => {
        if (errorRedux) {
            ToastError(errorRedux);
        }
    }, [errorRedux]);

    useEffect(() => {
        if (subcategories) {
            const filtered = subcategories.filter(subcategory =>
                removeAccents(subcategory.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase())) ||
                removeAccents(subcategory.category.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
            );
            setFilteredSubcategories(filtered);
        }
    }, [searchTerm, subcategories]);

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
                {/* Input de búsqueda */}
                <div className="relative mb-6 w-full max-w-4xl">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar subcategoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 p-2 w-full border rounded-md"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-4xl">
                    {filteredSubcategories && filteredSubcategories.length > 0 ? (
                        filteredSubcategories.map(subcategory => (
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
                        <div className="col-span-3 w-full text-center mt-10 p-6 max-w-lg mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
                            <p className="text-white text-xl font-bold mb-2 animate-pulse">
                                No se encontraron subcategorías que coincidan con tu búsqueda
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
