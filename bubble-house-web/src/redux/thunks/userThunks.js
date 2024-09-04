import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Login
export const loginUser = createAsyncThunk("user/loginUser", async (data) => {
  const response = await fetch(`${urlBase}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const jsonResponse = await response.json();
  return jsonResponse;
});

export const closeSession = createAsyncThunk(
  "user/closeSession",
  () => {
    return {};
  }
);

export const createUser = createAsyncThunk("user/createUser", async (data) => {
  console.log("Data: ", data);
  const response = await fetch(`${urlBase}/registrarUsuario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
});

export const recoveryPassword = createAsyncThunk(
  "user/recoveryPassword",
  async (data) => {
    const response = await fetch(`${urlBase}/recuperarCuenta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }
);

export const renewPassword = createAsyncThunk("user/renewPassword", async (data) => {
  const response = await fetch(`${urlBase}/renovarPassword`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      password: data.usuario.nuevoPassword,
      confirmarPassword: data.usuario.confirmarPassword,
      sesion: { ...data.sesion },
    }),
  });

  return response.json();
});

// Refresh token
export const refreshToken = createAsyncThunk("user/refreshToken", async (data) => {
  console.log(data);
  const response = await fetch(`${urlBase}/auth/token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data}`,
    },
  });

  return response.json();
});

export const activateUser = createAsyncThunk("user/activateUser", async (data) => {
  console.log(data);
  const response = await fetch(`${urlBase}/activarUsuario`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data}`,
    },
  });

  return response.json();
});

// Add user
export const addUser = createAsyncThunk("user/addUser", async (data) => {
  const response = await fetch(`${urlBase}/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify(data.user),
  });

  return response.json();
});

// Get users
export const getUsers = createAsyncThunk("user/getUsers", async (token) => {
  const response = await fetch(`${urlBase}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
});

// Get an user
export const getUser = createAsyncThunk("user/getUser", async (data) => {
  const response = await fetch(`${urlBase}/user/${data.id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
  });

  return response.json();
});

// Edit user
export const editUser = createAsyncThunk("user/editUser", async (data) => {
  const response = await fetch(`${urlBase}/user/${data.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      usuario: { ...data.usuario },
    }),
  });

  return response.json();
});

// Change password
export const changePassword = createAsyncThunk("user/changePassword", async (data) => {
  const response = await fetch(`${urlBase}/cambiarPassword/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify({
      anteriorPassword: data.usuario.anteriorPassword,
      nuevoPassword: data.usuario.nuevoPassword,
      confirmarPassword: data.usuario.confirmarPassword,
      sesion: { ...data.sesion },
    }),
  });

  return response.json();
});

// Delete user
export const deleteUser = createAsyncThunk("user/deleteUser", async (data) => {
  const response = await fetch(`${urlBase}/user/${data.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data}`,
    },
  });

  return response.json();
});

export const getSessionUser = createAsyncThunk("user/getSessionUser", () => {
  const storedLoggedIn = sessionStorage.getItem("user");

  let userSession = null;
  let token = null;

  if (storedLoggedIn) {
    userSession = JSON.parse(storedLoggedIn);
    token = JSON.parse(sessionStorage.getItem("token"));
  }

  return { userSession, token };
});

export const cleanAlert = createAsyncThunk("user/cleanAlert", () => {
  return {};
});
