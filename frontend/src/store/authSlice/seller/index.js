import { createSlice } from "@reduxjs/toolkit";

const SellerAuthSlice = createSlice({
    name: "sellerAuth",
    initialState: {
        sellerDetails: null,
    },
    reducers: {
        addSellerData: (state, action) => {
            state.sellerDetails = action.payload;
        },
    },
});
export const { addSellerData } = SellerAuthSlice.actions;
export default SellerAuthSlice.reducer;