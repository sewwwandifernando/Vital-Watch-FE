//UserRegApi
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { url } from "./config";
import { api } from './api';

export const userRegApi = api.injectEndpoints({
// export const userRegApi = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: url['dev'] }),
  
  endpoints: (build) => ({
    registerUser: build.mutation({
      query: (credentials) => ({
        url: "user/registerUser",
        method: "POST",
        body: credentials, // This should include the username and password
      }),
    }),
  }),
});

export const { useRegisterUserMutation } = userRegApi;
