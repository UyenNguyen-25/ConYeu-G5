import { apiSlice } from "@/redux/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";
const AUTH_URL = "/auth";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    sendLogout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),
    signup: builder.mutation({
      query: (initialUserData) => ({
        url: `${AUTH_URL}/signup`,
        method: "POST",
        body: {
          ...initialUserData,
        },
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/refresh`,
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: (initialUserData) => ({
        url: `${AUTH_URL}/forgot-password`,
        method: "PUT",
        body: {
          ...initialUserData
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSendLogoutMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useSignupMutation,
} = authApiSlice;
