import { createSlice } from "@reduxjs/toolkit";
import {
  getRolls,
  cleanAlertRoll
} from "../thunks/rolThunks.js";

const rolSlice = createSlice({
  name: "rol",
  initialState: {
    rolls: [],
    message: "",
    loading: false,
    errorRedux: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    
    // Get rolls
    builder.addCase(getRolls.pending, (state) => {
      state.loading = true;
      state.errorRedux = null;
    });
    builder.addCase(getRolls.fulfilled, (state, action) => {
      state.loading = false;
      state.rolls = action.payload.results;
      state.message = "Roles obtenidos exitosamente!";
    });
    builder.addCase(getRolls.rejected, (state) => {
      state.loading = false;
      state.errorRedux = "Ocurrió un error al obtener los roles!";
    });

    // Limpiar alertas
    builder.addCase(cleanAlertRoll.pending, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = null;
    });
    builder.addCase(cleanAlertRoll.fulfilled, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = "";
    });
    builder.addCase(cleanAlertRoll.rejected, (state) => {
      state.loading = false;
      state.errorRedux = null;
      state.message = "";
    });

  },
});

export default rolSlice.reducer;
