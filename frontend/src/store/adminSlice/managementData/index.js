import { createSlice } from "@reduxjs/toolkit";
import { usersData } from "@/store/adminSlice/usersData"; // ensure this exists
import { setSellersData } from "@/store/adminSlice//sellerData"; // ensure this exists

// Slice for storing admin management data
const adminManagementsSlice = createSlice({
  name: "adminManagementsData",
  initialState: {
    value: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
  },
  reducers: {
    managementsData: (state, action) => {
      state.value = action.payload || [];
      state.status = "succeeded";
    },
    resetManagementData: (state) => {
      state.value = [];
      state.status = "idle";
    },
  },
});

// Actions
export const { managementsData, resetManagementData } = adminManagementsSlice.actions;

// Thunk to fetch all batch data including users, sellers, management
export const fetchBatchData = () => async (dispatch) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-batch-data`);
    const data = await res.json();

    if (data) {
      if (data.users) dispatch(usersData(data.users));
      if (data.sellers) dispatch(setSellersData(data.sellers));
      if (data.management) dispatch(managementsData(data.management));
    }
  } catch (error) {
    console.error("Error fetching batch data:", error);
  }
};

export default adminManagementsSlice.reducer;
