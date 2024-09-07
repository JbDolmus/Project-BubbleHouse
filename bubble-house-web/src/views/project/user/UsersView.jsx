import React, { useEffect, useState } from 'react';
import { FaPlus } from "react-icons/fa6";
import NavBarPrincipal from '@/layouts/NavBarPrincipal';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '@/redux/thunks/userThunks';
import { ToastError } from '@/assets/js/toastify.js';
import FormUserView from './FormUserView';

export default function UsersView() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const { users, token, errorRedux } = useSelector(state => state.user);

  const loadUsers = () => {

    if (token) {
      dispatch(getUsers(token));
    }
  };

  useEffect(() => {
    loadUsers();  
  }, [dispatch, token]);

  useEffect(() => {
    if (errorRedux) {
      ToastError(errorRedux);
    }
  }, [errorRedux]);
  

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
      <div className="flex flex-col items-center min-h-screen p-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {users.count > 0 && users.results.map(user => (
            <div
              key={user.id}
              className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 cursor-pointer"
              onClick={() => showModal(user)}
            >
              <h2 className="text-xl font-semibold mb-2">{user.username}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
        <FormUserView
          isVisible={isModalVisible}
          onClose={handleCancel}
          refreshUsers={loadUsers}
          selectedUser={selectedUser}
        />
      </div>
    </>
  );
}
