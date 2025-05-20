import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User Management APIs
export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/admin/users`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/users`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await axios.put(`${API_URL}/admin/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Revenue Statistics API
export const getRevenueStatistics = async (startDate, endDate) => {
    try {
        const response = await axios.get(`${API_URL}/admin/revenue/statistics`, {
            params: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString()
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}; 