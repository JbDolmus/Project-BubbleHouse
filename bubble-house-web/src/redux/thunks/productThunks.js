import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Add product
export const addProduct = createAsyncThunk("product/addProduct", async (data) => {
    const response = await fetch(`${urlBase}/product/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data.product),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
});

// Get products
export const getProducts = createAsyncThunk("product/getProducts", async (token) => {
    const response = await fetch(`${urlBase}/product/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    return response.json();
});

// Get an product
export const getProduct = createAsyncThunk("product/getProduct", async (data) => {
    const response = await fetch(`${urlBase}/product/${data.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response.json();
});

// Edit product PATCH
export const editProduct = createAsyncThunk("product/editProduct", async (data) => {
    const response = await fetch(`${urlBase}/product/${data.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.product),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Edit product PUT
export const editProductPut = createAsyncThunk("product/editProductPut", async (data) => {
    const response = await fetch(`${urlBase}/product/${data.id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.product),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});


// Delete product
export const deleteProduct = createAsyncThunk("product/deleteProduct", async (data) => {
    const response = await fetch(`${urlBase}/product/${data.id}/`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
    });

    if (response.status === 204) {
        return { success: true };
    } else {

        return { success: false };
    }
});

export const cleanAlertProduct = createAsyncThunk("product/cleanAlertProduct", () => {
    return {};
  });