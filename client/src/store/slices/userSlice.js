import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userList: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserList: (state, action) => {
            state.userList = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setUserList, setLoading, setError } = userSlice.actions;
export default userSlice.reducer; 