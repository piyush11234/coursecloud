import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./authSlice";
import courseReducer from './courseSlice'
import lectureReducer from './lectureSlice'
const persistConfig = {
  key: "auth",   // 👈 store only `auth` slice with key "auth"
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  // 👈 must be persistedAuthReducer here
    course:courseReducer,
    lecture:lectureReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
