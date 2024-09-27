import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["getCompany"],
  endpoints: (builder) => ({
    getCompany: builder.query({
      query: (company) => `/company`,
      providesTags: ["getCompany"],
    }),
    getParticularCompany: builder.query({
      query: (id) => `/company/${id}`,
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
    editCompany: builder.mutation({
      query: (company) => ({
        url: `/company`,
        method: "PUT",
        body: company,
      }),
      invalidatesTags: ["getCompany"],
    }),
    deleteCompany: builder.mutation({
      query: ({ id }) => ({
        url: `/company`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["getCompany"],
    }),
  }),
});

export const {
  useGetCompanyQuery,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useEditCompanyMutation,
} = companyApi;
