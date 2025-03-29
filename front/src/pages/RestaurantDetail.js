import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ReviewSection from '../components/ReviewSection';
import ErrorBoundary from '../components/ErrorBoundary';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        console.log('Fetching listing details for ID:', id);
        // Validate ID format
        if (!id || id.length !== 24) {
          throw new Error('Invalid listing ID format');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/listings/restaurants/${id}`);
        
        const data = await response.json();
        console.log('Received listing data:', data);

        if (!response.ok) {
          throw new Error(`Failed to fetch listing details: ${data.message || response.statusText}`);
        }
        
        if (data.success) {
          setListing(data.listing);
        } else {
          throw new Error(data.message || 'Failed to fetch listing');
        }
      } catch (error) {
        console.error('Full error object:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!listing) return <div>Listing not found</div>;

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Clean up the path
    const cleanPath = imagePath
      .split('\\').pop() // Remove Windows-style path
      .split('/').pop(); // Get just the filename
    
    // Ensure we're using the correct path format
    return `${process.env.REACT_APP_API_URL}/uploads/listings/${cleanPath}`;
  };

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const ContactDialog = ({ onClose }) => (
    <DialogOverlay onClick={onClose}>
      <DialogContent onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </DialogHeader>
        
        <DialogBody>
          <ContactSection>
            <ContactTitle>Owner Information</ContactTitle>
            <ContactInfo>
              <InfoItem>
                <Label>Name:</Label>
                <Value>{listing?.owner?.name || 'Not available'}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Email:</Label>
                <Value>{listing?.owner?.email || 'Not available'}</Value>
              </InfoItem>
              <InfoItem>
                <Label>Phone:</Label>
                <Value>{listing?.owner?.phone || 'Not available'}</Value>
              </InfoItem>
            </ContactInfo>
          </ContactSection>
        </DialogBody>
      </DialogContent>
    </DialogOverlay>
  );

  return (
    <ErrorBoundary>
      <PageContainer>
        <ImageSection>
          <MainImage>
            {imageLoading && <LoadingSpinner>Loading...</LoadingSpinner>}
            <img 
              src={getImageUrl(listing?.images?.[currentImageIndex])}
              alt={listing?.title || 'Restaurant image'}
              onLoad={handleImageLoad}
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                setImageLoading(false);
              }}
              style={{ display: imageLoading ? 'none' : 'block' }}
              crossOrigin="anonymous"
            />
          </MainImage>
          <ThumbnailContainer>
            {listing?.images?.map((image, index) => (
              <Thumbnail 
                key={index}
                onClick={() => handleImageChange(index)}
                active={currentImageIndex === index}
              >
                <img 
                  src={getImageUrl(image)}
                  alt={`${listing.title} - Thumbnail ${index + 1}`}
                  onError={(e) => {
                    console.error('Thumbnail failed to load:', e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
              </Thumbnail>
            ))}
          </ThumbnailContainer>
        </ImageSection>

        <DetailsSection>
          <Title>{listing.title}</Title>
          <Location>📍 {listing.location}</Location>
          <Cuisine>{listing.cuisineType.join(', ')}</Cuisine>
          <Price>₹{listing.price} /month</Price>
          <Description>{listing.description}</Description>
          <ContactButton onClick={() => setShowContactDialog(true)}>
            Contact Owner
          </ContactButton>
          {showContactDialog && <ContactDialog onClose={() => setShowContactDialog(false)} />}
        </DetailsSection>
        <ReviewSection listingId={listing._id} ownerId={listing.owner?._id} />
      </PageContainer>
    </ErrorBoundary>
  );
};

// Styled Components (matching PGDetails.js styling)
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ImageSection = styled.div`
  margin-bottom: 2rem;
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  background-color: #f5f5f5;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const Thumbnail = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#4B49AC' : 'transparent'};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DetailsSection = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin: 0;
`;

const Location = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Cuisine = styled.span`
  font-size: 1.1rem;
  color: #666;
  margin-right: 1rem;
`;

const Price = styled.span`
  font-size: 1.1rem;
  color: #666;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const ContactButton = styled.button`
  background-color: #4B49AC;
  color: #fff;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
`;

// Dialog styled components
const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
  margin-bottom: 1.5rem;
`;

const DialogTitle = styled.h2`
  margin: 0;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const DialogBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ContactSection = styled.div`
  margin-bottom: 1rem;
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background-color: #f5f5f5;
  color: #666;
`;

const RestaurantDetailPage = () => (
  <ErrorBoundary>
    <RestaurantDetail />
  </ErrorBoundary>
);

export default RestaurantDetailPage;