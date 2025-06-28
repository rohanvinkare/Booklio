import { createSlice } from "@reduxjs/toolkit";

const adminUsersSlice = createSlice({
    name: "adminUsersData",
    initialState: {
        value: [],
    },
    reducers: {
        usersData: (state, action) => {
            // console.log("Action payload: ", action.payload);
            state.value = action.payload || [];
        }
    },
});

export const { usersData } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;