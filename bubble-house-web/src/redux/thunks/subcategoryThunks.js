import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Add subcategory
export const addSubcategory = createAsyncThunk("subcategory/addSubcategory", async (data) => {
    const response = await fetch(`${urlBase}/productsubcategory/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(data.subcategory),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
});

// Get subcategories
export const getSubcategories = createAsyncThunk("subcategory/getSubcategories", async (token) => {
    const response = await fetch(`${urlBase}/productsubcategory/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    return response.json();
});

// Get an subcategory
export const getsubCategory = createAsyncThunk("subcategory/getSubcategory", async (data) => {
    const response = await fetch(`${urlBase}/productsubcategory/${data.id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response.json();
});

// Edit subcategory PATCH
export const editSubcategory = createAsyncThunk("subcategory/editSubcategory", async (data) => {
    const response = await fetch(`${urlBase}/productsubcategory/${data.id}/`, {
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

// Edit subcategory PUT
export const editSubcategoryPut = createAsyncThunk("subcategory/editSubcategoryPut", async (data) => {
    const response = await fetch(`${urlBase}/productsubcategory/${data.id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.subcategory),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});


// Delete subcategory
export const deleteSubcategory = createAsyncThunk("subcategory/deleteSubcategory", async (data) => {
    const response = await fetch(`${urlBase}/productsubcategory/${data.id}/`, {
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

export const cleanAlert = createAsyncThunk("subcategory/cleanAlert", () => {
    return {};
  });