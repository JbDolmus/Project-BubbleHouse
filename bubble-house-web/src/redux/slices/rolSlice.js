import { createSlice } from "@reduxjs/toolkit";
import {
  getRolls,
  cleanAlertRoll
} from "../thunks/rolThunks.js";

const rolSlice = createSlice({
  name: "rol",
  initialState: {
    rolls: [],
    messageRol: "",
    loading: false,
    errorRolRedux: null,
  },
  reducers: {},
  extraReducers: (builder) => {

    // Get rolls
    builder.addCase(getRolls.pending, (state) => {
      state.loading = true;
      state.errorRolRedux = null;
    });
    builder.addCase(getRolls.fulfilled, (state, action) => {
      if (action.payload.results) {
        state.loading = false;
        state.rolls = action.payload.results;
        state.messageRol = "Roles obtenidos exitosamente!";
      } else {
        state.errorRolRedux = "No se encontraron roles";
        state.loading = false;
      }
    });
    builder.addCase(getRolls.rejected, (state) => {
      state.loading = false;
      state.errorRolRedux = "Ocurrió un error al obtener los roles!";
    });

    // Limpiar alertas
    builder.addCase(cleanAlertRoll.pending, (state) => {
      state.loading = false;
      state.errorRolRedux = null;
      state.messageRol = null;
    });
    builder.addCase(cleanAlertRoll.fulfilled, (state) => {
      state.loading = false;
      state.errorRolRedux = null;
      state.messageRol = "";
    });
    builder.addCase(cleanAlertRoll.rejected, (state) => {
      state.loading = false;
      state.errorRolRedux = null;
      state.messageRol = "";
    });

  },
});

export default rolSlice.reducer;
