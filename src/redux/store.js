import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice"
import { campaignApi } from "./services/campaignApi";
import { subCampaignApi } from "./services/subCampaignApi";
import { transactionApi } from "./services/transactionApi";

const setUpStore = () => {
  const store = configureStore({
    reducer: {
      [campaignApi.reducerPath]: campaignApi.reducer,
      [subCampaignApi.reducerPath]: subCampaignApi.reducer,
      [transactionApi.reducerPath]: transactionApi.reducer,

      //Frontend

      auth: authReducer,
      user:userReducer
    },
    middleware: (getDM) => [
      ...getDM(),
      campaignApi.middleware,
      subCampaignApi.middleware,
      transactionApi.middleware,
    ],
  });
  setupListeners(store.dispatch);
  return store;
};

export const store = setUpStore();
