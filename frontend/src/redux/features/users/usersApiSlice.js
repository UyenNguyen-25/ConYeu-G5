/* eslint-disable no-unused-vars */
import { apiSlice } from "@/redux/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const USERS_URL = "/api/user";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (arg) => ({
        url: `${USERS_URL}/?search=${arg.search}&role=${arg.role}`,
      }),
    }),
    getUser: builder.query({
      query: (arg) => ({
        url: `${USERS_URL}/get-user/?phoneNumber=${arg.user_phoneNumber}`,
      }),
    }),
    addNewUser: builder.mutation({
      query: (initialUserData) => ({
        url: USERS_URL,
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: (initialUserData) => ({
        url: USERS_URL,
        method: "PUT",
        body: {
          ...initialUserData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", user_id: arg.id },
      ],
      
    }),
    deleteUser: builder.mutation({
      query: ({ user_id }) => ({
        url: USERS_URL,
        method: "DELETE",
        body: { user_id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    checkPhoneExisted: builder.mutation({
      query: ({ user_phoneNumber }) => ({
        url: `${USERS_URL}/check-phone-existed`,
        method: "POST",
        body: { user_phoneNumber },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "User", id: arg.id }],
    }),
    changePassword: builder.mutation({
      query: ({ user_phoneNumber, oldPass, newPass }) => ({
        url: `${USERS_URL}/change-password`,
        method: "PUT",
        body: {
          user_phoneNumber,
          oldPass,
          newPass,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", user_id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCheckPhoneExistedMutation,
  useChangePasswordMutation,
} = usersApiSlice;
