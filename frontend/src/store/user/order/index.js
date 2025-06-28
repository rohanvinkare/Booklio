import { createSlice } from "@reduxjs/toolkit";

const OrderSlice = createSlice({
  name: "orderData",
  initialState: {
    value: [],
  },
  reducers: {
    orderData: (state, action) => {
      // console.log("Action payload: ", action.payload);
      state.value = action.payload || [];
    },
    clearOrderData: (state) => {
      // console.log("Clearing order data");
      state.value = [];
    },
  },
});

export const { orderData, clearOrderData } = OrderSlice.actions;
export default OrderSlice.reducer;
