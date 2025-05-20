import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import userReducer from './slices/userSlice';
// ... other imports

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        // ... other reducers
    },
}); 