import { createSlice } from "@reduxjs/toolkit";
import {
    getSubcategories,
    getSubcategory,
    addSubcategory,
    editSubcategory,
    deleteSubcategory,
    cleanAlertSubcategory
} from "../thunks/subcategoryThunks.js";

const userSlice = createSlice({
    name: "subcategory",
    initialState: {
        subcategory: null,
        subcategories: [],
        message: "",
        loading: false,
        errorRedux: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Cargar subcategorías
        builder.addCase(getSubcategories.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getSubcategories.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.subcategories = action.payload;
            } else {
                state.errorRedux = "Ocurrió un error al cargar las subcategorías!";
            }
            state.loading = false;
        });
        builder.addCase(getSubcategories.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar las subcategorías!";
        });

        //Obtener una subcategoría
        builder.addCase(getSubcategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(getSubcategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.category = action.payload.categoria;
            } else {
                state.errorRedux = "Ocurrió un error al cargar la subcategoría!";
            }
            state.loading = false;
        });
        builder.addCase(getSubcategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al cargar la subcategoría!";
        });

        //Agregar subcategoría
        builder.addCase(addSubcategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(addSubcategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "Categoría agregada con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al agregar la subcategoría!";
            }
            state.loading = false;
        });
        builder.addCase(addSubcategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al agregar la subcategoría!";
        });

        // Editar subcategoría
        builder.addCase(editSubcategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(editSubcategory.fulfilled, (state, action) => {
            if (action.payload) {
                state.loading = false;
                state.message = "subcategoría actualizada con éxito!";
            } else {
                state.errorRedux = "Ocurrió un error al editar la subcategoría!";
            }
            state.loading = false;
        });
        builder.addCase(editSubcategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al editar la subcategoría!";
        });

        // Eliminar subcategoría
        builder.addCase(deleteSubcategory.pending, (state) => {
            state.loading = true;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(deleteSubcategory.fulfilled, (state, action) => {
            if (action.payload.success) {
                state.message = "Subcategoría eliminada con éxito!";
                state.loading = false;
            } else {
                state.errorRedux = "Ocurrió un error al eliminar la subcategoría!";
            }
            state.loading = false;
        });
        builder.addCase(deleteSubcategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = "Ocurrió un error al eliminar la subcategoría!";
        });

        // Limpiar alertas
        builder.addCase(cleanAlertSubcategory.pending, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = null;
        });
        builder.addCase(cleanAlertSubcategory.fulfilled, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });
        builder.addCase(cleanAlertSubcategory.rejected, (state) => {
            state.loading = false;
            state.errorRedux = null;
            state.message = "";
        });

    },
});

export default userSlice.reducer;
