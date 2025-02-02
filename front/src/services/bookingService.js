import axios from 'axios';
import config from '../config/config';

const API_URL = `${config.API_URL}/api/bookings`;

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export default {
  // Get all bookings for a user
  getUserBookings: () => axios.get(`${API_URL}/user`, getAuthHeader()),
  
  // Get all bookings for an owner
  getOwnerBookings: () => axios.get(`${API_URL}/owner`, getAuthHeader()),
  
  // Create a new booking
  createBooking: (listingId, data) => axios.post(`${API_URL}/${listingId}`, data, getAuthHeader()),
  
  // Update booking status
  updateBookingStatus: (id, status) => axios.patch(`${API_URL}/${id}/status`, { status }, getAuthHeader()),
  
  // Cancel booking
  cancelBooking: (bookingId) => axios.delete(`${API_URL}/${bookingId}`, getAuthHeader())
}; 