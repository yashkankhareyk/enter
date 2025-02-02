import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import MapComponent from '../components/MapComponent';

const Accommodations = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;  // Add mounted flag

    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_URL}/api/listings/accommodations`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        
        if (mounted && data.success) {  // Check if component is still mounted
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAllListings();
    return () => { mounted = false; };  // Cleanup
  }, []);

  const getImageUrl = (listing) => {
    if (!listing.images || listing.images.length === 0) {
      return null;
    }
    
    const imagePath = listing.images[0];
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Clean up the path
    const cleanPath = imagePath
      .split('\\').pop() // Remove Windows-style path
      .split('/').pop(); // Get just the filename
    
    return `${config.API_URL}/uploads/listings/${cleanPath}`;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading accommodations...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Student Accommodations</Title>
        <Subtitle>Find comfortable PG accommodations near your campus</Subtitle>
      </Header>

      {/* Map Section */}
      <MapSection>
        <SectionTitle>Browse Locations</SectionTitle>
        {listings.length > 0 && <MapComponent listings={listings} />}
      </MapSection>

      {/* Existing listings grid */}
      {listings.length === 0 ? (
        <NoListings>No accommodations available at the moment.</NoListings>
      ) : (
        <ListingsGrid>
          {listings.map((listing) => (
            <ListingCard key={listing._id}>
              <ListingImage 
                src={getImageUrl(listing)}
                alt={listing.title}
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                }}
                crossOrigin="anonymous"
              />
              <ListingContent>
                <ListingTitle>{listing.title}</ListingTitle>
                <ListingLocation>📍 {listing.location}</ListingLocation>
                <ListingPrice>₹{listing.price} <span>/month</span></ListingPrice>
                <ListingDetails>
                  <Detail>Room Type: {listing.roomType}</Detail>
                  <Detail>Available Rooms: {listing.availableRooms}</Detail>
                </ListingDetails>
                {listing.location && (
                  <LocationButton onClick={() => {
                    if (listing.latitude && listing.longitude) {
                      navigate(`/pg/${listing._id}#location`);
                    }
                  }}>
                    📍 View Location
                  </LocationButton>
                )}
                <ViewButton onClick={() => navigate(`/pg/${listing._id}`)}>
                  View Details
                </ViewButton>
              </ListingContent>
            </ListingCard>
          ))}
        </ListingsGrid>
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

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ListingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ListingContent = styled.div`
  padding: 1rem;
`;

const ListingTitle = styled.h2`
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ListingLocation = styled.p`
  color: #666;
  margin-bottom: 0.5rem;
`;

const ListingPrice = styled.p`
  font-size: 1.25rem;
  font-weight: bold;
  color: #4B49AC;
  margin-bottom: 0.5rem;

  span {
    font-size: 0.9rem;
    color: #666;
  }
`;

const ListingDetails = styled.div`
  margin-bottom: 1rem;
`;

const Detail = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
`;

const ViewButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4B49AC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #3f3e8f;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const NoListings = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.2rem;
`;

const MapSection = styled.div`
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

const LocationButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #fff;
  color: #4B49AC;
  border: 1px solid #4B49AC;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
  
  &:hover {
    background: #f5f5f5;
  }
`;

export default Accommodations; 