import { useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchFilters from '../components/accommodation/SearchFilters';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config';

// Simple inline components instead of separate files
const LoadingSpinner = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SearchWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FiltersSection = styled.div`
  margin-bottom: 2rem;
`;

const ResultsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const ListingContent = styled.div`
  padding: 1rem;
`;

const ListingTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
`;

const ListingLocation = styled.p`
  font-size: 1rem;
  color: #666;
`;

const ListingPrice = styled.p`
  font-size: 1rem;
  color: #666;
`;

const Detail = styled.p`
  font-size: 1rem;
  color: #666;
`;

const ViewButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background-color: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.active ? '#0056b3' : 'transparent'};
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff0000;
`;

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    roomType: '',
    location: ''
  });
  
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get('q');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // If no search query, don't make the request
        if (!searchQuery) {
          setSearchResults([]);
          setLoading(false);
          return;
        }

        // Use the listingService instead of direct axios call
        const response = await axios.get(`${config.API_URL}/api/listings/accommodations`, {
          params: {
            search: searchQuery
          }
        });
        
        if (response.data.success) {
          // Filter results based on search query
          const filteredResults = response.data.listings.filter(listing => 
            listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (listing.description && listing.description.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          
          setSearchResults(filteredResults);
        } else {
          setError('No results found');
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error performing search:', error);
        setError('Failed to perform search. Please try again.');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return null;
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    // Clean up the path and ensure proper directory structure
    const cleanPath = imagePath
      .split('\\').pop() // Remove Windows-style path
      .split('/').pop(); // Get just the filename
      
    return `${config.API_URL}/uploads/listings/${cleanPath}`;
  };

  return (
    <SearchWrapper>
      <Title>Search Results for "{searchQuery || ''}"</Title>
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      
      <FiltersSection>
        <SearchFilters filters={filters} onChange={handleFilterChange} />
      </FiltersSection>

      <SearchResults>
        {loading ? (
          <LoadingSpinner>Loading...</LoadingSpinner>
        ) : searchResults.length === 0 ? (
          <NoResults>No results found for your search.</NoResults>
        ) : (
          <ResultsGrid>
            {searchResults.map(listing => (
              <ListingCard key={listing._id}>
                {listing.images && listing.images[0] && (
                  <ListingImage 
                    src={getImageUrl(listing.images[0])}
                    alt={listing.title}
                    onError={(e) => {
                      console.error('Image failed to load:', e.target.src);
                      // Add debugging information
                      console.log('Listing details:', {
                        listingId: listing._id,
                        imagePath: listing.images[0]
                      });
                    }}
                    crossOrigin="anonymous"
                    style={{ display: 'block' }}
                  />
                )}
                <ListingContent>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingLocation>📍 {listing.location}</ListingLocation>
                  <ListingPrice>₹{listing.price}/month</ListingPrice>
                  {listing.roomType && <Detail>Room Type: {listing.roomType}</Detail>}
                  <ViewButton onClick={() => navigate(`/pg/${listing._id}`)}>
                    View Details
                  </ViewButton>
                </ListingContent>
              </ListingCard>
            ))}
          </ResultsGrid>
        )}
      </SearchResults>
    </SearchWrapper>
  );
};

export default Search;
