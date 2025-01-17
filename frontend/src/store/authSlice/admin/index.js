import { createSlice } from "@reduxjs/toolkit";

const AdminAuthSlice = createSlice({
    name: "adminAuth",
    initialState: {
        adminDetails: null,
    },
    reducers: {
        addAdminData: (state, action) => {
            state.adminDetails = action.payload;
        },
    },
});

export const { addAdminData } = AdminAuthSlice.actions;
export default AdminAuthSlice.reducer;