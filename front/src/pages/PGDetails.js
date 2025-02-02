import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import ReviewSection from '../components/ReviewSection';
import config from '../config/config.js';
import MapComponent from '../components/MapComponent';

const PGDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchListingDetails = async () => {
      try {
        console.log('Fetching listing details for ID:', id);
        // Validate ID format
        if (!id || id.length !== 24) {
          throw new Error('Invalid listing ID format');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/listings/accommodations/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch listing details: ${errorData.message || response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received listing data:', data);
        
        if (data.success) {
          setListing(data.listing);
        } else {
          throw new Error(data.message || 'Failed to fetch listing');
        }
      } catch (error) {
        console.error('Error fetching listing details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  useEffect(() => {
    console.log('Listing data:', listing);
    console.log('Location data:', {
      latitude: listing?.latitude,
      longitude: listing?.longitude
    });
    
    if (window.location.hash === '#location') {
      const mapSection = document.getElementById('location-map');
      if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [listing]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

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

    // Use fetch to get the image with proper credentials
    return `${process.env.REACT_APP_API_URL}/uploads/listings/${cleanPath}`;
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

  if (loading) return <LoadingMessage>Loading...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!listing) return <ErrorMessage>Listing not found</ErrorMessage>;

  return (
    <PageContainer>
      <HeaderSection>
        <Title>{listing.title}</Title>
        <Location>{listing.location}</Location>
        <Price>₹{listing.price} /month</Price>
        <RoomInfo>{listing.roomType} Room</RoomInfo>
      </HeaderSection>

      {listing?.images?.length > 0 && (
        <ImageSection>
          <MainImage>
            {imageLoading && <LoadingSpinner>Loading...</LoadingSpinner>}
            <img 
              src={getImageUrl(listing?.images?.[currentImageIndex])}
              alt={listing?.title || 'PG image'}
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
            {listing.images.map((image, index) => (
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
      )}

      <Description>{listing.description}</Description>

      <ContactButton onClick={() => setShowContactDialog(true)}>
        Contact Owner
      </ContactButton>

      {showContactDialog && <ContactDialog onClose={() => setShowContactDialog(false)} />}

      <ReviewSection listingId={listing._id} ownerId={listing.owner?._id} />

      {listing.latitude && listing.longitude && (
        <Section id="location-map">
          <SectionTitle>Location</SectionTitle>
          <MapComponent 
            latitude={listing.latitude}
            longitude={listing.longitude}
            title={listing.title}
          />
        </Section>
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
  width: 80px;
  height: 80px;
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const Location = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4B49AC;

  span {
    font-size: 1rem;
    color: #666;
  }
`;

const Section = styled.div`
  margin: 20px 0;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  font-size: 1.1rem;
  color: #333;
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
`;

const OwnerDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BookingButton = styled.button`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: #4B49AC;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #3f3e8f;
  }
`;

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
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const DialogTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  
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
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ContactTitle = styled.h3`
  font-size: 1.1rem;
  color: #4B49AC;
  margin-bottom: 1rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 1rem;
`;

const Label = styled.span`
  font-weight: 500;
  color: #666;
  min-width: 80px;
`;

const Value = styled.span`
  color: #333;
`;

const Note = styled.p`
  color: #666;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 1rem;
  font-style: italic;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const RoomInfo = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const ContactButton = styled.button`
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: #4B49AC;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #3f3e8f;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

export default PGDetails;