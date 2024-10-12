import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        addToCart: (state, action) => {
            const existingProduct = state.products.find(
                (product) => product.id === action.payload.id
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.products.push({ ...action.payload, quantity: 1 });
            }
        },

        incrementQuantity: (state, action) => {
            const product = state.products.find(
                (product) => product.id === action.payload
            );
            if (product) {
                product.quantity += 1;
            }
        },

        decrementQuantity: (state, action) => {
            const product = state.products.find(
                (product) => product.id === action.payload
            );
            if (product && product.quantity > 1) {
                product.quantity -= 1;
            }
        },

        removeFromCart: (state, action) => {
            state.products = state.products.filter(
                (product) => product.id !== action.payload
            );
        },

        clearCart: (state) => {
            state.products = [];
        },
    },
});


export const { addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
