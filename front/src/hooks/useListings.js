import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import listingService from '../services/listingService';

export const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      const response = await listingService.getOwnerListings();
      setListings(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return { listings, loading, error, refetchListings: fetchListings };
}; 