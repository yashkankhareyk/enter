import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const listingService = {
  getAllListings: () => axios.get(`${API_URL}/listings`),
  getListing: (id) => axios.get(`${API_URL}/listings/${id}`),
  createListing: (listingData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/listings`, listingData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
  },
  updateListing: (id, listingData) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/listings/${id}`, listingData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  deleteListing: (id) => axios.delete(`${API_URL}/listings/${id}`),
  searchListings: (params) => axios.get(`${API_URL}/listings/search`, { params }),
  getOwnerListings: () => axios.get(`${API_URL}/listings/owner`),
  toggleAvailability: (id) => axios.put(`${API_URL}/listings/${id}/toggle-availability`)
};

export default listingService; 