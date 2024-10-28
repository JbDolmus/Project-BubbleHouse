import { useEffect, useState } from 'react'
import NavBarPrincipal from '@/layouts/NavBarPrincipal'
import { FaPlus, FaCheckCircle, FaSearch } from 'react-icons/fa'
import { GoAlertFill } from "react-icons/go";
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSubcategories } from '@/redux/thunks/subcategoryThunks';
import { getProducts } from '@/redux/thunks/productThunks';
import { ToastError } from "@/assets/js/toastify";
import FormProduct from "./FormProduct";
import { removeAccents } from '@/utils/removeAccents';

export default function ProductView() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  const { products, errorRedux } = useSelector(state => state.product);
  const { subcategories } = useSelector(state => state.subcategory);
  const loadProducts = () => {
    dispatch(getProducts());
    dispatch(getSubcategories());
  };

  useEffect(() => {
    loadProducts();
  }, [dispatch]);

  useEffect(() => {
    if (errorRedux) {
      ToastError(errorRedux);
    }
  }, [errorRedux]);

  useEffect(() => {
    if (products) {
      const filtered = products.filter(product =>
        removeAccents(product.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase())) ||
        removeAccents(product.subcategory.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const showModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <NavBarPrincipal
        title={"Productos"}
      />
      <div className="flex flex-col items-center min-h-screen p-6">
        <h1 className="text-4xl font-bold text-white mb-6">Listado de Productos</h1>

        <div className="flex flex-col items-center gap-3 mb-4 md:flex-row md:justify-start w-full max-w-4xl">

          <Link
            to="/categoryProduct"
            className="flex flex-col items-center bg-purple-500 hover:bg-purple-600 text-white font-bold px-32 py-7 md:px-6 md:py-2 md:flex-row rounded"
          >
            Sección de Categorías
          </Link>
          <Link
            to="/subcategoryProduct"
            className="flex flex-col items-center bg-purple-500 hover:bg-purple-600 text-white font-bold px-32 py-7 md:px-6 md:py-2 md:flex-row rounded"
          >
            Sección de Subcategorías
          </Link>
          <button
            type='button'
            onClick={() => showModal()}
            className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-32 py-4 md:px-6 md:py-2 md:flex-row rounded"
          >
            <FaPlus className="text-3xl md:text-xl md:mx-1" />
            Nuevo Producto
          </button>
        </div>
        {/* Input de búsqueda */}
        <div className="relative mb-6 w-full max-w-4xl">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 p-2 w-full border rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl"
                onClick={() => showModal(product)}
              >
                <h2 className="text-xl font-semibold mb-2">Subcategoría: {product.subcategory.name}</h2>
                <h3 className="text-xl mb-2">{product.name}</h3>

                <p className={`text-lg font-semibold px-4 py-2 rounded-full ${product.is_sold_out
                  ? 'bg-yellow-100 text-yellow-500 border border-yellow-600'
                  : 'bg-green-100 text-green-600 border border-green-600'
                  } flex items-center justify-center gap-2`}
                >
                  {product.is_sold_out ? (
                    <>
                      <GoAlertFill className="text-xl" /> Agotado
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="text-xl" /> Disponible
                    </>
                  )}
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 w-full text-center mt-10 p-6 max-w-lg mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
              <p className="text-white text-xl font-bold mb-2 animate-pulse">
                No se encontraron productos que coincidan con tu búsqueda
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

      <FormProduct
        isVisible={isModalVisible}
        onClose={handleCancel}
        refreshProducts={loadProducts}
        selectedProduct={selectedProduct}
        subcategories={subcategories}
      />
    </>
  )
}
