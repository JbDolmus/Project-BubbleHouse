import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import NavBarPrincipal from '@/layouts/NavBarPrincipal';
import { getIngredientCategories } from '@/redux/thunks/ingredientThunks';
import { getRecipes, deleteRecipe, cleanAlertRecipe } from '@/redux/thunks/recipeThunks';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineFrown } from 'react-icons/ai';
import { formatDate } from '@/utils/formatedDate';
import { ToastError, ToastSuccess } from '@/assets/js/toastify';
import { SweetAlertEliminar } from '@/assets/js/sweetAlert';
import Spinner from '@/components/Spinner';

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


export default function RecipeView() {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.ingredient);
  const { token } = useSelector(state => state.user);
  const { recipes, loading } = useSelector(state => state.recipe);
  const [selectedIngredientCategory, setSelectedIngredientCategory] = useState(null);

  const loadObjects = () => {
    dispatch(getIngredientCategories());
    dispatch(getRecipes());
  }
  useEffect(() => {
    loadObjects();
  }, [dispatch]);

  const filteredRecipes = selectedIngredientCategory
    ? recipes.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        ingredient.ingredient.ingredient_category.id === selectedIngredientCategory.id
      )
    )
    : recipes;

  const handleCategoryClick = (category) => {
    if (selectedIngredientCategory?.id === category.id) {
      setSelectedIngredientCategory(null);
    } else {
      setSelectedIngredientCategory(category);
    }
  };

  const handleDeleteRecipe = (idRecipe) => {
    if (!token) {
      ToastError("Token no disponible");
      return;
    }

    SweetAlertEliminar("¿Estás seguro de que deseas eliminar esta receta?", () => {
      dispatch(deleteRecipe({ id: idRecipe, token }))
        .unwrap()
        .then(() => {
          ToastSuccess("Receta eliminada con éxito");
          setTimeout(() => {
            loadObjects();
            dispatch(cleanAlertRecipe());
          }, 0);
        })
    });
  }

  return (
    <>
      <NavBarPrincipal
        title={"Recetas"}
      />
      {loading ?
        <Spinner />
        :
        <div className='w-full'>
          <div className="bg-white px-4 py-2 w-full">
            <div className="border border-gray-300 p-2 rounded-lg shadow-lg overflow-hidden">
              <Carousel responsive={responsive}>
                {categories.length > 0 && categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center justify-center p-3 mx-1 rounded-lg cursor-pointer transition-all duration-300 hover:bg-slate-100 ${selectedIngredientCategory?.id === category.id ? "text-white bg-black hover:bg-slate-800" : "text-gray-800"}`}
                  >
                    {category.name}
                  </div>
                ))}
              </Carousel>
            </div>
          </div>

          <div className='p-4'>
            <h1 className="text-4xl font-bold text-white mb-6 text-center">Listado de Recetas</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.length > 0 ? (
                filteredRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex flex-col p-6 rounded-lg shadow-xl hover:shadow-2xl bg-white border border-gray-200 transition-all duration-300"
                  >
                    <h3 className="font-bold text-gray-700 text-lg mb-4">{recipe.name}</h3>
                    <div className="mb-4">
                      {recipe.ingredients.map((ingredient) => (
                        <p key={ingredient.id} className="text-gray-500"><span className='font-bold'>{ingredient.ingredient.ingredient_category.name}{': '}</span>{ingredient.ingredient.name}</p>
                      ))}
                    </div>
                    <div className="text-gray-400 text-sm mb-4">
                      <p><span className='font-bold'>Fecha:</span> {formatDate(recipe.created_at).split(' ')[0]}</p>
                      <p><span className='font-bold'>Hora:</span> {formatDate(recipe.created_at).split(' ')[1]} {formatDate(recipe.created_at).split(' ')[2]}</p>
                    </div>
                    <div className="flex justify-center items-end">
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-10 rounded focus:outline-none transition-all duration-300"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 col-span-full bg-red-100 border border-red-300 rounded-lg shadow-lg">
                  <AiOutlineFrown className="text-red-500 text-4xl mb-2" />
                  <p className="text-red-600 text-lg font-bold text-center">
                    No hay recetas disponibles.
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    Vuelve más tarde o explora otras categorías.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      }
    </>
  )
}
