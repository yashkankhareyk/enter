import styled from 'styled-components';
import Button from '../common/Button';

const FiltersWrapper = styled.div`
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SearchFilters = ({ filters, setFilters }) => {
  return (
    <FiltersWrapper>
      <FilterGroup>
        <select
          value={filters.priceRange}
          onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
        >
          <option value="">Price Range</option>
          <option value="5000">₹0 - ₹5,000</option>
          <option value="10000">₹5,000 - ₹10,000</option>
          <option value="15000">₹10,000+</option>
        </select>
        <Button primary onClick={() => console.log('Applying filters:', filters)}>
          Apply Filters
        </Button>
      </FilterGroup>
    </FiltersWrapper>
  );
};

export default SearchFilters;
