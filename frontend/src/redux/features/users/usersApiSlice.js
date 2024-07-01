/* eslint-disable no-unused-vars */
import { apiSlice } from "@/redux/api/apiSlice";
import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";

const USERS_URL = "/api/users";

const usersAdapter = createEntityAdapter({});

const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => USERS_URL,
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loaderUsers = responseData.map((user) => {
          user.user_id = user._id;
          return user;
        });
        return usersAdapter.setAll(initialState, loaderUsers);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "User", id: "LIST" },
            ...result.ids.map((id) => ({ type: "User", id })),
          ];
        } else return [{ type: "User", id: "LIST" }];
      },
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
    forgotPassword: builder.mutation({
      query: ({ user_phoneNumber, user_password }) => ({
        url: `${USERS_URL}/forgot-password`,
        method: "PUT",
        body: {
          user_phoneNumber,
          user_password,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "User", user_id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCheckPhoneExistedMutation,
  useForgotPasswordMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
  // Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
  (state) => selectUsersData(state) ?? initialState
);
