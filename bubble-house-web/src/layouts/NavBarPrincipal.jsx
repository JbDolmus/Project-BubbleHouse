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
import { Link, useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import { SweetAlertQuestion } from '@/assets/js/sweetAlert.js';
import { closeSession, cleanAlert } from '@/redux/thunks/userThunks';
import { SweetAlertSuccess } from '@/assets/js/sweetAlert';

export default function NavBarPrincipal({ title }) {
  const [selectedIcon, setSelectedIcon] = useState(title);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const icons = [
    { Component: BsClipboard2PlusFill, title: "Pedidos", path: "/orders" },
    { Component: ImSpoonKnife, title: "Productos", path: "/products" },
    { Component: DiApple, title: "Ingredientes", path: "/ingredients" },
    { Component: BsFillFileRichtextFill, title: "Recetas", path: "/recipes" },
    { Component: BsPersonCircle, title: "Usuario", path: "/user" },
    {
      Component: BsPeopleFill,
      title: "Usuarios",
      path: "/users",
      disabled: user?.rolls_details[0].id !== 2
    },
    { Component: BsBoxArrowLeft, title: "Cerrar Sesión", path: "#" },
  ];

  const handleLogout = () => {
    SweetAlertQuestion(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      () => {
        dispatch(closeSession())
          .then(() => {
            cleanAlert();
            SweetAlertSuccess("Has cerrado sesión correctamente.");
            navigate("/");
          })
      }
    );
  };

  const handleIconClick = (iconTitle, path, disabled) => {
    if (disabled) return;
    if (iconTitle === 'Cerrar Sesión') {
      handleLogout();
    } else {
      setSelectedIcon(iconTitle);
    }
  };

  return (
    <div className="flex justify-center items-center overflow-x-auto bg-white p-2 w-full space-x-4 md:space-x-8 ">
      <div className="flex justify-center items-center space-x-4 md:space-x-8">
        {icons.map(({ Component, title, path, disabled }, index) => (
          <Tooltip title={title} key={index}>
            <Link to={disabled ? "#" : path}>
              <div
                className={`flex-shrink-0 flex flex-col items-center rounded-lg p-2 md:p-4 cursor-pointer transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}`}
                onClick={() => handleIconClick(title, path, disabled)}
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
