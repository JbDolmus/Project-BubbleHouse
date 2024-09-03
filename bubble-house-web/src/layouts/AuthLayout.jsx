import { Link, Outlet } from "react-router-dom";
import Logo from "@/components/icons/Logo";
import { BsFillHouseFill } from "react-icons/bs";
import { Tooltip } from "@mui/material";

export default function AuthLayout() {
    return (
        <>
            <header className="w-full p-4 bg-gray-600 flex justify-end items-center">
                
                <Tooltip title="Home">
                    <Link to="/menu">
                        <BsFillHouseFill className="text-white text-4xl hover:text-blue-400 transition-colors duration-200" />
                    </Link>
                </Tooltip>
            </header>
            <div className="bg-primaryColor min-h-screen flex flex-col items-center justify-center">
                <div className="w-full max-w-[450px] px-4 lg:px-0 my-5">

                    <div className="flex justify-center">
                        <Logo />
                    </div>
                    <div className="mt-10">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>

    );
}
