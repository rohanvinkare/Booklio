import { createSlice } from "@reduxjs/toolkit";

const BooksSlice = createSlice({
    name: "BooksData",
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

export const { booksData } = BooksSlice.actions;
export default BooksSlice.reducer;
