import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./slices/userSlice";
import categorySlice from "./slices/categorySlice";
import rolSlice from "./slices/rolSlice";
import subcategorySlice from "./slices/subcategorySlice";

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
});

export default rootReducer;
