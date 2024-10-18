import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get, update } from "lodash";

export const purchaseOrderApi = createApi({
  reducerPath: "purchaseOrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["purchaseOrder"],
  endpoints: (builder) => ({
    createPurchaseOrder: builder.mutation({
      query: (purchaseOrder) => ({
        url: "/purchaseOrder",
        method: "POST",
        body: purchaseOrder,
      }),
    }),
    getPurchaseOrder: builder.query({
      query: () => "/purchaseOrder",
      providesTags: ["purchaseOrder"],
    }),
    getParticularPurchaseOrder: builder.query({
      query: (id) => `/purchaseOrder/${id}`,
    }),
    deletePurchaseOrder: builder.mutation({
      query: ({ id }) => ({
        url: `/purchaseOrder`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["purchaseOrder"],
    }),
    getPurchaseOrderByStatus: builder.query({
      query: (status) => `/purchaseOrder?status=${status}`,
    }),
    updatePurchaseOrder: builder.mutation({
      query: (purchaseOrder) => ({
        url: `/purchaseOrder`,
        method: "PUT",
        body: purchaseOrder,
      }),
      invalidatesTags: ["purchaseOrder"],
    }),
    getPONumber: builder.query({
      query: () => "/get-purchaseOrder-number",
    }),
  }),
});

export const {
  useCreatePurchaseOrderMutation,
  useGetPurchaseOrderQuery,
  useGetParticularPurchaseOrderQuery,
  useDeletePurchaseOrderMutation,
  useGetPurchaseOrderByStatusQuery,
  useUpdatePurchaseOrderMutation,
  useGetPONumberQuery,
  useLazyGetPONumberQuery,
} = purchaseOrderApi;
