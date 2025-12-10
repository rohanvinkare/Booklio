import { createSlice } from "@reduxjs/toolkit";
import { usersData } from "@/store/adminSlice/usersData"; // ensure this exists
import {  managementsData} from "@/store/adminSlice/managementData"; // ensure this exists

import axios from "axios";

const sellerDataSlice = createSlice({
  name: "adminSellersData",
  initialState: {
    value: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  },
  reducers: {
    setSellersData: (state, action) => {
      state.value = action.payload;
      state.status = "succeeded";
    },
    setSellersLoading: (state) => {
      state.status = "loading";
    },
    setSellersFailed: (state) => {
      state.status = "failed";
    },
    setSellersIdle: (state) => {
      state.status = "idle";
    },
  },
});

// Actions
export const {
  setSellersData,
  setSellersLoading,
  setSellersFailed,
  setSellersIdle,
} = sellerDataSlice.actions;

// Thunk
export const fetchSellersData = () => async (dispatch) => {
  dispatch(setSellersLoading());
  try {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-batch-data`);
    const data = res.data;

    if (data) {
      if (data.users) dispatch(usersData(data.users));
      if (data.sellers) dispatch(setSellersData(data.sellers));
      if (data.management) dispatch(managementsData(data.management));
    }
  } catch (error) {
    console.error("Error fetching sellers:", error);
    dispatch(setSellersFailed());
  }
};

export default sellerDataSlice.reducer;

