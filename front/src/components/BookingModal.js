import React, { useState } from 'react';
import styled from 'styled-components';
import { useBookings } from '../hooks/useBookings';

const BookingModal = ({ pg, onClose }) => {
  const { createBooking } = useBookings();
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createBooking(pg._id, {
        checkIn: new Date(),
        status: 'pending'
      });
      setIsBooked(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>{isBooked ? 'Owner Contact Information' : `Book ${pg.title}`}</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        {!isBooked ? (
          <BookingForm onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <ConfirmationText>
              Would you like to proceed with booking this PG?
              Once confirmed, you'll be able to see the owner's contact information.
            </ConfirmationText>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Confirm Booking'}
            </SubmitButton>
          </BookingForm>
        ) : (
          <ContactInfo>
            <InfoItem>
              <Label>Owner Name:</Label>
              <Value>{pg.owner.name}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Phone:</Label>
              <Value>{pg.owner.phone}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email:</Label>
              <Value>{pg.owner.email}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Address:</Label>
              <Value>{pg.address}</Value>
            </InfoItem>
            <Note>
              Please contact the owner directly to proceed with the booking process.
            </Note>
          </ContactInfo>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const BookingForm = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const SubmitButton = styled.button`
  background: #007bff;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background: #ccc;
  }

  &:hover:not(:disabled) {
    background: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  padding: 0.5rem;
  background: #fff3f3;
  border-radius: 4px;
`;

const ContactInfo = styled.div`
  display: grid;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

const InfoItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const Note = styled.p`
  margin-top: 1rem;
  padding: 1rem;
  background: #e9ecef;
  border-radius: 4px;
  color: #666;
  font-style: italic;
`;

const ConfirmationText = styled.p`
  margin-bottom: 1rem;
  line-height: 1.5;
  color: #666;
`;

export default BookingModal; 