import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { url } from "./config";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: url['dev'] }),
  
  reducerPath: "authApi",
  endpoints: (build) => ({

    loginUser: build.mutation({
      query: (credentials) => {
        // console.log('login using ', credentials);
        return {
          url: "user/login",
          method: "POST",
          body: credentials, // This should include the username and password
        }
      },
    }),
  }),
});

export const { useLoginUserMutation } = authApi;
