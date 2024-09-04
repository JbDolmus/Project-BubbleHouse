import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  createUser,
  recoveryPassword,
  renewPassword,
  refreshToken,
  activateUser,
  editUser,
  changePassword,
  deleteUser,
  closeSession,
  getSessionUser,
  cleanAlert,
} from "../thunks/userThunks.js";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
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
      if (action.payload) {
        const data = action.payload;
        console.log(data);
        state.token = data.access ? data.access : null;
        state.refresh = data.refresh ? data.refresh : null;
        state.user = data.user ? data.user : null;
        state.message = "Iniciando sesión.";
      } else {
        state.errorRedux = "Ocurrió un error al iniciar sesión.";
      }
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al iniciar sesión.";
    });

    // Crear usuario
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.message = "Registro exitoso!";
      } else {
        state.errorRedux = "Ocurrió un error en el registro!";
      }
      state.loading = false;
    });
    builder.addCase(createUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error en el registro!";
    });

    // Recuperar contraseña
    builder.addCase(recoveryPassword.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(recoveryPassword.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.message = "Te enviamos un correo para realizar la recuperación!";
      } else {
        state.errorRedux = "Ocurrió un error al recuperar cuenta!";
      }
      state.loading = false;
    });
    builder.addCase(recoveryPassword.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al recuperar cuenta!";
    });

    // Renovar contraseña
    builder.addCase(renewPassword.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(renewPassword.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.message = "Restableciendo contraseña con éxito!";
      } else {
        state.errorRedux = "Ocurrió un error al renovar la contraseña!";
      }
      state.loading = false;
    });
    builder.addCase(renewPassword.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al renovar la contraseña!";
    });

    // Activar cuenta
    builder.addCase(activateUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(activateUser.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.message = "Cuenta activada con éxito!";
      } else {
        state.errorRedux = "Ocurrió un error al activar cuenta!";
      }
      state.loading = false;
    });
    builder.addCase(activateUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al activar cuenta!";
    });

    // Refresh token
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.token = action.payload.token;
        sessionStorage.setItem("token", JSON.stringify(action.payload.token));
      } else {
        closeSession();
      }
      state.loading = false;
    });
    builder.addCase(refreshToken.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al renovar el token!";
    });

    // Cambiar contraseña
    builder.addCase(changePassword.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.message = "Cambio de contraseña exitoso!";
      } else {
        state.errorRedux = "Ocurrió un error al cambiar contraseña!";
      }
      state.loading = false;
    });
    builder.addCase(changePassword.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al cambiar contraseña";
    });

    // Editar usuario
    builder.addCase(editUser.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      if (action.payload.resultado) {
        state.message = "Actualización exitosa!";
        state.userSession = { ...action.payload.usuario };
        sessionStorage.setItem("user", JSON.stringify(action.payload.usuario));
      } else {
        state.errorRedux = "Ocurrió un error al actualizar el usuario!";
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
      if (action.payload.resultado) {
        state.message = "Eliminando cuenta!";
        state.userSession = null;
        state.token = null;
        state.message = "";
        state.loading = false;
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        state.errorRedux = "Ocurrió un error al eliminar la cuenta!";
      }
      state.loading = false;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al eliminar la cuenta!";
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
  },
});

export default userSlice.reducer;
