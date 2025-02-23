import { createApi } from "@reduxjs/toolkit/query/react";

import apiBaseQuery from "./axiosBaseQuery";

export const SUB_CAMPAIGN_API = "subCampaignApi";

export const subCampaignApi = createApi({
  reducerPath: SUB_CAMPAIGN_API,
  baseQuery: apiBaseQuery,
  tagTypes: ["subCampaign", "login"],
  endpoints: (builder) => ({
    getAllSubCampaign: builder.query({
      query: () => ({
        url: "subDonation/list",
      }),
      providesTags: ["subCampaign"],
    }),
    getSubCampaign: builder.query({
      query: (id) => ({
        url: `get-by-id/${id}`,
      }),
      providesTags: ["subCampaign"],
    }),
    createSubCampaign: builder.mutation({
      query: (body) => ({
        url: "subDonation/create",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["subCampaign", "campaign"],
    }),
    updateSubCampaign: builder.mutation({
      query: (body) => ({
        url: "subDonation/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["subCampaign"],
    }),
  }),
});

export const {
  // useGetAllSubCampaignQuery,
  // useGetSubCampaignQuery,
  // useCreateSubCampaignMutation,
  // useUpdateSubCampaignMutation,
} = subCampaignApi;
