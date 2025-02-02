import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

export const businessListingService = {
  createListing: (type, formData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/listings/create/${type}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getListings: (type) => {
    return axios.get(`${API_URL}/listings/${type}`);
  },

  getListing: (type, id) => {
    return axios.get(`${API_URL}/listings/${type}/${id}`);
  }
};

export default businessListingService; 