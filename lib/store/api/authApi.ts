import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/auth",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<any, { name: string; email: string; password: string }>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    createCheckoutSession: builder.mutation<{ url: string }, void>({
      query: () => ({
        url: "/stripe/checkout",
        method: "POST",
      }),
    }),
  }),
})

export const { useRegisterMutation, useCreateCheckoutSessionMutation } = authApi
