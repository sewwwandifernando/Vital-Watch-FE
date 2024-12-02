import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  patient: [],
};

export const allpatientSlice = createSlice({
  name: 'patientList',
  initialState,
  reducers: {
    getAllPatient: (state, action) => {
      state.patient = action.payload; 
    },
    createPatient: (state, action) => {
      state.patient.push(action.payload);
    },
    deletePatient: (state, action) => {
      // Filter out the user with the specified ID
      state.patient = state.patient.filter((patient) => patient.id !== action.payload);
    },
    getAllPatientMatrices:(state, action) => {
      state.patient = action.payload;
    }
  },
});

export const { getAllPatient,createUser,deletePatient,getAllPatientMatrices } = allpatientSlice.actions;
export default allpatientSlice.reducer;
