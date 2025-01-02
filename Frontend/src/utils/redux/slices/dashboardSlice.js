import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboardId: null, // Store the selected dashboard ID
    },
    reducers: {
        setDashboardId: (state, action) => {
            state.dashboardId = action.payload; // Set the dashboard ID
        },
        clearDashboardId: (state) => {
            state.dashboardId = null; // Clear the dashboard ID
        },
    },
});

export const { setDashboardId, clearDashboardId } = dashboardSlice.actions;

export default dashboardSlice.reducer;
