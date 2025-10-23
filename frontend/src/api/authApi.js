import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Signup API
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Something went wrong' };
  }
};

// Login API
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Something went wrong' };
  }
};
