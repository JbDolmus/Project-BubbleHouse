import { createSlice } from "@reduxjs/toolkit";
import {
    getCategories,
    getCategory,
    addCategory,
    editCategory,
    deleteCategory,
    cleanAlertCategory
} from "../thunks/categoryThunks.js";

const userSlice = createSlice({
    name: "category",
    initialState: {
        category: null,
        categories: [],
        message: "",
        loading: false,
        errorRedux: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Cargar categorías
        builder.addCase(getCategories.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.categories = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar las categorías!";
            }
            state.loading = false;
        });
        builder.addCase(getCategories.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar las categorías!";
        });

        //Obtener una categoría
        builder.addCase(getCategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getCategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.category = action.payload.categoria;
            } else {
                state.errorRedux = "Ocurrió un error al cargar la categoría!";
            }
            state.loading = false;
        });
        builder.addCase(getCategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar la categoría!";
        });

        //Agregar categoría
        builder.addCase(addCategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(addCategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Categoría agregada con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al agregar la categoría!";
            }
            state.loading = false;
        });
        builder.addCase(addCategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al agregar la categoría!";
        });

        // Editar categoría
        builder.addCase(editCategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editCategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Categoría actualizada con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al editar la categoría!";
            }
            state.loading = false;
        });
        builder.addCase(editCategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al editar la categoría!";
        });

        // Eliminar categoría
        builder.addCase(deleteCategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(deleteCategory.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.message = "Categoría eliminada con éxito!";
                state.loading = false;
            } else {
                state.errorRedux = "Ocurrió un error al eliminar la categoría!";
            }
            state.loading = false;
        });
        builder.addCase(deleteCategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar la categoría!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlertCategory.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlertCategory.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlertCategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export default userSlice.reducer;
