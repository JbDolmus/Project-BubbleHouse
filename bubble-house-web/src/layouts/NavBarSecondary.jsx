import React, { useState } from 'react';
import { ImBook, ImMug } from 'react-icons/im';
import { BsCartPlusFill, BsBoxArrowRight } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

export default function NavBarSecondary({title}) {
  const [selectedIcon, ] = useState(title);


  const icons = [
    { Component: ImBook, title: "Menú", path:"/menu" },
    { Component: ImMug, title: "Crear Bubble", path:"/bubble"  },
    { Component: BsCartPlusFill, title: "Carrito", path:"/car"  },
    { Component: BsBoxArrowRight, title: "Iniciar Sesión", path:"/"  },
  ];

  return (
    <div className="flex justify-center items-center overflow-x-auto bg-white p-2 w-full space-x-4 md:space-x-8">
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
