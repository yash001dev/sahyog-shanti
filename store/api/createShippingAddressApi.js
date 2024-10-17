import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const createShippingAddressApi = createApi({
  reducerPath: "shippingAddressApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["ShippingAddress"],
  endpoints: (builder) => ({
    getShippingAddresses: builder.query({
      query: () => `/createShippingAddress`,
      providesTags: ["ShippingAddress"],
    }),
    createShippingAddress: builder.mutation({
      query: (shippingAddress) => ({
        url: `/createShippingAddress`,
        method: "POST",
        body: shippingAddress,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    updateShippingAddress: builder.mutation({
      query: ({ id, shippingAddress }) => ({
        url: `/createShippingAddress`,
        method: "PUT",
        body: { id, shippingAddress },
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
    deleteShippingAddress: builder.mutation({
      query: (id) => ({
        url: `/createShippingAddress`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["ShippingAddress"],
    }),
  }),
});

export const {
  useGetShippingAddressesQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
} = createShippingAddressApi;
