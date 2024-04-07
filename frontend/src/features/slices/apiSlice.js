import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQuery =
  process.env.NODE_ENV === 'development'
    ? fetchBaseQuery({
        // baseUrl: 'https://proshop-mpna.onrender.com/',
        baseUrl: 'http://localhost:5000/',
      })
    : fetchBaseQuery({
        baseUrl: 'https://proshop-mpna.onrender.com/',
        // baseUrl: 'http://localhost:5000/',
      }); 
  



export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Products', 'User', 'Oders'],
  endpoints: (builder) => ({}),
});
