// patientRegSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  PatientregistrationStatus: "idle", // Possible values: "idle", "loading", "succeeded", "failed"
  error: null,
};

export const patientRegSlice = createSlice({
  name: "PatientReg",
  initialState,
  reducers: {
     PatientregistrationPending: (state) => {
      state.PatientregistrationStatus = "loading";
      state.error = null;
    },
     PatientregistrationSuccess: (state) => {
      state.PatientregistrationStatus = "succeeded";
    },
     PatientregistrationFailed: (state, action) => {
      state.PatientregistrationStatus = "failed";
      state.error = action.payload;
    },
    resetPatientregistrationStatus: (state) => {
      state.PatientregistrationStatus = "idle";
      state.error = null;
    },
  },
});

export const {
   PatientregistrationPending,
   PatientregistrationSuccess,
   PatientregistrationFailed,
  resetPatientregistrationStatus,
} = patientRegSlice.actions;

export default patientRegSlice.reducer;
