import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://proshop-mpna.onrender.com/',
  // baseUrl: 'http://localhost:5000/',
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Products', 'User'],
  endpoints: (builder) => ({}),
});
