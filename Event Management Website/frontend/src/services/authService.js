import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export const login = async (email, password) => {
    const response = await axios.post(`${url}/api/auth/login`, { email, password });
    const token = response.data.token;
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', payload.isAdmin); // Store admin status
    return payload.isAdmin;
};

export const register = async (username, email, password) => {
    await axios.post(`${url}/api/auth/register`, { username, email, password });
};