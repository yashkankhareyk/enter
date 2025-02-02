import React from 'react';
import styled from 'styled-components';

const SearchFilter = ({ filters, setFilters }) => {
  return (
    <FilterContainer>
      <FilterGroup>
        <label>Location:</label>
        <input
          type="text"
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          placeholder="Enter location"
        />
      </FilterGroup>

      <FilterGroup>
        <label>Price Range:</label>
        <select
          value={filters.priceRange}
          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
        >
          <option value="">All Prices</option>
          <option value="0-5000">₹0 - ₹5,000</option>
          <option value="5000-10000">₹5,000 - ₹10,000</option>
          <option value="10000-15000">₹10,000 - ₹15,000</option>
          <option value="15000+">₹15,000+</option>
        </select>
      </FilterGroup>

      <FilterGroup>
        <label>Room Type:</label>
        <select
          value={filters.roomType}
          onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
        </select>
      </FilterGroup>

      <FilterGroup>
        <label>Sort By:</label>
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </FilterGroup>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #666;
  }

  input, select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: #007bff;
    }
  }
`;

export default SearchFilter; 