import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Add recipe
export const addRecipe = createAsyncThunk("recipe/addRecipe", async (data) => {
    const response = await fetch(`${urlBase}/recipe/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
});

// Get recipes
export const getRecipes = createAsyncThunk("recipe/getRecipes", async () => {
    const response = await fetch(`${urlBase}/recipe/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    return response.json();
});

// Get an recipe
export const getRecipe = createAsyncThunk("recipe/getRecipe", async (data) => {
    const response = await fetch(`${urlBase}/recipe/${data.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response.json();
});

// Edit recipe PATCH
export const editRecipe = createAsyncThunk("recipe/editRecipe", async (data) => {
    const response = await fetch(`${urlBase}/recipe/${data.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.recipe),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Delete recipe
export const deleteRecipe = createAsyncThunk("recipe/deleteRecipe", async (data) => {
    const response = await fetch(`${urlBase}/recipe/${data.id}/`, {
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

export const cleanAlertRecipe = createAsyncThunk("recipe/cleanAlertRecipe", () => {
    return {};
  });