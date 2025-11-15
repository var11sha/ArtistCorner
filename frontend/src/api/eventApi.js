// src/api/eventApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/event"; // your backend URL

// ✅ Create new event
export const createEvent = async (eventData) => {
  try {
    const res = await axios.post(API_URL, eventData);
    return res.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// ✅ Get all events for user
export const getUserEvents = async (userId) => {
  try {
    const res = await axios.get(`${API_URL}/user/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// ✅ Update an event
export const updateEvent = async (eventId, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/${eventId}`, updatedData);
    return res.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

// ✅ Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const res = await axios.delete(`${API_URL}/${eventId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};
