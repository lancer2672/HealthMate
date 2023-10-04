import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from '../../../store/baseQuery';
import {current} from '@reduxjs/toolkit';

const userRoute = '/user';

const transformUserData = () => {};
export const userApi = createApi({
  reducerPath: 'userApi',
  tagTypes: ['User'],
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getUserById: builder.query({
      query: userId => `${userRoute}/${userId}`,
      transformResponse: (response, meta, arg) => {
        const transformedUser = transformUserData(response.data.user);
        return {...response.data, user: transformedUser};
      },
      providesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({newUserData}) => ({
        url: `${userRoute}/update`,
        method: 'PUT',
        body: newUserData,
        // headers: {
        //   "Content-Type": "multipart/form-data",
        // },
      }),
      transformResponse: (response, meta, arg) => {
        const transformedUser = transformUserData(response.data.user);
        return {...response.data, user: transformedUser};
      },
      invalidatesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: userData => ({
        url: `/api/auth/register`,
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response, meta, arg) => response.data,
      transformErrorResponse: (response, meta, arg) => response.data.message,
    }),
    saveFCMtoken: builder.mutation({
      query: token => ({
        url: `${userRoute}/save-token`,
        method: 'PUT',
        body: {token},
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useSaveFCMtokenMutation,
} = userApi;
