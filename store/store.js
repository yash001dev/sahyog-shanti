// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { createUser } from "./api/createuser";

const store = configureStore({
  reducer: {
    user: userReducer,
    [createUser.reducerPath]: createUser.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(createUser.middleware),
});

export default store;
