import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import config from '../config/config';

const FindPG = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/listings/accommodations`);
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        if (data.success) {
          setListings(data.listings || []);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllListings();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <PageContainer>
      <Header>
        <Title>Available PG Accommodations</Title>
        <Subtitle>Find your perfect stay near campus</Subtitle>
      </Header>

      <ListingsGrid>
        {listings.map((listing) => (
          <ListingCard key={listing._id}>
            <ListingImage 
              src={`http://localhost:5001${listing.images[0]}`} 
              alt={listing.title}
            />
            <ListingContent>
              <ListingTitle>{listing.title}</ListingTitle>
              <ListingLocation>{listing.location}</ListingLocation>
              <ListingPrice>₹{listing.price}/month</ListingPrice>
              <ListingDetails>
                <Detail>Room Type: {listing.roomType}</Detail>
                <Detail>Available Rooms: {listing.availableRooms}</Detail>
              </ListingDetails>
              <ViewButton onClick={() => window.location.href = `/pg/${listing._id}`}>
                View Details
              </ViewButton>
            </ListingContent>
          </ListingCard>
        ))}
      </ListingsGrid>
    </PageContainer>
  );
};

// Styled components
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
  
  &:hover {
    background: #3f3e8f;
  }
`;

export default FindPG;
