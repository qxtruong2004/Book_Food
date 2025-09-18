//nơi tập hợp tất cả dữ liệu

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import foodReducer from "./foodSlice";
import orderReducer from "./orderSlice";
import reviewReducer from "./reviewSlice";
import uiReducer from "./uiSlice";
import categoryReducer from "./categorySlice";
import authReducer from "./authSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        food: foodReducer,
        order: orderReducer,
        review: reviewReducer,
        ui: uiReducer,
        category: categoryReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // tắt cảnh báo khi dùng localStorage, Date...
    }),
})
// Infer type cho RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
