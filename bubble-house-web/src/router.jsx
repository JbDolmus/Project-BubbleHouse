import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardView from "./views/DashboardView";
import AuthLayout from "./layouts/AuthLayout";
import LoginView from "./views/auth/LoginView";
import RegisterView from "./views/auth/RegisterView";
import DashboardSecondView from "./views/DashboardSecondView";
import IngredientView from "./views/project/IngredientView";
import ProductView from "./views/project/ProductView";
import RecipeView from "./views/project/RecipeView";
import UserView from "./views/project/UserView";
import UsersView from "./views/project/UsersView";
import MenuView from "./views/project/MenuView";
import BubbleView from "./views/project/BubbleView";
import CarView from "./views/project/CarView";
import OrderView from "./views/project/OrderView";

export default function Router() {
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
                    <Route path="/car" element={<CarView />} />
                </Route>

                <Route element={<AuthLayout />}>
                    <Route path="/" element={<LoginView />} index />
                    <Route path="/auth/register" element={<RegisterView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

