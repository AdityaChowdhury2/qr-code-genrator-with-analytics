import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { authApi } from "./api/authApi"
import { linksApi } from "./api/linksApi"
import { usersApi } from "./api/usersApi"
import authSlice from "./slices/authSlice"
import uiSlice from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
    [linksApi.reducerPath]: linksApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, linksApi.middleware, usersApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
