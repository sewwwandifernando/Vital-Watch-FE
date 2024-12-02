import { api } from './api';

export const userListApi = api.injectEndpoints({
  // export const userListApi = createApi({
  //   baseQuery: fetchBaseQuery({ baseUrl: url['dev'] }),
  reducerPath: "userListApi",
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => "user/getallUsers", // Define your endpoint URL here
    }),
    deleteUser: build.mutation({
      query: (userId) => ({
        url: `user/deleteUser/${userId}`, // Update with your delete user API endpoint
        method: "DELETE",
      }),
    }),
    updateUser: build.mutation({
      query: ({ updatedData , id}) => ({
        url: `user/editUser/${id}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    getUserMatrices: build.query({
      query: () => "user/userMatrices",
    }),
    getUserbyid: build.query({
      query: (userid) => `/user/byID/${userid}`,
    }),
    getUserData: build.query({
      query: () => "user/getSignedUser",
    }),
    changePassword: build.mutation({
      query:( data ) => ({
        url:`user/changePassword`,
        method:"POST",
        body:data,
      })
    })
  }),

});

export const {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserMatricesQuery,
  useGetUserbyidQuery,
  useGetUserDataQuery,
  useChangePasswordMutation,
} = userListApi;
