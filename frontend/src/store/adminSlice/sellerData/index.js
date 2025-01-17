import { createSlice } from "@reduxjs/toolkit";

const adminSellersSlice = createSlice({
  name: "adminSellersData",
  initialState: {
    value: [], 
  },
  reducers: {
    sellersData: (state,action) => {
      state.value = action.payload || []; // Properly update "value"
    },
   
  },
});

export const { sellersData } = adminSellersSlice.actions;
export default adminSellersSlice.reducer;
