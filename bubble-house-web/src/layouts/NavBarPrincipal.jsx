import React, { useState } from 'react';
import {
  BsClipboard2PlusFill,
  BsFillFileRichtextFill,
  BsPersonCircle,
  BsPeopleFill,
  BsBoxArrowLeft
} from 'react-icons/bs';
import { DiApple } from "react-icons/di";
import { ImSpoonKnife } from "react-icons/im";
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';

export default function NavBarPrincipal({ title }) {
  const [selectedIcon,] = useState(title);

  const icons = [
    { Component: BsClipboard2PlusFill, title: "Pedidos", path: "/orders" },
    { Component: ImSpoonKnife, title: "Productos", path: "/products" },
    { Component: DiApple, title: "Ingredientes", path: "/ingredients" },
    { Component: BsFillFileRichtextFill, title: "Recetas", path: "/recipes" },
    { Component: BsPersonCircle, title: "Usuario", path: "/user" },
    { Component: BsPeopleFill, title: "Usuarios", path: "/users" },
    { Component: BsBoxArrowLeft, title: "Cerrar Sesión", path: "/" },
  ];

  return (
    <div className="flex justify-center items-center overflow-x-auto bg-white p-2 w-full space-x-4 md:space-x-8 ">
      <div className="flex justify-center items-center space-x-4 md:space-x-8">
        {icons.map(({ Component, title, path }, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex justify-center items-center rounded-lg p-2 md:p-4 hover:bg-gray-300 cursor-pointer transition-colors duration-200"
          >
            <Tooltip title={title}>
              <Link to={path}>
                <Component
                  className={`text-gray-800 ${selectedIcon === title ? 'text-blue-500' : ''} text-2xl md:text-4xl`}
                />
              </Link>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
