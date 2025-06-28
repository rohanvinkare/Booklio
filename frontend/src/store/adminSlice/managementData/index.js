import { createSlice } from "@reduxjs/toolkit";

const adminManagementsSlice = createSlice({
  name: "adminManagementsData",
  initialState: {
    value: [], 
  },
  reducers: {
    managementsData: (state,action) => {
      // console.log("Action payload: ", action.payload);
      state.value = action.payload || []; // Properly update "value"
    },
   
  },
});

export const { managementsData } = adminManagementsSlice.actions;
export default adminManagementsSlice.reducer;
