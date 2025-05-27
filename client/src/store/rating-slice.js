import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk để lấy thống kê đánh giá tổng quan
export const fetchRatingStats = createAsyncThunk(
    "rating/fetchStats",
    async ({ startDate, endDate } = {}, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);

            const response = await fetch(`http://localhost:5000/api/admin/ratings/stats?${queryParams.toString()}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error Response:', errorData);
                throw new Error(errorData || 'Failed to fetch rating stats');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk để lấy thống kê đánh giá của một sản phẩm cụ thể
export const fetchProductRatingStats = createAsyncThunk(
    "rating/fetchProductStats",
    async ({ productId, startDate, endDate }, { rejectWithValue }) => {
        try {
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append('startDate', startDate);
            if (endDate) queryParams.append('endDate', endDate);

            const response = await fetch(`http://localhost:5000/api/admin/ratings/stats/product/${productId}?${queryParams.toString()}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error Response:', errorData);
                throw new Error(errorData || 'Failed to fetch product rating stats');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk để lấy danh sách sản phẩm cho dropdown
export const fetchProductsList = createAsyncThunk(
    "rating/fetchProductsList",
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching products list from API...');
            const response = await fetch("http://localhost:5000/api/admin/ratings/products", {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error Response:', errorData);
                throw new Error(errorData || 'Failed to fetch products list');
            }

            const data = await response.json();
            console.log('Products list received from API:', data);
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
            return rejectWithValue(error.message);
        }
    }
);

const ratingSlice = createSlice({
    name: "rating",
    initialState: {
        overallStats: {
            distribution: [],
            topRated: [],
            recentReviews: []
        },
        productStats: null,
        productsList: [],
        loading: false,
        error: null
    },
    reducers: {
        clearProductStats: (state) => {
            state.productStats = null;
        }
    },
    extraReducers: (builder) => {
        // Xử lý fetchProductsList
        builder
            .addCase(fetchProductsList.pending, (state) => {
                state.loading = true;
                state.error = null;
                console.log('Fetching products list...');
            })
            .addCase(fetchProductsList.fulfilled, (state, action) => {
                state.loading = false;
                state.productsList = action.payload;
                console.log('Products list updated in Redux:', action.payload);
            })
            .addCase(fetchProductsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error('Products List Error:', action.payload);
            })

        // Xử lý fetchRatingStats
        builder
            .addCase(fetchRatingStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRatingStats.fulfilled, (state, action) => {
                state.loading = false;
                state.overallStats = action.payload;
            })
            .addCase(fetchRatingStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error('Rating Stats Error:', action.payload);
            })

            // Xử lý fetchProductRatingStats
            .addCase(fetchProductRatingStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductRatingStats.fulfilled, (state, action) => {
                state.loading = false;
                state.productStats = action.payload;
            })
            .addCase(fetchProductRatingStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error('Product Rating Stats Error:', action.payload);
            });
    }
});

export const { clearProductStats } = ratingSlice.actions;
export default ratingSlice.reducer; 