import { createSlice } from "@reduxjs/toolkit";
import {
    getIngredients,
    getIngredient,
    getIngredientCategories,
    addIngredient,
    editIngredient,
    deleteIngredient,
    cleanAlertIngredient
} from "../thunks/ingredientThunks.js";

const ingredientSlice = createSlice({
    name: "ingredient",
    initialState: {
        ingredient: null,
        ingredients: [],
        categories: [],
        message: "",
        loading: false,
        errorRedux: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Cargar ingredientes
        builder.addCase(getIngredients.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getIngredients.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.ingredients = action.payload.results;
            } else {
                state.errorRedux = "Ocurrió un error al cargar los ingredientes!";
            }
            state.loading = false;
        });
        builder.addCase(getIngredients.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar los ingredientes!";
        });

        // Cargar categorías de ingredientes
        builder.addCase(getIngredientCategories.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getIngredientCategories.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.categories = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar las categorías de ingredientes!";
            }
            state.loading = false;
        });
        builder.addCase(getIngredientCategories.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar las categorías de ingredientes!";
        });

        //Obtener un ingrediente
        builder.addCase(getIngredient.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getIngredient.fulfilled, (state, action) => {
            if (action.payload) {
                state.ingredient = action.payload.categoria;
            } else {
                state.errorRedux = "Ocurrió un error al cargar el ingrediente!";
            }
            state.loading = false;
        });
        builder.addCase(getIngredient.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar el ingrediente!";
        });

        //Agregar ingrediente
        builder.addCase(addIngredient.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(addIngredient.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Ingrediente agregado con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al agregar el ingrediente!";
            }
            state.loading = false;
        });
        builder.addCase(addIngredient.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al agregar el ingrediente!";
        });

        // Editar ingrediente
        builder.addCase(editIngredient.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editIngredient.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Ingrediente actualizado con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al editar el ingrediente!";
            }
            state.loading = false;
        });
        builder.addCase(editIngredient.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al editar el ingrediente!";
        });

        // Eliminar ingrediente
        builder.addCase(deleteIngredient.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(deleteIngredient.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.message = "Ingrediente eliminado con éxito!";
                state.loading = false;
            } else {
                state.errorRedux = "Ocurrió un error al eliminar el ingrediente!";
            }
            state.loading = false;
        });
        builder.addCase(deleteIngredient.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar el ingrediente!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlertIngredient.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlertIngredient.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlertIngredient.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export default ingredientSlice.reducer;
