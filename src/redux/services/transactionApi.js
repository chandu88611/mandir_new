import { createApi } from "@reduxjs/toolkit/query/react";
import apiBaseQuery from "./axiosBaseQuery";

export const TRANSACTION_API = "transactionApi";

export const transactionApi = createApi({
  reducerPath: TRANSACTION_API,
  baseQuery: apiBaseQuery,
  tagTypes: ["transaction" , "donation"],
  endpoints: (builder) => ({

    createOrder: builder.mutation({
      query: (body) => ({
        url: "/transactions/order",
        method: "POST",
        body
      }),
      invalidatesTags: ["transaction"]
    }),

    verifyPayment: builder.mutation({
      query: (body) => ({
        url: "/transactions/verify",
        method: "POST",
        body
      }),
      invalidatesTags: ["transaction", "donation"]
    }),

    getDonationsByUser: builder.query({
      query: (userId) => ({
        url: `/transactions/donations/user/${userId}`
      }),
      providesTags: ["donation"],
    }),

    getDonationsByCampaign: builder.query({
      query: (campaignId) => ({
        url: `/transactions/donations/campaign/${campaignId}`,
      }),
      providesTags: ["donation"]
    }),

    getDonationsByTransactionId: builder.query({
      query: (paymentId) => ({
        url: `/transactions/donations/transaction/${paymentId}`,
      }),
      providesTags: ["donation"]
    })

  })
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useGetDonationsByUserQuery,
  useGetDonationsByCampaignQuery,
  useGetDonationsByTransactionIdQuery
} = transactionApi;
