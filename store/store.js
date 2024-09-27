// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import loaderReducer from "./loaderSlice";
import { createUser } from "./api/createuser";
import { companyApi } from "./api/companyApi";
import { purchaseOrderApi } from "./api/purchaseOrderApi";

const store = configureStore({
  reducer: {
    user: userReducer,
    loader: loaderReducer,
    [createUser.reducerPath]: createUser.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [purchaseOrderApi.reducerPath]: purchaseOrderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(createUser.middleware)
      .concat(companyApi.middleware)
      .concat(purchaseOrderApi.middleware),
});

export default store;
