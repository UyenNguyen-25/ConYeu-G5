/* eslint-disable no-unused-vars */
import { apiSlice } from "@/redux/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const ORDERS_URL = "/api/order";

const ordersAdapter = createEntityAdapter({});

const initialState = ordersAdapter.getInitialState();

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (arg) => ({
        url: `${ORDERS_URL}/get-all-order/?phoneNumber=${arg.user_phoneNumber}&status=${arg.status}&from=${arg.from}&to=${arg.to}`,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    updateOrderStatus: builder.mutation({
      query: (initialData) => ({
        url: `${ORDERS_URL}/update-order-status/${initialData.order_id}`,
        method: "PUT",
        body: {
          newStatus: initialData.statusUpdate,
        },
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    getOrderItem: builder.query({
      query: (arg) => ({
        url: `${ORDERS_URL}/get-order-detail/${arg.order_id}`,
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderItemQuery,
} = ordersApiSlice;
