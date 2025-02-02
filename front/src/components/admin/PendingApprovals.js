import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PendingApprovals = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchPendingListings();
  }, [isAdmin, navigate]);

  const fetchPendingListings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authorized. Please log in as admin.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5001/api/listings/pending', {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        console.log('Pending listings:', response.data.listings);
        setPendingListings(response.data.listings || []);
      } else {
        setError('Failed to fetch pending listings');
      }
    } catch (error) {
      console.error('Error fetching pending listings:', error);
      if (error.response?.status === 400) {
        console.log('Full error response:', error.response);
      }
      setError(error.response?.data?.message || 'Error fetching pending listings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (listingId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Not authorized. Please log in as admin.');
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/listings/${listingId}/approve`,
        {},
        {
          headers: { 
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setPendingListings(prevListings => 
          prevListings.filter(listing => listing._id !== listingId)
        );
      }
    } catch (error) {
      console.error('Error approving listing:', error);
      setError(error.response?.data?.message || 'Error approving listing');
    }
  };

  const handleReject = (listing) => {
    setSelectedListing(listing);
    setShowRejectionDialog(true);
    setRejectionReason(''); // Reset rejection reason
  };

  const handleConfirmReject = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/listings/${selectedListing._id}/reject`,
        { reason: rejectionReason },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Update the listings state to remove the rejected listing
        setPendingListings(prevListings => 
          prevListings.filter(listing => listing._id !== selectedListing._id)
        );
        // Close both dialogs
        setShowRejectionDialog(false);
        setShowPreview(false);
        setSelectedListing(null);
        setRejectionReason('');
      }
    } catch (error) {
      console.error('Error rejecting listing:', error);
      setError('Failed to reject listing. Please try again.');
    }
  };

  const getImageUrl = (listing) => {
    if (!listing.images || listing.images.length === 0) {
      return null;
    }
    
    const imagePath = listing.images[0];
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    const cleanPath = imagePath
      .split('\\').pop()
      .split('/').pop();
    
    return `${process.env.REACT_APP_API_URL}/uploads/listings/${cleanPath}`;
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowPreview(true);
    setCurrentImageIndex(0);
  };

  const ListingPreviewDialog = ({ listing, onClose }) => {
    if (!listing) return null;

    return (
      <PreviewDialog onClick={onClose}>
        <PreviewContent onClick={e => e.stopPropagation()}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          
          <PreviewHeader>
            <h2>{listing.title}</h2>
            <Status status={listing.status}>{listing.status}</Status>
          </PreviewHeader>

          {listing.images && listing.images.length > 0 && (
            <ImageSection>
              <MainImage>
                <img 
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  crossOrigin="anonymous"
                />
              </MainImage>
              <ThumbnailContainer>
                {listing.images.map((image, index) => (
                  <Thumbnail 
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    active={currentImageIndex === index}
                  >
                    <img 
                      src={getImageUrl({ ...listing, images: [image] })}
                      alt={`${listing.title} - Thumbnail ${index + 1}`}
                      crossOrigin="anonymous"
                    />
                  </Thumbnail>
                ))}
              </ThumbnailContainer>
            </ImageSection>
          )}

          <PreviewDetails>
            <DetailItem>
              <Label>Type:</Label>
              <Value>{listing.type}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Location:</Label>
              <Value>{listing.location}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Price:</Label>
              <Value>₹{listing.price}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Description:</Label>
              <Value>{listing.description}</Value>
            </DetailItem>
            <DetailItem>
              <Label>Owner:</Label>
              <Value>{listing.owner?.name} ({listing.owner?.email})</Value>
            </DetailItem>
            <DetailItem>
              <Label>Submitted:</Label>
              <Value>{new Date(listing.createdAt).toLocaleString()}</Value>
            </DetailItem>
          </PreviewDetails>

          <PreviewActions>
            <ApproveButton onClick={() => handleApprove(listing._id)}>
              Approve
            </ApproveButton>
            <RejectButton onClick={() => {
              handleReject(listing);
            }}>
              Reject
            </RejectButton>
          </PreviewActions>
        </PreviewContent>
      </PreviewDialog>
    );
  };

  const RejectionDialog = () => (
    <DialogOverlay>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Reject Listing</DialogTitle>
          <CloseButton onClick={() => setShowRejectionDialog(false)}>&times;</CloseButton>
        </DialogHeader>
        <DialogBody>
          <p>Please provide a reason for rejecting "{selectedListing?.title}"</p>
          <TextArea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter rejection reason..."
            rows={4}
          />
        </DialogBody>
        <DialogFooter>
          <CancelButton onClick={() => setShowRejectionDialog(false)}>
            Cancel
          </CancelButton>
          <ConfirmButton 
            onClick={handleConfirmReject}
            disabled={!rejectionReason.trim()}
          >
            Confirm Rejection
          </ConfirmButton>
        </DialogFooter>
      </DialogContent>
    </DialogOverlay>
  );

  if (!isAdmin) {
    return <ErrorMessage>Access denied. Admin privileges required.</ErrorMessage>;
  }

  if (loading) {
    return <LoadingMessage>Loading pending approvals...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Pending Approvals</Title>
      {loading ? (
        <LoadingMessage>Loading pending listings...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : pendingListings.length === 0 ? (
        <NoListingsMessage>No pending listings to review</NoListingsMessage>
      ) : (
        <ListingsContainer>
          {pendingListings.map((listing) => (
            <ListingCard key={listing._id}>
              {listing.images && listing.images.length > 0 && (
                <ListingImage 
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
              )}
              <ListingDetails>
                <ListingTitle>{listing.title}</ListingTitle>
                <ListingInfo>
                  <InfoLabel>Type:</InfoLabel> {listing.type}
                </ListingInfo>
                <ListingInfo>
                  <InfoLabel>Location:</InfoLabel> {listing.location}
                </ListingInfo>
              </ListingDetails>
              <ButtonContainer>
                <ViewButton onClick={() => handleViewDetails(listing)}>
                  View Details
                </ViewButton>
                <ApproveButton onClick={() => handleApprove(listing._id)}>
                  Approve
                </ApproveButton>
                <RejectButton onClick={() => handleReject(listing)}>
                  Reject
                </RejectButton>
              </ButtonContainer>
            </ListingCard>
          ))}
        </ListingsContainer>
      )}

      {showPreview && (
        <ListingPreviewDialog 
          listing={selectedListing} 
          onClose={() => setShowPreview(false)} 
        />
      )}

      {showRejectionDialog && <RejectionDialog />}
    </Container>
  );
};

const Container = styled.div`
  padding: 2rem;
`;

const ListingsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ListingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ListingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
`;

const ListingDetails = styled.div`
  padding: 1rem;
`;

const ListingTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
`;

const ListingInfo = styled.div`
  margin: 0.5rem 0;
  color: #666;
`;

const InfoLabel = styled.span`
  font-weight: bold;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: 1rem;
  gap: 1rem;
  border-top: 1px solid #eee;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
`;

const ApproveButton = styled(Button)`
  background: #4CAF50;
  color: white;
  &:hover {
    background: #388E3C;
  }
`;

const RejectButton = styled(Button)`
  background: #f44336;
  color: white;
  &:hover {
    background: #d32f2f;
  }
`;

const RejectionDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RejectionContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;

  textarea {
    width: 100%;
    padding: 0.5rem;
    margin: 1rem 0;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const RejectionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

const ConfirmRejectButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #f44336;
  color: white;
  cursor: pointer;
  &:hover {
    background: #d32f2f;
  }
`;

const NoListingsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const Title = styled.h2`
  margin-bottom: 2rem;
  color: #333;
`;

const PreviewDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PreviewContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const PreviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ImageSection = styled.div`
  margin: 1rem 0;
`;

const MainImage = styled.div`
  width: 100%;
  height: 400px;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#4CAF50' : 'transparent'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const PreviewDetails = styled.div`
  margin: 1rem 0;
`;

const DetailItem = styled.div`
  margin: 0.5rem 0;
  display: flex;
  gap: 1rem;
`;

const Value = styled.span`
  color: #666;
`;

const PreviewActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;
`;

const ViewButton = styled(Button)`
  background: #2196F3;
  color: white;
  &:hover {
    background: #1976D2;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const Status = styled.span`
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  background: ${props => props.status === 'Approved' ? '#4caf50' : props.status === 'Rejected' ? '#f44336' : '#2196F3'};
  color: white;
`;

const Label = styled.span`
  font-weight: bold;
  min-width: 100px;
  color: #333;
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
`;

const DialogContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DialogTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const DialogBody = styled.div`
  margin: 1rem 0;
`;

const DialogFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
  resize: vertical;
`;

const ConfirmButton = styled(Button)`
  background: #dc3545;
  color: white;
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
  &:not(:disabled):hover {
    background: #c82333;
  }
`;

export default PendingApprovals;
