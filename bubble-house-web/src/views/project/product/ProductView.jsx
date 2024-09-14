import { useEffect, useState } from 'react'
import NavBarPrincipal from '@/layouts/NavBarPrincipal'
import { FaPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSubcategories } from '@/redux/thunks/subcategoryThunks';
import { getProducts } from '@/redux/thunks/productThunks';
import { ToastError } from "@/assets/js/toastify";
import FormProduct from "./FormProduct";

export default function ProductView() {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.user);
  const { products, errorRedux } = useSelector(state => state.product);
  const { subcategories } = useSelector(state => state.subcategory);
  const loadProducts = () => {
    if (token) {
      dispatch(getProducts(token));
      dispatch(getSubcategories(token));
    }
  };

  useEffect(() => {
    loadProducts();
  }, [dispatch, token]);

  useEffect(() => {
    if (errorRedux) {
      ToastError(errorRedux);
    }
  }, [errorRedux]);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {products && products.length > 0 ? (
            products.map(product => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl"
                onClick={() => showModal(product)}
              >
                <h2 className="text-xl font-semibold mb-2">Subcategoría: {product.subcategory.name}</h2>
                <h3 className="text-xl mb-2">{product.name}</h3>
                
                <p className={`text-lg font-semibold px-4 py-2 rounded-full ${product.is_sold_out
                    ? 'bg-red-100 text-red-600 border border-red-600'
                    : 'bg-green-100 text-green-600 border border-green-600'
                  } flex items-center justify-center gap-2`}
                >
                  {product.is_sold_out ? (
                    <>
                      <FaTimesCircle className="text-xl" /> Agotado
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
            <p className="text-white text-xl">No hay productos por mostrar</p>
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
