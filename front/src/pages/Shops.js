import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import config from '../config/config';

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
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
`;

const ListingCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  
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

const ListingTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #333;
`;

const ListingLocation = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ListingPrice = styled.p`
  font-weight: bold;
  color: #4B49AC;
  margin-bottom: 1rem;
`;

const ViewButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #4B49AC;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3f3e8f;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const NoListings = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  margin-top: 2rem;
`;

const Shops = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchAllListings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.API_URL}/api/listings/shops`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        
        if (mounted && data.success) {
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
    return () => { mounted = false; };
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
      .split('\\').pop()
      .split('/').pop();
    
    return `${config.API_URL}/uploads/listings/${cleanPath}`;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingText>Loading shops...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Shops</Title>
        <Subtitle>Find local shops near your campus</Subtitle>
      </Header>

      {listings.length === 0 ? (
        <NoListings>No shops available at the moment.</NoListings>
      ) : (
        <ListingsGrid>
          {listings.map((listing) => (
            <ListingCard key={listing._id}>
              {getImageUrl(listing) && (
                <ListingImage 
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
              )}
              <ListingContent>
                <ListingTitle>{listing.title}</ListingTitle>
                <ListingLocation>📍 {listing.location}</ListingLocation>
                <ListingPrice>₹{listing.priceRange}</ListingPrice>
                <ViewButton onClick={() => navigate(`/shops/${listing._id}`)}>
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

export default Shops; 