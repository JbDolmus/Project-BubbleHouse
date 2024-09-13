import React, { useState } from 'react';
import { ImBook, ImMug } from 'react-icons/im';
import { BsCartPlusFill, BsBoxArrowRight } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';
import { Link } from 'react-router-dom';

export default function NavBarSecondary({ title }) {
  const [selectedIcon, setSelectedIcon] = useState(title);


  const icons = [
    { Component: ImBook, title: "Menú", path: "/menu" },
    { Component: ImMug, title: "Crear Bubble", path: "/bubble" },
    { Component: BsCartPlusFill, title: "Carrito", path: "/car" },
    { Component: BsBoxArrowRight, title: "Iniciar Sesión", path: "/" },
  ];

  const handleIconClick = (iconTitle) => {
    setSelectedIcon(iconTitle);
  };

  return (
    <div className="flex justify-center items-center overflow-x-auto bg-white p-2 w-full space-x-4 md:space-x-8">
      <div className="flex justify-center items-center space-x-4 md:space-x-8">
        {icons.map(({ Component, title, path }, index) => (
          <Tooltip title={title} key={index}>
            <Link to={path}>
              <div
                className="flex-shrink-0 flex flex-col items-center rounded-lg p-2 md:p-4 hover:bg-gray-300 cursor-pointer transition-colors duration-200"
                onClick={() => handleIconClick(title)}
              >
                <Component
                  className={`text-2xl md:text-4xl ${selectedIcon === title ? 'text-blue-400' : 'text-gray-800'
                    }`}
                />
                {selectedIcon === title && (
                  <div className="w-full border-b-4 border-blue-400 mt-2 -mb-4"></div>
                )}
              </div>
            </Link>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
