import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const purchaseOrderApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    // getUsers: builder.query({
    //   query: () => "/users",
    // }),
    // createUser: builder.mutation({
    //   query: (newUser) => ({
    //     url: "/users",
    //     method: "POST",
    //     body: newUser,
    //   }),
    // }),
  }),
});

export const {} = purchaseOrderApi;
