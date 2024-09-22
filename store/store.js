// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { createUser } from "./api/createuser";
import {
  companyApi
} from "./api/companyApi";

const store = configureStore({
  reducer: {
    user: userReducer,
    [createUser.reducerPath]: createUser.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(createUser.middleware)
      .concat(companyApi.middleware),
});

export default store;
