import { useState } from 'react';
import styled from 'styled-components';
import SearchFilters from '../components/accommodation/SearchFilters';

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

const Search = () => {
  const [filters, setFilters] = useState({
    priceRange: '',
    distance: ''
  });

  return (
    <SearchWrapper>
      <Title>Find Your Perfect PG</Title>
      <SearchFilters filters={filters} setFilters={setFilters} />
      <SearchResults>
        {/* Render PG cards */}
      </SearchResults>
    </SearchWrapper>
  );
};

export default Search;
