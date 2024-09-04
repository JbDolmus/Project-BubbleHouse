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

// Close session
export const closeSession = createAsyncThunk(
  "user/closeSession",
  () => {
    return {};
  }
);

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

// Add user
export const addUser = createAsyncThunk("user/addUser", async (data) => {
  const response = await fetch(`${urlBase}/user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
    },
    body: JSON.stringify(data.user),
  });

  const jsonResponse = await response.json();
  return jsonResponse;
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

// Auth me
export const authMe = createAsyncThunk("auth/getAuthMe", async (token) => {
  const response = await fetch(`${urlBase}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
});

// Edit user PATCH
export const editUser = createAsyncThunk("user/editUser", async (data) => {
  const response = await fetch(`${urlBase}/user/${data.id}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(data.usuario),
  });
  const jsonResponse = await response.json();
  return jsonResponse;
});

// Edit user PUT
export const editUserPut = createAsyncThunk("user/editUserPut", async (data) => {
  console.log(data);
  const response = await fetch(`${urlBase}/user/${data.id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      Accept: "application/json",
    },
    body: JSON.stringify(data.user),
  });
  const jsonResponse = await response.json();
  console.log(jsonResponse);
  return jsonResponse;
});


// Delete user
export const deleteUser = createAsyncThunk("user/deleteUser", async (data) => {
  const response = await fetch(`${urlBase}/user/${data.id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.token}`,
      Accept: "application/json",
    },
  });

  const jsonResponse = await response.json();
  return jsonResponse;
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
