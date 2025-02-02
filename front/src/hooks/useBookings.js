import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchBookings = useCallback(async () => {
    if (!user || !localStorage.getItem('token')) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await bookingService.getUserBookings();
      if (response && response.data) {
        setBookings(response.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
      if (err.response?.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let mounted = true;
    if (user) {
      fetchBookings().then(() => {
        if (mounted) setLoading(false);
      });
    }
    return () => {
      mounted = false;
    };
  }, [user, fetchBookings]);

  const createBooking = async (pgId, bookingData) => {
    try {
      const response = await bookingService.createBooking(pgId, bookingData);
      setBookings([...bookings, response.data]);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateStatus = async (bookingId, status) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, status);
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? response.data : booking
      ));
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { bookings, loading, error, createBooking, updateStatus, cancelBooking, refreshBookings: fetchBookings };
}; 