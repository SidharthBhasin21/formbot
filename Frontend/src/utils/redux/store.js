import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import themeReducer from './slices/themeSlice'
export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    theme: themeReducer,
  },
})