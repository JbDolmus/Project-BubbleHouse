import React, { useEffect, useState } from 'react';
import { FaPlus, FaSearch } from "react-icons/fa";
import NavBarPrincipal from '@/layouts/NavBarPrincipal';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, cleanAlert } from '@/redux/thunks/userThunks';
import { ToastError, ToastSuccess } from '@/assets/js/toastify.js';
import FormUserView from './FormUserView';
import { getRolls, cleanAlertRoll } from '@/redux/thunks/rolThunks';
import { removeAccents } from "@/utils/removeAccents";
import Spinner from '@/components/Spinner';

export default function UsersView() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const dispatch = useDispatch();
  const { user: currentUser, users, token, errorRedux, message, loading } = useSelector(state => state.user);
  const { rolls, messageRol } = useSelector(state => state.rol);

  const loadUsers = () => {

    if (token) {
      dispatch(getUsers(token));
      dispatch(getRolls(token));
    }

  };

  useEffect(() => {
    loadUsers();
  }, [dispatch, token]);

  useEffect(() => {

    if (message) {
      ToastSuccess(message);
      dispatch(cleanAlert());
    }

    if (messageRol === "Roles obtenidos exitosamente!") {
      dispatch(cleanAlertRoll());
    }

    if (errorRedux) {
      ToastError(errorRedux);
      dispatch(cleanAlert());
    }
  }, [errorRedux, message, messageRol]);

  useEffect(() => {
    if (users) {
      const filtered = users.filter(user =>
        removeAccents(user.username.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase())) ||
        removeAccents(user.email.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase())) ||
        user.rolls_details?.some(roll =>
          removeAccents(roll.name.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
        )
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const showModal = (user = null) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  return (
    <>
      <NavBarPrincipal title={"Usuarios"} />
      {loading ?
        <Spinner />
        :
        <div className="flex flex-col items-center min-h-screen min-w-full p-6">
          <h1 className="text-4xl font-bold text-white mb-6">Listado de Usuarios</h1>
          <div className="flex flex-col items-center gap-3 mb-4 md:flex-row md:justify-start w-full max-w-4xl">
            <button
              type='button'
              onClick={() => showModal()}
              className="flex flex-col items-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-32 py-4 md:px-6 md:py-2 md:flex-row rounded"
            >
              <FaPlus className="text-3xl md:text-xl md:mx-1" />
              Nuevo Usuario
            </button>
          </div>
          <div className="relative mb-6 w-full max-w-4xl">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 p-2 w-full border rounded-md"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full max-w-4xl">
            {filteredUsers && filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
               currentUser && (user.id !== currentUser.id) &&
                <div
                  key={user.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-2xl"
                  onClick={() => showModal(user)}
                >
                  <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  {user.rolls_details && user.rolls_details.map(roll => (
                    <div key={roll.id} className='flex flex-row gap-1'>
                      <span className='text-gray-950'>Rol:</span>
                      <p className="text-gray-600">{roll.name}</p>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="col-span-3 w-full text-center mt-10 p-6 max-w-lg mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg">
                <p className="text-white text-xl font-bold mb-2 animate-pulse">
                  No se encontraron usuarios que coincidan con tu búsqueda
                </p>
                <p className="text-lg text-gray-200">
                  Intenta con un término diferente o{' '}
                  <span
                    className="text-blue-300 underline font-semibold cursor-pointer transition-colors duration-200 hover:text-blue-400"
                    onClick={() => setSearchTerm('')}
                  >
                    borra el filtro
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      }
      <FormUserView
        isVisible={isModalVisible}
        onClose={handleCancel}
        refreshUsers={loadUsers}
        selectedUser={selectedUser}
        rolls={rolls}
      />
    </>
  );
}
