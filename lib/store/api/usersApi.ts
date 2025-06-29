import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<any[], void>({
      query: () => "/admin/users",
      providesTags: ["User"],
    }),
    updateUserPlan: builder.mutation<void, { userId: string; plan: string }>({
      query: ({ userId, plan }) => ({
        url: `/admin/users/${userId}/plan`,
        method: "PATCH",
        body: { plan },
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const { useGetAllUsersQuery, useUpdateUserPlanMutation } = usersApi
