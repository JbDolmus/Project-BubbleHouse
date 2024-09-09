import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Get rolls
export const getRolls = createAsyncThunk("rol/getRolls", async (token) => {
    const response = await fetch(`${urlBase}/rol/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    return response.json();
});

export const cleanAlertRoll = createAsyncThunk("rol/cleanAlert", () => {
    return {};
});