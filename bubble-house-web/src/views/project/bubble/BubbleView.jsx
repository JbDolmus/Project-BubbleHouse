import { useEffect, useState } from 'react';
import { Collapse, Switch, Typography, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import NavBarSecondary from '@/layouts/NavBarSecondary';
import { getIngredientCategories, getIngredients } from '@/redux/thunks/ingredientThunks';
import { addRecipe, cleanAlertRecipe } from '@/redux/thunks/recipeThunks';
import { addToCart } from '@/redux/slices/cartSlice';
import { SweetAlertQuestion, SweetAlertError } from '@/assets/js/sweetAlert';
import Spinner from '@/components/Spinner';

const { Title, Text } = Typography;

export default function BubbleView() {
  const dispatch = useDispatch();
  const { categories, ingredients, loading } = useSelector(state => state.ingredient);
  const { errorRedux } = useSelector((state) => state.recipe);
  const [selectedIngredients, setSelectedIngredients] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const loadIngredients = () => {
    dispatch(getIngredients());
    dispatch(getIngredientCategories());
  };

  useEffect(() => {
    loadIngredients();
  }, [dispatch]);

  useEffect(() => {
    if (errorRedux) {
      SweetAlertError(errorRedux);
      dispatch(cleanAlertRecipe());
    }
  }, [errorRedux]);

  const handleIngredientToggle = (ingredientId, categoryName) => {
    setSelectedIngredients(prev => {
      const newSelection = { ...prev };

      if (newSelection[categoryName]?.has(ingredientId)) {
        newSelection[categoryName].delete(ingredientId);
        if (newSelection[categoryName].size === 0) {
          delete newSelection[categoryName];
        }
      } else {
        newSelection[categoryName] = new Set([ingredientId]);
      }
      return newSelection;
    });
  };

  useEffect(() => {
    const hasSize = selectedIngredients["Tamaño"] && selectedIngredients["Tamaño"].size > 0;
    const hasDairy = selectedIngredients["Lácteo"] && selectedIngredients["Lácteo"].size > 0;
    const hasFlavor = selectedIngredients["Sabor"] && selectedIngredients["Sabor"].size > 0;

    setIsButtonDisabled(!(hasSize && hasDairy && hasFlavor));
  }, [selectedIngredients]);

  const collapseItems = categories.map((category) => ({
    key: category.id,
    label: (
      <Text className="text-lg font-bold text-purple-800 uppercase p-2 rounded-lg tracking-wide">
        {category.name}
      </Text>
    ),
    children: (
      <ul className="pl-4 bg-blue-100 bg-opacity-80 rounded-lg p-4 shadow-inner">
        <Text className="text-blue-600 font-semibold uppercase block mb-2">
          Elegir {category.name}
        </Text>
        {ingredients.filter((ingredient) => ingredient.ingredient_category.id === category.id && !ingredient.isSoldOut)
          .map((ingredient) => (
            <li key={ingredient.id} className="flex items-center justify-between py-2 border-b border-gray-300">
              <Text className="text-gray-700 text-lg font-medium">{ingredient.name}</Text>
              <Switch
                checked={selectedIngredients[category.name]?.has(ingredient.id) || false}
                onChange={() => handleIngredientToggle(ingredient.id, category.name)}
              />
            </li>
          ))}
      </ul>
    )
  }));

  const handleAddRecipe = () => {

    const formattedIngredients = Object.values(selectedIngredients).flatMap((ids) =>
      Array.from(ids).map((id) => ({ ingredient: id }))
    );

    const recipe = {
      name: "Bubble Té Personalizado",
      state: 0,
      ingredients: formattedIngredients,
    };

    SweetAlertQuestion(
      'Crear Bubble',
      `¿Desea crear el bubble té personalizado?`,
      () => {
        dispatch(addRecipe(recipe))
          .unwrap()
          .then((response) => {

            const product = {
              id: new Date().getTime(),
              idRecipe: response.id,
              name: response.name,
              price: response.total_price,
              discount: response.total_discount,
              tax: 0,
              ingredients: response.ingredients,
            }
            dispatch(addToCart(product));
            setSelectedIngredients({});
            setIsButtonDisabled(true);
            dispatch(cleanAlertRecipe());
          });
      },
      'Bubble creado exitosamente!'
    );
  };

  return (
    <>
      <NavBarSecondary title="Crear Bubble" />

      {loading ?
        <Spinner />
        :
        <div className='flex flex-col min-h-screen'>
          <div className="m-4 p-6 bg-gradient-to-b from-blue-200 via-blue-100 to-purple-100 relative">
            <Title level={2} className="text-center text-blue-800 font-extrabold mb-8 text-2xl tracking-wider">
              ELEGIR CATEGORÍA
            </Title>

            <Text className="block text-center text-blue-600 font-medium mb-6 text-lg">
              Selecciona los ingredientes para cada categoría que desees incluir en este Bubble.
            </Text>

            <Collapse items={collapseItems} accordion bordered={false} className="bg-white shadow-lg rounded-lg" />

            {/* Botón para crear el Bubble */}
            <div className="flex justify-center mt-8">
              <Button
                type="primary"
                size="large"
                disabled={isButtonDisabled}
                onClick={handleAddRecipe}
                className={`${isButtonDisabled ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-bold py-3 px-6 rounded-full transition duration-200 ease-in-out`}
              >
                Crear Bubble
              </Button>
            </div>
          </div>
        </div>
      }
    </>
  );
}
