import axios from 'axios';

const url = process.env.REACT_APP_API_URL;

export const getEvents = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${url}/api/events`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createEvent = async (event) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${url}/api/events`, event, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const rsvpEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    await axios.post(`${url}/api/events/${eventId}/rsvps`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteEvent = async (eventId) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${url}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};