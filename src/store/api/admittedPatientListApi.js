// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { url } from "./config";
import { api } from './api';
export const admittedPatientListApi = api.injectEndpoints({
  // baseQuery: fetchBaseQuery({ baseUrl: url['dev'] }),
  reducerPath: "admittedPatientListApi",
  endpoints: (build) => ({
    getAdmitedPatientList: build.query({
      query: () => "/patient/admittedPatients", // test jason sarver
      // query: () => "/patient/getAllPatients",
    }),
    getAdmitedPatientMatrices: build.query({
      query: () => "patient/admittedPatientMatrices",
    }),
    getAvailableBeds: build.query({
      query: () => "bed/getAvailableBeds",
    }),
  }),
});

export const {
  useGetAdmitedPatientListQuery,
  useGetAdmitedPatientMatricesQuery,
  useGetAvailableBedsQuery,
} = admittedPatientListApi;
