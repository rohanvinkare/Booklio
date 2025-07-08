// // store/adminSlice/booksData.js
// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const booksDataSlice = createSlice({
//   name: "adminBooksData",
//   initialState: {
//     value: [],
//     status: "idle", // to track loading
//   },
//   reducers: {
//     booksData: (state, action) => {
//       state.value = action.payload;
//       state.status = "succeeded";
//     },
//     setBooksLoading: (state) => {
//       state.status = "loading";
//     },
//     setBooksIdle: (state) => {
//       state.status = "idle";
//     },
//   },
// });

// // Export actions
// export const { booksData, setBooksLoading, setBooksIdle } = booksDataSlice.actions;

// // Thunk function
// export const fetchBooksData = () => async (dispatch) => {
//   dispatch(setBooksLoading());
//   try {
//     const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`);
//     dispatch(booksData(res.data));
//   } catch (error) {
//     console.error("Error fetching books:", error);
//     dispatch(setBooksIdle());
//   }
// };

// export default booksDataSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";

const booksDataSlice = createSlice({
  name: "adminBooksData",
  initialState: {
    value: [],
    status: "idle",
  },
  reducers: {
    booksData: (state, action) => {
      state.value = action.payload;
      state.status = "succeeded";
    },
    setBooksLoading: (state) => {
      state.status = "loading";
    },
    setBooksIdle: (state) => {
      state.status = "idle";
    },
    setBooksFailed: (state) => {
      state.status = "failed";
    },
  },
});

export const {
  booksData,
  setBooksLoading,
  setBooksIdle,
  setBooksFailed,
} = booksDataSlice.actions;

//  Updated thunk with your fetch logic
export const fetchBooksData = () => async (dispatch) => {
  dispatch(setBooksLoading());
  try {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`);
    const data = await res.json();

    if (data.success && data.bookData) {
      const allBooks = Object.values(data.bookData).flat();
      dispatch(booksData(allBooks));
    } else {
      dispatch(setBooksFailed());
      console.error("Invalid book data format received.");
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    dispatch(setBooksFailed());
  }
};

export default booksDataSlice.reducer;
