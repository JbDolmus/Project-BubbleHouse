import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { AiOutlineFrown } from 'react-icons/ai';
import NavBarSecondary from '@/layouts/NavBarSecondary';
import { SweetAlertQuestion } from '@/assets/js/sweetAlert';
import { getProducts } from '@/redux/thunks/productThunks';
import { getSubcategories } from '@/redux/thunks/subcategoryThunks';
import { getCategories } from '@/redux/thunks/categoryThunks';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 12,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 9,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 7,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};

export default function MenuView() {

  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.category);
  const { subcategories } = useSelector(state => state.subcategory);
  const { products } = useSelector(state => state.product);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const loadObjects = () => {
    dispatch(getCategories(""));
    dispatch(getSubcategories(""));
    dispatch(getProducts(""));
  };

  useEffect(() => {
    loadObjects();
  }, [dispatch]);

  const filteredSubcategories = selectedCategory
    ? subcategories.filter(sub => sub.category.id === selectedCategory.id)
    : [];

  const filteredProducts = selectedSubcategory
    ? products.filter(prod => prod.subcategory.id === selectedSubcategory.id)
    : selectedCategory
      ? products.filter(prod => prod.subcategory.category.id === selectedCategory.id)
      : products;

  const handleAddToCart = (product) => {
    if (!product.is_sold_out) {
      SweetAlertQuestion(
        'Agregar al carrito',
        `¿Desea agregar el producto ${product.name} al carrito?`,
        () => {
          console.log(`${product.name} agregado al carrito`);
        },
        'Producto agregado al carrito!'
      );
    }
  };

  return (
    <>
      <NavBarSecondary title={"Menú"} />
      <div className=" w-full">
        <div className="bg-white px-4 py-2 w-full">
          <div className="border border-gray-300 p-2 rounded-lg shadow-lg overflow-hidden">
            <Carousel responsive={responsive}>
              {categories.length > 0 && categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => { setSelectedCategory(category); setSelectedSubcategory(null) }}
                  className={`flex items-center justify-center p-3 mx-1 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-100 ${selectedCategory?.id === category.id ? "text-white bg-black hover:bg-slate-800" : "text-gray-800"}`}
                >
                  {category.name}
                </div>
              ))}
            </Carousel>
          </div>

          {selectedCategory && (
            <>
              <hr className="my-4" />
              <div className="p-2 w-full">
                <Carousel
                  responsive={responsive}
                >
                  {filteredSubcategories.length > 0 && filteredSubcategories.map((subcategory) => (
                    <div
                      key={subcategory.id}
                      onClick={() => setSelectedSubcategory(subcategory)}
                      className={`flex items-center justify-center mx-1 p-3 my-1 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-100 ${selectedSubcategory?.id === subcategory.id ? "text-white bg-black hover:bg-slate-800" : "text-gray-800"}`}
                    >
                      {subcategory.name}
                    </div>
                  ))}
                </Carousel>
              </div>
            </>
          )}
        </div>

        <div className='p-4'>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-6 cursor-pointer rounded-lg hover:shadow-lg ${product.is_sold_out ? "bg-gray-500 text-white relative" : "bg-white"}`}
                  onClick={() => handleAddToCart(product)}
                >
                  {product.is_sold_out && (
                    <div className="absolute inset-0 flex items-center cursor-no-drop justify-center rounded-lg bg-gray-700 bg-opacity-50 text-white font-bold">
                      Agotado
                    </div>
                  )}
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.subcategory.name}</p>
                  <p className="text-lg font-semibold">${product.price - (product.price * product.tax / 100)}</p>
                  {product.tax > 0 && (
                    <p className="text-sm text-red-500 line-through">${product.price}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 col-span-full bg-red-100 border border-red-300 rounded-lg shadow-lg">
                <AiOutlineFrown className="text-red-500 text-4xl mb-2" />
                <p className="text-red-600 text-lg font-bold text-center">
                  No hay productos disponibles.
                </p>
                <p className="text-gray-500 text-sm text-center">
                  Vuelve más tarde o explora otras categorías.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
