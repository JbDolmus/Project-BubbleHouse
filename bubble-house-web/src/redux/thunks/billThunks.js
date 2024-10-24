import { createAsyncThunk } from "@reduxjs/toolkit";

const urlBase = "http://127.0.0.1:8000/api";

// Add bill
export const addBill = createAsyncThunk("bill/addBill", async (data) => {
    const response = await fetch(`${urlBase}/bill/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const jsonResponse = await response.json();
    return jsonResponse;
});

// Get all bills
export const getBills = createAsyncThunk("bill/getBills", async (token) => {
    const response = await fetch(`${urlBase}/bill/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
        },
    });

    return response.json();
});

// Get an bill
export const getBill = createAsyncThunk("bill/getBill", async (data) => {
    const response = await fetch(`${urlBase}/bill/${data.id}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
        },
    });

    return response.json();
});
// Get bill completed
export const getBillCompleted = createAsyncThunk("bill/getBillCompleted", async (token) => {
    const response = await fetch(`${urlBase}/bill/completed/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
});
// Get bill paid
export const getBillPaid = createAsyncThunk("bill/getBillPaid", async (token) => {
    const response = await fetch(`${urlBase}/bill/paid/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
});

// Edit bill
export const editBill = createAsyncThunk("bill/editBill", async (data) => {
    const response = await fetch(`${urlBase}/bill/${data.id}/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify({invoiceProducts: data.invoiceProducts}),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Edit bill completed
export const editBillCompleted = createAsyncThunk("bill/editBillCompleted", async (data) => {
    const response = await fetch(`${urlBase}/bill/${data.id}/mark-as-completed/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify(data.bill),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Edit bill paid
export const editBillPaid = createAsyncThunk("bill/editBillPaid", async (data) => {
    const response = await fetch(`${urlBase}/bill/${data.id}/mark-as-paid/`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
            Accept: "application/json",
        },
        body: JSON.stringify({isPaid: data.isPaid}),
    });
    const jsonResponse = await response.json();
    return jsonResponse;
});

// Delete bill
export const deleteBill = createAsyncThunk("bill/deleteBill", async (data) => {
    const response = await fetch(`${urlBase}/bill/${data.id}/`, {
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

export const cleanAlertBill = createAsyncThunk("bill/cleanAlertBill", () => {
    return {};
});