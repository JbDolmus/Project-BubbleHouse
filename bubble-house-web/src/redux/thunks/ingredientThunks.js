import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Add ingredient
export const addIngredient = createAsyncThunk("ingredient/addIngredient", async (data) => {
    const response = await fetch(`${urlBase}/ingredient/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data.ingredient),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
});

// Get ingredients
export const getIngredients = createAsyncThunk("ingredient/getIngredients", async () => {
    const response = await fetch(`${urlBase}/ingredient/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    return response.json();
});

// Get an ingredient
export const getIngredient = createAsyncThunk("ingredient/getIngredient", async (data) => {
    const response = await fetch(`${urlBase}/ingredient/${data.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response.json();
});

// Edit ingredient PATCH
export const editIngredient = createAsyncThunk("ingredient/editIngredient", async (data) => {
    const response = await fetch(`${urlBase}/ingredient/${data.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.ingredient),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Delete ingredient
export const deleteIngredient = createAsyncThunk("ingredient/deleteIngredient", async (data) => {
    const response = await fetch(`${urlBase}/ingredient/${data.id}/`, {
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

export const cleanAlertIngredient = createAsyncThunk("ingredient/cleanAlertIngredient", () => {
    return {};
  });