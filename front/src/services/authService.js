import axios from 'axios';

const API_URL = 'http://localhost:5001/api'; // Hardcode for now to debug

export const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userType', response.data.user.userType);
    }
    return response.data;
  },
  
  register: async (userData, userType) => {
    try {
      // Create the request payload
      const requestData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        userType: userType
      };

      console.log('Sending registration request to:', `${API_URL}/auth/register`);
      console.log('Request data:', requestData);

      // Make the API call with explicit URL
      const response = await axios({
        method: 'post',
        url: `${API_URL}/auth/register`,
        data: requestData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Server response:', response.data);

      // Check if the response contains the expected data
      if (response.data && response.data.token) {
        // Store the authentication data
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.user.userType);
        
        // Return the success response
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      // Log the detailed error
      if (error.response) {
        console.error('Registration failed:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
          url: error.config.url
        });
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }

      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  },
  
  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      userType: localStorage.getItem('userType')
    };
  }
};

export default authService; 