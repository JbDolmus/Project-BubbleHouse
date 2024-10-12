import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import categorySlice from "./slices/categorySlice";
import rolSlice from "./slices/rolSlice";
import subcategorySlice from "./slices/subcategorySlice";
import productSlice from "./slices/productSlice";
import ingredientSlice from "./slices/ingredientSlice";
import recipeSlice from "./slices/recipeSlice";
import cartSlice from "./slices/cartSlice";
import timerSlice from "./slices/timerSlice";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "userSession", "users", "token", "refresh"],
};
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["products"],
};

const timerPersistConfig = { 
  key: "timer", 
  storage,
  whitelist: ["value", "isCounting"],
}; 

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice),
  category: categorySlice,
  subcategory: subcategorySlice,
  rol: rolSlice,
  product: productSlice,
  ingredient: ingredientSlice,
  recipe: recipeSlice,
  cart: persistReducer(cartPersistConfig, cartSlice),
  timer: persistReducer(timerPersistConfig, timerSlice),
});

export default rootReducer;
