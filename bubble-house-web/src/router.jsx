import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import DashboardSecondView from "./views/DashboardSecondView";
import IngredientView from "./views/project/ingredient/IngredientView";
import ProductView from "./views/project/product/ProductView";
import RecipeView from "./views/project/recipe/RecipeView";
import UserView from "./views/project/user/UserView";
import UsersView from "./views/project/user/UsersView";
import MenuView from "./views/project/menu/MenuView";
import BubbleView from "./views/project/bubble/BubbleView";
import CartView from "./views/project/cart/CartView";
import OrderView from "./views/project/order/OrderView";
import CategoryProduct from "./views/project/categoryProduct/CategoryProduct";
import SubcategoryProduct from "./views/project/subcategoryProduct/SubcategoryProduct";
import { startTimer, runTimer } from '@/redux/slices/timerSlice';

export default function Router() {
    const dispatch = useDispatch();
    const { products } = useSelector(state => state.cart);
    const { isCounting } = useSelector((state) => state.timer);
    useEffect(() => {
        if (products.length > 0 && !isCounting) {
            dispatch(startTimer());
        }
        const timerInterval = dispatch(runTimer());

        return () => {
            clearInterval(timerInterval);
        };
    }, [products, dispatch, isCounting]);

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/home" element={<DashboardView />} />
                    <Route path="/home-secondary" element={<DashboardSecondView />} />
                    <Route path="/orders" element={<OrderView />} />
                    <Route path="/products" element={<ProductView />} />
                    <Route path="/recipes" element={<RecipeView />} />
                    <Route path="/user" element={<UserView />} />
                    <Route path="/users" element={<UsersView />} />
                    <Route path="/ingredients" element={<IngredientView />} />
                    <Route path="/menu" element={<MenuView />} />
                    <Route path="/bubble" element={<BubbleView />} />
                    <Route path="/cart" element={<CartView />} />
                    <Route path="/categoryProduct" element={<CategoryProduct />} />
                    <Route path="/subcategoryProduct" element={<SubcategoryProduct />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/" element={<LoginView />} index />
                    <Route path="/auth/register" element={<RegisterView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

