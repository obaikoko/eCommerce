import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://proshop-mpna.onrender.com/',
});


export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Products', 'User'],
  endpoints: (builder) => ({}),
});
