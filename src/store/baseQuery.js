import {fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {UrlApi} from '../utils/constant';
// import {logoutUser, setToken} from '../userSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: UrlApi,
  prepareHeaders: (headers, {getState}) => {
    const token = getState().authApi.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  //   if (result.error && result.error.status === 401) {
  //     const refreshResult = await baseQuery(
  //       {
  //         url: "/api/auth/refresh-token",
  //         method: "POST",
  //         body: { refreshToken: api.getState().user.refreshToken },
  //       },
  //       api
  //     );
  //     if (refreshResult.data) {
  //       api.dispatch(setToken({ token: refreshResult.data.accessToken }));

  //       // retry the initial query
  //       result = await baseQuery(args, api, extraOptions);
  //     } else {
  //       api.dispatch(logoutUser());
  //     }
  //   }
  return result;
};
