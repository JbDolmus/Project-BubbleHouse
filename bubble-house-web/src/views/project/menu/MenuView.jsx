import { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import NavBarSecondary from '@/layouts/NavBarSecondary';
import { SweetAlertQuestion } from '@/assets/js/sweetAlert';
import { useDispatch, useSelector } from 'react-redux';

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
  //const {categories} = useSelector(state => state.category);
  //const {subcategories} = useSelector(state => state.subcategory);
  //const { products, errorRedux } = useSelector(state => state.product);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const categories = [
    { id: 1, name: "Bubble" },
    { id: 2, name: "Suschi" },
    { id: 3, name: "Combos" },
    { id: 4, name: "Ramen" },
    { id: 5, name: "Tacos" },
    { id: 6, name: "Burgers" },
    { id: 7, name: "Pizzas" },
    { id: 8, name: "Postres" },
    { id: 9, name: "Bebidas" },
    { id: 10, name: "Salsas" },
    { id: 11, name: "Ensaladas" },
    { id: 12, name: "Sopas" },
  ];

  const subcategories = [
    { id: 1, name: "Queso", Category: { id: 1 } },
    { id: 2, name: "Si Queso", Category: { id: 1 } },
    { id: 3, name: "Carne", Category: { id: 2 } },
    { id: 4, name: "En agua", Category: { id: 2 } },
    { id: 5, name: "En crema", Category: { id: 2 } },
    { id: 6, name: "Taco de pollo", Category: { id: 5 } },
    { id: 7, name: "Taco de res", Category: { id: 5 } },
    { id: 8, name: "Hamburguesa clásica", Category: { id: 6 } },
    { id: 9, name: "Hamburguesa BBQ", Category: { id: 6 } },
    { id: 10, name: "Pizza Margherita", Category: { id: 7 } },
    { id: 11, name: "Pizza Pepperoni", Category: { id: 7 } },
    { id: 12, name: "Pastel de chocolate", Category: { id: 8 } },
    { id: 13, name: "Helado de vainilla", Category: { id: 8 } },
  ];

  const products = [
    { id: 1, name: "Queso", Subcategory: { id: 1, name: "Queso", Category: { id: 1 } }, price: 1500, tax: 10, is_sold_out: false },
    { id: 2, name: "Queso con tomate", Subcategory: { id: 1, name: "Queso", Category: { id: 1 } }, price: 1500, tax: 10, is_sold_out: false },
    { id: 3, name: "Carne", Subcategory: { id: 3, name: "Carne", Category: { id: 2 } }, price: 1500, tax: 10, is_sold_out: false },
    { id: 4, name: "Carne con tomate", Subcategory: { id: 3, name: "Carne", Category: { id: 2 } }, price: 1500, tax: 10, is_sold_out: false },
    { id: 5, name: "Taco de pollo", Subcategory: { id: 6, name: "Taco de pollo", Category: { id: 5 } }, price: 1200, tax: 10, is_sold_out: false },
    { id: 6, name: "Taco de res", Subcategory: { id: 7, name: "Taco de res", Category: { id: 5 } }, price: 1300, tax: 10, is_sold_out: true },
    { id: 7, name: "Hamburguesa clásica", Subcategory: { id: 8, name: "Hamburguesa clásica", Category: { id: 6 } }, price: 2000, tax: 10, is_sold_out: false },
    { id: 8, name: "Pizza Margherita", Subcategory: { id: 10, name: "Pizza Margherita", Category: { id: 7 } }, price: 2500, tax: 10, is_sold_out: false },
    { id: 9, name: "Pizza Pepperoni", Subcategory: { id: 11, name: "Pizza Pepperoni", Category: { id: 7 } }, price: 2800, tax: 10, is_sold_out: true },
    { id: 10, name: "Pastel de chocolate", Subcategory: { id: 12, name: "Pastel de chocolate", Category: { id: 8 } }, price: 1500, tax: 15, is_sold_out: false },
    { id: 11, name: "Helado de vainilla", Subcategory: { id: 13, name: "Helado de vainilla", Category: { id: 8 } }, price: 800, tax: 5, is_sold_out: false },
  ];

  const filteredSubcategories = selectedCategory
    ? subcategories.filter(sub => sub.Category.id === selectedCategory.id)
    : [];

  const filteredProducts = selectedSubcategory
    ? products.filter(prod => prod.Subcategory.id === selectedSubcategory.id)
    : selectedCategory
      ? products.filter(prod => prod.Subcategory.Category.id === selectedCategory.id)
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
              {categories.map((category) => (
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
                  {filteredSubcategories.map((subcategory) => (
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
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className={`p-6 cursor-pointer rounded-lg hover:shadow-lg ${product.is_sold_out ? "cursor-no-drop bg-gray-500 text-white relative" : "bg-white"}`}
                onClick={() => handleAddToCart(product)}
              >
                {product.is_sold_out && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-700 bg-opacity-50 text-white font-bold">
                    Agotado
                  </div>
                )}
                <h3 className="font-bold text-lg">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.Subcategory.name}</p>
                <p className="text-lg font-semibold">${product.price - product.tax}</p>
                {product.tax > 0 && (
                  <p className="text-sm text-red-500 line-through">${product.price}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
