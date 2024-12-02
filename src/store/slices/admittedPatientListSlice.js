import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admitedpatient: [],
};

export const admittedPatientListSlice = createSlice({
  name: 'admittedPatientList',
  initialState,
  reducers: {
    getAdmitedpatient: (state, action) => {
      state.admitedpatient = action.payload; 
    },
    getAdmitedPatientMatrices:(state, action) => {
      state.patient = action.payload;
    }
  },
});

export const { getAdmitedpatient , getAdmitedPatientMatrices } = admittedPatientListSlice.actions;
export default admittedPatientListSlice.reducer;
