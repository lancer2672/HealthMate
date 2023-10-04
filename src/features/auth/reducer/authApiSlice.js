import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from '../../../store/baseQuery';
import {current} from '@reduxjs/toolkit';
import {transformUserData} from '../../../utils/tranformData';
const authRoute = '/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    resetPassword: builder.mutation({
      query: data => ({
        url: `${authRoute}/reset-password`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response, meta, arg) => {
        return response.data;
      },
    }),
    changePassword: builder.mutation({
      query: data => ({
        url: `${authRoute}/change-password`,
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response, meta, arg) => {
        return response.data;
      },
    }),
    login: builder.mutation({
      query: authData => ({
        url: `${authRoute}/login`,
        method: 'POST',
        body: authData,
      }),
      transformResponse: (response, meta, arg) => {
        const transformedUser = transformUserData(response.data.user);
        return {...response.data, user: transformedUser};
      },
      transformErrorResponse: (response, meta, arg) => {
        response.data.message;
      },
    }),
  }),
});

export const {
  useResetPasswordMutation,
  useLoginMutation,
  useChangePasswordMutation,
} = authApi;
