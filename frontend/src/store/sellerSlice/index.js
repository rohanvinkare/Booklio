import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch books by seller
export const fetchSellerBooks = createAsyncThunk(
  "seller/fetchSellerBooks",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/book/api/v1/books-by-seller/${sellerId}`
      );
      const data = await response.json();

      if (data.success) {
        return data; // data should have a "books" array
      } else {
        return rejectWithValue("Failed to fetch books.");
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Thunk to fetch seller orders
export const fetchSellerOrders = createAsyncThunk(
  "seller/fetchSellerOrders",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/order/seller-order-list/${sellerId}`
      );

      if (
        response.data.success &&
        Array.isArray(response.data.data[0]?.orders)
      ) {

        return response.data.data[0].orders;

      } else {
        return rejectWithValue("No orders available.");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching orders.");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    sellerBookData: null,     // { success: true, books: [...] }
    sellerOrders: [],
    mostOrderedBook: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSellerBookData: (state) => {
      state.sellerBookData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Seller Books
      .addCase(fetchSellerBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerBookData = action.payload;
      })
      .addCase(fetchSellerBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Seller Orders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerOrders = action.payload;

        // Determine most ordered book
        const isbnCount = {};
        let maxIsbn = null;
        let maxCount = 0;

        action.payload.forEach((order) => {
          const isbn = order.isbn;
          isbnCount[isbn] = (isbnCount[isbn] || 0) + 1;
          if (isbnCount[isbn] > maxCount) {
            maxCount = isbnCount[isbn];
            maxIsbn = isbn;
          }
        });

        if (maxIsbn) {
          state.mostOrderedBook = action.payload.find(
            (order) => order.isbn === maxIsbn
          );
        }
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSellerBookData } = sellerSlice.actions;
export default sellerSlice.reducer;

