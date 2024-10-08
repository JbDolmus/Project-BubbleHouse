import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Add category
export const addCategory = createAsyncThunk("category/addCategory", async (data) => {
    const response = await fetch(`${urlBase}/productcategory/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data.category),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
});

// Get categories
export const getCategories = createAsyncThunk("category/getCategories", async () => {
    const response = await fetch(`${urlBase}/productcategory/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    return response.json();
});

// Get an category
export const getCategory = createAsyncThunk("category/getCategory", async (data) => {
    const response = await fetch(`${urlBase}/productcategory/${data.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response.json();
});

// Edit category PATCH
export const editCategory = createAsyncThunk("category/editCategory", async (data) => {
    const response = await fetch(`${urlBase}/productcategory/${data.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.category),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Edit category PUT
export const editCategoryPut = createAsyncThunk("category/editCategoryPut", async (data) => {
    const response = await fetch(`${urlBase}/productcategory/${data.id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.category),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});


// Delete category
export const deleteCategory = createAsyncThunk("category/deleteCategory", async (data) => {
    const response = await fetch(`${urlBase}/productcategory/${data.id}/`, {
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

export const cleanAlertCategory = createAsyncThunk("category/cleanAlertCategory", () => {
    return {};
  });