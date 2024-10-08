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

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "userSession", "users", "token", "refresh"],
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userSlice),
  category: categorySlice,
  subcategory: subcategorySlice,
  rol: rolSlice,
  product: productSlice,
  ingredient: ingredientSlice,
  recipe: recipeSlice,
});

export default rootReducer;
