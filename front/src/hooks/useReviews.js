import { useState, useEffect, useCallback } from 'react';
import reviewService from '../services/reviewService';

export const useReviews = (listingId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchReviews = useCallback(async () => {
    if (!listingId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await reviewService.getReviews(listingId);
      
      if (response.success) {
        setReviews(response.reviews);
      } else {
        throw new Error(response.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message || 'Error fetching reviews');
      console.error('Error fetching reviews:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews, refreshKey]);

  const addReview = async (formData) => {
    try {
      setError(null);
      const response = await reviewService.createReview(formData);
      // Refresh reviews list after successful creation
      setRefreshKey(prev => prev + 1);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error adding review';
      setError(errorMessage);
      console.error('Error adding review:', err);
      throw new Error(errorMessage);
    }
  };

  const updateReview = async (id, reviewData) => {
    try {
      setError(null);
      const response = await reviewService.updateReview(id, reviewData);
      if (response.success) {
        setReviews(prev => prev.map(review => 
          review._id === id ? response.review : review
        ));
        return response.review;
      } else {
        throw new Error(response.message || 'Failed to update review');
      }
    } catch (err) {
      setError(err.message || 'Error updating review');
      console.error('Error updating review:', err);
      throw err;
    }
  };

  const deleteReview = async (id) => {
    try {
      setError(null);
      const response = await reviewService.deleteReview(id);
      if (response.success) {
        setReviews(prev => prev.filter(review => review._id !== id));
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete review');
      }
    } catch (err) {
      setError(err.message || 'Error deleting review');
      console.error('Error deleting review:', err);
      throw err;
    }
  };

  const refreshReviews = () => {
    setRefreshKey(prev => prev + 1);
  };

  return {
    reviews,
    loading,
    error,
    addReview,
    updateReview,
    deleteReview,
    refreshReviews
  };
};