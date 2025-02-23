import { createApi } from "@reduxjs/toolkit/query/react";
import apiBaseQuery from "./axiosBaseQuery";

export const CAMPAIGN_API = "campaignApi";

export const campaignApi = createApi({
  reducerPath: CAMPAIGN_API,
  baseQuery: apiBaseQuery,
  tagTypes: ["campaign", "login"],
  endpoints: (builder) => ({
    getAllCampaign: builder.query({
      query: () => ({
        url: "donation_campaign/list",
      }),
      providesTags: ["campaign"],
    }),
    getCampaign: builder.query({
      query: (id) => ({
        url: `donation_campaign/get-by-id/${id}`,
      }),
      providesTags: ["campaign"],
    }),
    createCampaign: builder.mutation({
      query: (body) => ({
        url: "donation_campaign/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    createCampaignByUser: builder.mutation({
      query: (body) => ({
        url: "donation_campaign/user/create-campaign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    updateCampaignByUser: builder.mutation({
      query: (body) => ({
        url: "donation_campaign/user/update-campaign",
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    getUserCampaignById: builder.query({
      query: (id) => ({
        url: `donation_campaign/user/${id}`,
      }),
      providesTags: ["campaign"],
    }),
    getDonationCampaignsByUser: builder.query({
      query: () => ({
        url: "/donation_campaign/user/campaigns", // Assuming this endpoint gets all campaigns for the authenticated user
      }),
      providesTags: ["campaign"],
    }),
    updateCampaign: builder.mutation({
      query: (body) => ({
        url: "donation_campaign/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["campaign"],
    }),
    // New endpoint: Get campaigns by category, search, and pagination
    getCampaignsByCategory: builder.query({
      query: ({ category, search = "", page = 1, perPage = 10 }) => ({
        url: `/donation_campaign/campaigns/category/${category}`,
        params: { search, page, perPage }, // Passing search, pagination params
      }),
      providesTags: ["campaign"],
    }),
    sentOtp: builder.mutation({
      query: (body) => ({
        url: "/users/sendOtp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    loginUser: builder.mutation({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: "/users/update",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "/users/verifyOTP",
        method: "POST",
        body,
      }),
      invalidatesTags: ["login"],
    }),
    createEnquiry: builder.mutation({
      query: (body) => ({
        url: "/enquiry/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["enquiry"],
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "/users/get-user-profile",
      }),
    }),
    getSettings: builder.query({
      query: () => ({
        url: "/users/get-settings",
      }),
      providesTags: ["users"],
    }),
    getBannerImages: builder.query({
      query: () => ({
        url: "donation_campaign/banners/list",
      }),
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetBannerImagesQuery,
  useCreateCampaignByUserMutation,
  useGetDonationCampaignsByUserQuery,
  useUpdateCampaignByUserMutation,
  useLazyGetUserCampaignByIdQuery,
  useLazyGetUserProfileQuery,
  useGetAllCampaignQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useSentOtpMutation,
  useVerifyOtpMutation,
  useLazyGetCampaignQuery,
  useUpdateUserMutation,
  useCreateEnquiryMutation,
  useGetCampaignsByCategoryQuery,
  useLoginUserMutation  
} = campaignApi;
