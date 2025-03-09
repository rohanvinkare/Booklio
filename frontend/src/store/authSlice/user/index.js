import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
    name: "auth",
    initialState: {
        userDetails: null,
    },
    reducers: {
        addData: (state, action) => {
            state.userDetails = action.payload;
        },
    },
});

export const { addData } = AuthSlice.actions;
export default AuthSlice.reducer;
