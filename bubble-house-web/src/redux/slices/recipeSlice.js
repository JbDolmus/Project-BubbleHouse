import { createSlice } from "@reduxjs/toolkit";
import {
    getRecipes,
    getRecipe,
    addRecipe,
    editRecipe,
    deleteRecipe,
    cleanAlertRecipe
} from "../thunks/recipeThunks.js";

const recipeSlice = createSlice({
    name: "recipe",
    initialState: {
        recipe: null,
        recipes: [],
        message: "",
        loading: false,
        errorRedux: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Cargar recetas
        builder.addCase(getRecipes.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getRecipes.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.recipes = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar las recetas!";
            }
            state.loading = false;
        });
        builder.addCase(getRecipes.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar las recetas!";
        });

        //Obtener una receta
        builder.addCase(getRecipe.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getRecipe.fulfilled, (state, action) => {
            if (action.payload) {
                state.recipe = action.payload.categoria;
            } else {
                state.errorRedux = "Ocurrió un error al cargar la receta!";
            }
            state.loading = false;
        });
        builder.addCase(getRecipe.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar la receta!";
        });

        //Agregar receta
        builder.addCase(addRecipe.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(addRecipe.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Receta agregada con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al agregar la receta!";
            }
            state.loading = false;
        });
        builder.addCase(addRecipe.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al agregar la receta!";
        });

        // Editar receta
        builder.addCase(editRecipe.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editRecipe.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Receta actualizada con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al editar la receta!";
            }
            state.loading = false;
        });
        builder.addCase(editRecipe.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al editar la receta!";
        });

        // Eliminar receta
        builder.addCase(deleteRecipe.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(deleteRecipe.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.message = "Receta eliminada con éxito!";
                state.loading = false;
            } else {
                state.errorRedux = "Ocurrió un error al eliminar la receta!";
            }
            state.loading = false;
        });
        builder.addCase(deleteRecipe.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar la receta!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlertRecipe.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlertRecipe.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlertRecipe.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export default recipeSlice.reducer;
