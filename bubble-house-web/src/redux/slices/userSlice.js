import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  refreshToken,
  editUser,
  deleteUser,
  closeSession,
  getSessionUser,
  cleanAlert,
  addUser,
  editUserwithoutPassword,
  getUsers,
  getUser,
  authMe,
} from "../thunks/userThunks.js";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    users: [],
    token: null,
    refresh: null,
    userSession: null,
    message: "",
    loading: false,
    errorRedux: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Logear usuario
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      const data = action.payload;
      if (data.access && data.refresh) {
        state.token = data.access;
        state.refresh = data.refresh;
        state.message = "Inicio de sesión exitoso!";
      } else {
        state.errorRedux = "Credenciales incorrectas";
      }
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al iniciar sesión.";
    });

    // Refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.token = action.payload.access;
        sessionStorage.setItem("token", JSON.stringify(action.payload.access));
      } else {
        closeSession();
      }
      state.loading = false;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al renovar el token!";
    });

    // Editar usuario
    builder.addCase(editUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      if (action.payload.email && action.payload.username) {
        state.loading = false;
        state.message = "Actualización exitosa";
      } else {
        state.errorRedux = action.payload.current_password || action.payload.detail;
      }
      state.loading = false;
    });
    builder.addCase(editUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al actualizar el usuario!";
    });

    // Eliminar usuario
    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      if (action.payload.success) {
        state.message = "Usuario eliminado exitosamente!";
        state.loading = false;
      } else {
        state.errorRedux = "Ocurrió un error al eliminar el usuario!";
      }
      state.loading = false;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al eliminar el usuario!";
    });

    // Obtener sesión usuario
    builder.addCase(getSessionUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(getSessionUser.fulfilled, (state, action) => {
      if (action.payload.userSession) {
        state.userSession = action.payload.userSession;
        state.token = action.payload.token;
      }
      state.loading = false;
    });
    builder.addCase(getSessionUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al recargar sesión de usuario";
    });

    // Cerrar sesión
    builder.addCase(closeSession.pending, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(closeSession.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.users = [];
      state.userSession = null;
      state.message = "";
      state.loading = false;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    });
    builder.addCase(closeSession.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al cerrar sesión";
    });

    // Limpiar alertas
    builder.addCase(cleanAlert.pending, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = null;
    });
    builder.addCase(cleanAlert.fulfilled, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(cleanAlert.rejected, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = "";
    });

    // Agregar usuario
    builder.addCase(addUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
    });
    builder.addCase(addUser.fulfilled, (state, action) => {
      if (action.payload.state === true) {
        state.loading = false;
        state.message = "Usuario agregado con éxito!";
      } else {
        state.loading = false;
        state.errorRedux = "Ocurrio un error al agregar el usuario!";
      }

    });
    builder.addCase(addUser.rejected, (state) => {

      state.loading = false;
      state.errorRedux = "Ocurrió un error al agregar el usuario!";
    });

    // Editar usuario por put
    builder.addCase(editUserwithoutPassword.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
    });
    builder.addCase(editUserwithoutPassword.fulfilled, (state, action) => {

      if(action.payload.email && action.payload.username) {
        state.loading = false;
      state.message = "Usuario actualizado con éxito!";
      } else {
        state.loading = false;
        state.errorRedux = "Ocurrio un error al actualizar el usuario!";
      }
    });
    builder.addCase(editUserwithoutPassword.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al actualizar el usuario!";
    });

    // Obtener usuarios
    builder.addCase(getUsers.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      if (action.payload.results) {
        state.loading = false;
        state.users = action.payload.results;
        state.message = "";
      } else {
        state.loading = false;
        state.users = [];
        state.errorRedux = "Ocurrió un error al obtener los usuarios!";
      }

    });
    builder.addCase(getUsers.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al obtener los usuarios!";
    });

    // Obtener un usuario
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.userSession = action.payload;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al obtener el usuario!";
    });

    // Autenticación
    builder.addCase(authMe.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
    });
    builder.addCase(authMe.fulfilled, (state, action) => {
      if (action.payload.state) {
        state.loading = false;
        state.user = action.payload.data;
      } else {
        state.loading = false;
        state.errorRedux = action.payload.message;
      }

    });
    builder.addCase(authMe.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al autenticar el usuario!";
    });
  },
});

export default userSlice.reducer;
