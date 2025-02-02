import axiosInstance from './axiosConfig';

const handleError = (error) => {
  const errorResponse = {
    success: false,
    message: 'An error occurred',
    details: null
  };

  if (error.response) {
    errorResponse.message = error.response.data.message || 'Server error occurred';
    errorResponse.details = error.response.data;
  } else if (error.request) {
    errorResponse.message = 'No response from server';
  } else {
    errorResponse.message = error.message || 'Error setting up request';
  }

  return errorResponse;
};

const reviewService = {
  // Get reviews for a specific listing
  getReviews: async (listingId) => {
    try {
      console.log('Fetching reviews for listing:', listingId);
      const response = await axiosInstance.get(`/reviews/listing/${listingId}`);
      console.log('Reviews fetched successfully:', response.data);
      return {
        success: true,
        reviews: response.data.reviews || []
      };
    } catch (error) {
      console.error('Error fetching reviews:', {
        listingId,
        error: error.response?.data || error.message
      });
      return handleError(error);
    }
  },
  
  // Create a new review
  createReview: async (formData) => {
    try {
      // Verify required fields
      const userId = formData.get('userId');
      const listingId = formData.get('listingId');
      const listing = formData.get('listing');
      const rating = formData.get('rating');
      const comment = formData.get('comment');

      // Log all form data for debugging
      console.log('Review form data:', {
        userId,
        listingId,
        listing,
        rating,
        comment,
        hasImages: formData.getAll('images').length > 0
      });

      if (!userId || !listingId || !listing || !rating || !comment) {
        console.error('Missing required fields:', { userId, listingId, listing, rating, comment });
        return {
          success: false,
          message: 'All required fields must be provided'
        };
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axiosInstance.post('/reviews', formData, config);
      
      if (response.data.success) {
        console.log('Review created successfully:', response.data);
        return {
          success: true,
          review: response.data.review
        };
      } else {
        throw new Error(response.data.message || 'Failed to create review');
      }
    } catch (error) {
      console.error('Error creating review:', {
        error: error.response?.data || error.message
      });
      return handleError(error);
    }
  },

  // Update an existing review
  updateReview: async (id, reviewData) => {
    try {
      console.log('Updating review:', { id, reviewData });
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axiosInstance.put(`/reviews/${id}`, reviewData, config);
      console.log('Review updated successfully:', response.data);
      return {
        success: true,
        review: response.data.review
      };
    } catch (error) {
      console.error('Error updating review:', {
        id,
        error: error.response?.data || error.message
      });
      return handleError(error);
    }
  },

  // Delete a review
  deleteReview: async (id) => {
    try {
      console.log('Deleting review:', id);
      const response = await axiosInstance.delete(`/reviews/${id}`);
      console.log('Review deleted successfully:', response.data);
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Error deleting review:', {
        id,
        error: error.response?.data || error.message
      });
      return handleError(error);
    }
  }
};

export default reviewService;