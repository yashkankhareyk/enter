import React, { useState } from 'react';
import styled from 'styled-components';
import { useBookings } from '../hooks/useBookings';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { bookings, loading, cancelBooking } = useBookings();
  const { user } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardContainer>
      <Header>
        <h1>Welcome, {user.name}</h1>
      </Header>

      <Section>
        <h2>My Bookings</h2>
        <BookingsList>
          {bookings.map(booking => (
            <BookingCard key={booking._id}>
              <BookingImage src={booking.listing.images[0]} alt={booking.listing.title} />
              <BookingInfo>
                <h3>{booking.listing.title}</h3>
                <p>Location: {booking.listing.location}</p>
                <p>Price: ₹{booking.listing.price} / month</p>
                <p>Status: {booking.status}</p>
                <p>Booked on: {new Date(booking.timestamp).toLocaleDateString()}</p>
                
                {booking.status === 'pending' && (
                  <OwnerContact>
                    <h4>Owner Contact:</h4>
                    <p>Name: {booking.listing.owner.name}</p>
                    <p>Phone: {booking.listing.owner.phone}</p>
                    <p>Email: {booking.listing.owner.email}</p>
                  </OwnerContact>
                )}

                <CancelButton 
                  onClick={() => cancelBooking(booking._id)}
                  disabled={booking.status === 'cancelled'}
                >
                  Cancel Booking
                </CancelButton>
              </BookingInfo>
            </BookingCard>
          ))}
          {bookings.length === 0 && (
            <EmptyState>
              No bookings found. Start searching for PGs!
            </EmptyState>
          )}
        </BookingsList>
      </Section>
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const BookingsList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const BookingCard = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const BookingImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 4px;
`;

const BookingInfo = styled.div`
  h3 {
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 0.5rem;
  }
`;

const OwnerContact = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;

  h4 {
    margin-bottom: 0.5rem;
  }
`;

const CancelButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background: #c82333;
  }

  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
`;

export default StudentDashboard;
