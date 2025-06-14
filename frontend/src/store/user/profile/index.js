import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name: "userProfile",
    initialState: {
        profile: null,
    },
    reducers: {
        profileData: (state, action) => {
            state.profile = action.payload;
        },
        clearProfileData: (state) => {
            state.profile = null;
        },
    },
});

export const { profileData, clearProfileData } = profileSlice.actions;
export default profileSlice.reducer;
