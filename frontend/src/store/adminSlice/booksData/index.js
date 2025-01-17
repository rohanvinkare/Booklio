import { createSlice } from "@reduxjs/toolkit";

const adminBooksSlice = createSlice({
    name: "adminBooksData",
    initialState: {
        value: [],
    },
    reducers: {
        booksData: (state, action) => {
            console.log("Action payload: ", action.payload);
            state.value = action.payload || []; // Properly update "value"
        }
    },
});

export const { booksData } = adminBooksSlice.actions;
export default adminBooksSlice.reducer;
