import { createSlice } from "@reduxjs/toolkit";
import {
    getCategories,
    getCategory,
    addCategory,
    editCategory,
    deleteCategory,
    cleanAlert
} from "../thunks/categoryThunks.js";

const userSlice = createSlice({
    name: "category",
    initialState: {
        category: null,
        categories: [{id: 1, name:"Lacteos"}],
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
                state.categories = action.payload.categorias;
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
            if (action.payload) { // Categoría agregada
                state.categories = [...state.categories, action.payload.categoria];
                state.message = action.payload.message;
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
            if (action.payload) { // Categoría editada
                state.categories = state.categories.map((category) => {
                    if (category.id === action.payload.categoria.id) {
                        return action.payload.categoria;
                    }
                    return category;
                });
                state.message = action.payload.message;
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
            if (action.payload) { // Categoría eliminada correctamente
                state.categories = state.categories.filter((category) => category.id !== action.payload.id);
                state.message = action.payload.message;
            } else {    // Error al eliminar categoría o categoría no encontrada
                state.errorRedux = "Ocurrió un error al eliminar la categoría!";
            } 
            state.loading = false;
        });
        builder.addCase(deleteCategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar la categoría!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlert.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlert.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlert.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export default userSlice.reducer;
