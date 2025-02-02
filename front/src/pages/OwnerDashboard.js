import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

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
    
    return `${process.env.REACT_APP_API_URL}/uploads/listings/${cleanPath}`;
  };

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // First, check if we have a user and token
        const token = localStorage.getItem('token');
        if (!token || !user?._id) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5001/api/listings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }

        const data = await response.json();
        console.log('Fetched listings:', data); // Debug log

        if (data.success) {
          // Filter listings for the current owner
          const ownerListings = data.listings.filter(
            listing => listing.owner._id === user._id
          );
          setListings(ownerListings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingMessage>Loading your listings...</LoadingMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <Title>Seller Dashboard</Title>
        <Subtitle>Manage your listings and analytics</Subtitle>
      </Header>

      <ContentSection>
        <InventoryHeader>
          <h2>Your Listings</h2>
          <ButtonGroup>
            <AddButton onClick={() => navigate('/add-listing')}>
              + Add PG Listing
            </AddButton>
            <AddButton onClick={() => navigate('/add-business')}>
              + Add Business Listing
            </AddButton>
          </ButtonGroup>
        </InventoryHeader>

        <ListingsGrid>
          {listings && listings.length > 0 ? (
            listings.map(listing => (
              <ListingCard key={listing._id}>
                <ListingImage 
                  src={getImageUrl(listing)}
                  alt={listing.title}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
                <ActionButtons>
                  <IconButton onClick={() => navigate(`/edit-listing/${listing._id}`)}>
                    <span>✏️</span>
                  </IconButton>
                  <IconButton className="delete">
                    <span>🗑️</span>
                  </IconButton>
                </ActionButtons>
                <ListingInfo>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingDescription>{listing.description}</ListingDescription>
                  <PriceStock>
                    <Price>₹{listing.price}/month</Price>
                    <Stock>Available Rooms: {listing.availableRooms}</Stock>
                  </PriceStock>
                </ListingInfo>
              </ListingCard>
            ))
          ) : (
            <EmptyState>
              No listings yet. Click "Add New Listing" to create your first listing.
            </EmptyState>
          )}
        </ListingsGrid>
      </ContentSection>
    </DashboardContainer>
  );
};

// Styled components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const ContentSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InventoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    color: #333;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const AddButton = styled.button`
  padding: 0.75rem 1.5rem;
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
  position: relative;
`;

const ListingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &.delete {
    background: #ff4444;
    color: white;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const ListingInfo = styled.div`
  padding: 1rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ListingDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const PriceStock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
  color: #4B49AC;
`;

const Stock = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  grid-column: 1 / -1;
`;

export default OwnerDashboard;