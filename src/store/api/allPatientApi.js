// import { createApi } from "@reduxjs/toolkit/query/react";
import { api } from "./api";

export const allpatientApi = api.injectEndpoints({
  reducerPath: "patientRegistrationApi",
  endpoints: (build) => ({
    // Your endpoints
    getPatientList: build.query({
      query: () => "patient/getAllPatients",
    }),
    createPatient: build.mutation({
      query: (credentials) => ({
        url: "/patient/registerPatient",
        method: "POST",
        body: credentials,
      }),
    }),
    deletePatient: build.mutation({
      query: (hospitalId) => ({
        url: `patient/deletePatient/${hospitalId}`,
        method: "DELETE",
      }),
    }),
    getAllPatientMatrices: build.query({
      query: () => "patient/allPatientMatrices",
    }),
    updatePatient: build.mutation({
      query: ({ id, updatedData }) => ({
        url: `patient/updatePatient/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
  }),
});

export const {
  useGetPatientListQuery,
  useCreatePatientMutation,
  useDeletePatientMutation,
  useGetAllPatientMatricesQuery,
  useUpdatePatientMutation,
} = allpatientApi;
