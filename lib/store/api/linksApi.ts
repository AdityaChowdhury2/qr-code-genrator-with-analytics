import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateLinkRequest,
  CreateLinkResponse,
  ScanStats,
} from "@/lib/types";

export const linksApi = createApi({
  reducerPath: "linksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  tagTypes: ["Link", "Stats"],
  endpoints: (builder) => ({
    createLink: builder.mutation<CreateLinkResponse, CreateLinkRequest>({
      query: (data) => ({
        url: "/links",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Link"],
    }),
    getUserLinks: builder.query<any[], void>({
      query: () => "/links/user",
      providesTags: ["Link"],
    }),
    getLinkStats: builder.query<ScanStats, string>({
      query: (id) => `/links/stats/${id}`,
      providesTags: (result, error, id) => [{ type: "Stats", id }],
    }),
    deleteLink: builder.mutation<void, string>({
      query: (id) => ({
        url: `/links/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Link"],
    }),
  }),
});

export const {
  useCreateLinkMutation,
  useGetUserLinksQuery,
  useGetLinkStatsQuery,
  useDeleteLinkMutation,
} = linksApi;
