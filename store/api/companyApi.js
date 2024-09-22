import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["getCompany"],
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: () => "/company",
      providesTags: ["getCompany"],
    }),
    createCompany: builder.mutation({
      query: (newUser) => ({
        url: "/company",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["getCompany"],
    }),
  }),
});

export const { useGetCompanyQuery, useCreateCompanyMutation } = companyApi;
