// patientUpdateSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "idle",
  error: null,
};

export const patientUpdateSlice = createSlice({
  name: "patientUpdate",
  initialState,
  reducers: {
    patientUpdatePending: (state) => {
      state.status = "loading";
      state.error = null;
    },
    patientUpdateSuccess: (state) => {
      state.status = "succeeded";
    },
    patientUpdateFailed: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    resetPatientUpdateStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  patientUpdatePending,
  patientUpdateSuccess,
  patientUpdateFailed,
  resetPatientUpdateStatus,
} = patientUpdateSlice.actions;

export default patientUpdateSlice.reducer;
