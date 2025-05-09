import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading: false,
    comboList: [],
    comboDetails: null,
};

export const addNewCombo = createAsyncThunk(
    "/combo/addNewCombo",
    async (formData) => {
        const result = await axios.post(
            "http://localhost:5000/api/admin/combo/add",
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result?.data;
    }
);

export const fetchAllCombos = createAsyncThunk(
    "/combo/fetchAllCombos",
    async () => {
        const result = await axios.get(
            "http://localhost:5000/api/admin/combo/get"
        );

        return result?.data;
    }
);

export const fetchComboDetails = createAsyncThunk(
    "/combo/fetchComboDetails",
    async (id) => {
        const result = await axios.get(
            `http://localhost:5000/api/admin/combo/get/${id}`
        );

        return result?.data;
    }
);

export const editCombo = createAsyncThunk(
    "/combo/editCombo",
    async ({ id, formData }) => {
        const result = await axios.put(
            `http://localhost:5000/api/admin/combo/edit/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return result?.data;
    }
);

export const deleteCombo = createAsyncThunk(
    "/combo/deleteCombo",
    async (id) => {
        const result = await axios.delete(
            `http://localhost:5000/api/admin/combo/delete/${id}`
        );

        return result?.data;
    }
);

const AdminComboSlice = createSlice({
    name: "adminCombo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCombos.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCombos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comboList = action.payload.data;
            })
            .addCase(fetchAllCombos.rejected, (state) => {
                state.isLoading = false;
                state.comboList = [];
            })
            .addCase(fetchComboDetails.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchComboDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.comboDetails = action.payload.data;
            })
            .addCase(fetchComboDetails.rejected, (state) => {
                state.isLoading = false;
                state.comboDetails = null;
            });
    },
});

export default AdminComboSlice.reducer; 