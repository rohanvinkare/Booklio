import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch seller books
export const fetchSellerBooks = createAsyncThunk(
  "seller/fetchSellerBooks",
  async (sellerId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/book/api/v1/books-by-seller/${sellerId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch seller orders
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
        return response.data.data[0].orders; // Store only orders
      } else {
        return rejectWithValue("No Orders Available");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching orders");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    sellerBookData: null,
    sellerOrders: [],
    mostOrderedBook: null,
    loading: false,
    error: null,
  },
  reducers: {},
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

        // Compute most ordered book
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

        // Find details of the most ordered book
        if (maxIsbn) {
          state.mostOrderedBook = action.payload.find((order) => order.isbn === maxIsbn);
        }
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default sellerSlice.reducer;
