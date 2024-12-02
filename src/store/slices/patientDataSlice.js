// patientDataSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedPatient: null,
  addVitalSignsStatus: "idle",
  error: null,
  dischargedPatients: [],
};

export const patientDataSlice = createSlice({
  name: "patientData",
  initialState,
  reducers: {
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    addVitalSignsPending: (state) => {
      state.addVitalSignsStatus = "loading";
      state.error = null;
    },
    addVitalSignsSuccess: (state) => {
      state.addVitalSignsStatus = "succeeded";
    },
    addVitalSignsFailed: (state, action) => {
      state.addVitalSignsStatus = "failed";
      state.error = action.payload;
    },
    resetaddVitalSignsStatus: (state) => {
      state.addVitalSignsStatus = "idle";
      state.error = null;
    },
    setPatientData: (state, action) => {
      state.selectedPatient = action.payload;
    },
    dishchargePatient:(state,action) => {
      state.dischargedPatients.push(action.payload);    }
  },
});

export const {
  setSelectedPatient,
  addVitalSignsPending,
  addVitalSignsFailed,
  addVitalSignsSuccess,
  resetaddVitalSignsStatus,
  setPatientData,
  dishchargePatient,
} = patientDataSlice.actions;

export default patientDataSlice.reducer;
