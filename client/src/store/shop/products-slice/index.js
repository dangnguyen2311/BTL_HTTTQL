import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    productList: [],
    recommendedProducts: [],
    productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams }) => {
        console.log("fetchAllFilteredProducts called:", { filterParams, sortParams });

        const query = new URLSearchParams({
            ...filterParams,
            sortBy: sortParams,
        });

        const result = await axios.get(
            `http://localhost:5000/api/shop/products/get?${query}`
        );

        console.log("fetchAllFilteredProducts result:", result.data);

        return result?.data;
    }
);

export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails",
    async (id) => {
        const result = await axios.get(
            `http://localhost:5000/api/shop/products/get/${id}`
        );

        return result?.data;
    }
);

export const fetchRecommendedProductsCollaborativeFiltering = createAsyncThunk(
    "/products/fetchRecommendedProductsCollaborativeFiltering",
    async (userId) => {
        try {
            console.log("Fetching recommended products for userId:", userId);
            const response = await axios.get(
                `http://localhost:5001/recommend?userId=${userId}`
            );

            console.log("Full API Response:", response);
            console.log("API Response data:", response.data);

            // Lấy data trực tiếp từ response.data nếu success
            if (response.data.success) {
                const recommendedData = response.data.data || response.data;
                console.log("Extracted recommended data:", recommendedData);
                return Array.isArray(recommendedData) ? recommendedData : [];
            } else {
                throw new Error("API returned no success or data");
            }
        } catch (error) {
            console.error("Error fetching recommended products:", error.response?.data || error.message);
            throw error;
        }
    }
);

export const fetchRecommendedProductsContentBase = createAsyncThunk(
    "/products/fetchRecommendedProductsContentBase",
    async (productId) => {
        try {
            console.log("Fetching recommended products for productId:", productId);
            const response = await axios.get(
                `http://localhost:5002/recommend?productId=${productId}`
            );

            console.log("Full API Response (Content-Based):", response);
            console.log("API Response data (Content-Based):", response.data);

            // Lấy data trực tiếp từ response.data nếu success
            if (response.data.success) {
                const recommendedData = response.data.data || response.data;
                console.log("Extracted recommended data (Content-Based):", recommendedData);
                return Array.isArray(recommendedData) ? recommendedData : [];
            } else {
                throw new Error("API returned no success or data");
            }
        } catch (error) {
            console.error("Error fetching recommended products (Content-Based):", error.response?.data || error.message);
            throw error;
        }
    }
);

const shoppingProductSlice = createSlice({
    name: "shoppingProducts",
    initialState,
    reducers: {
        setProductDetails: (state) => {
            state.productDetails = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFilteredProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload.data;
            })
            .addCase(fetchAllFilteredProducts.rejected, (state) => {
                state.isLoading = false;
                state.productList = [];
            })
            .addCase(fetchProductDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productDetails = action.payload.data;
            })
            .addCase(fetchProductDetails.rejected, (state) => {
                state.isLoading = false;
                state.productDetails = null;
            })
            .addCase(fetchRecommendedProductsCollaborativeFiltering.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRecommendedProductsCollaborativeFiltering.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recommendedProducts = action.payload || [];
                console.log("Updated recommendedProducts in state (Collaborative):", state.recommendedProducts);
            })
            .addCase(fetchRecommendedProductsCollaborativeFiltering.rejected, (state, action) => {
                state.isLoading = false;
                state.recommendedProducts = [];
                console.error("Failed to fetch recommended products (Collaborative):", action.error.message);
            })
            .addCase(fetchRecommendedProductsContentBase.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchRecommendedProductsContentBase.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recommendedProducts = action.payload || [];
                console.log("Updated recommendedProducts in state (Content-Based):", state.recommendedProducts);
            })
            .addCase(fetchRecommendedProductsContentBase.rejected, (state, action) => {
                state.isLoading = false;
                state.recommendedProducts = [];
                console.error("Failed to fetch recommended products (Content-Based):", action.error.message);
            });
    },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;