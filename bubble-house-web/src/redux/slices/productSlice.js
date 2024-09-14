import { createSlice } from "@reduxjs/toolkit";
import {
    getProducts,
    getProduct,
    addProduct,
    editProduct,
    deleteProduct,
    cleanAlertProduct
} from "../thunks/productThunks.js";

const productSlice = createSlice({
    name: "product",
    initialState: {
        product: null,
        products: [],
        message: "",
        loading: false,
        errorRedux: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Cargar productos
        builder.addCase(getProducts.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getProducts.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.products = action.payload.results;
            } else {
                state.errorRedux = "Ocurrió un error al cargar los productos!";
            }
            state.loading = false;
        });
        builder.addCase(getProducts.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar los productos!";
        });

        //Obtener un producto
        builder.addCase(getProduct.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getProduct.fulfilled, (state, action) => {
            if (action.payload) {
                state.product = action.payload.categoria;
            } else {
                state.errorRedux = "Ocurrió un error al cargar el producto!";
            }
            state.loading = false;
        });
        builder.addCase(getProduct.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar el producto!";
        });

        //Agregar producto
        builder.addCase(addProduct.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(addProduct.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Producto agregado con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al agregar el producto!";
            }
            state.loading = false;
        });
        builder.addCase(addProduct.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al agregar el producto!";
        });

        // Editar producto
        builder.addCase(editProduct.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editProduct.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Producto actualizado con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al editar el producto!";
            }
            state.loading = false;
        });
        builder.addCase(editProduct.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al editar el producto!";
        });

        // Eliminar producto
        builder.addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(deleteProduct.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.message = "Producto eliminado con éxito!";
                state.loading = false;
            } else {
                state.errorRedux = "Ocurrió un error al eliminar el producto!";
            }
            state.loading = false;
        });
        builder.addCase(deleteProduct.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar el producto!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlertProduct.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlertProduct.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlertProduct.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export default productSlice.reducer;
