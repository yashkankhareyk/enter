import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import CategoryIcon from '../components/common/CategoryIcon';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from '../components/navigation/AdminNavbar';
import axios from 'axios';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const HeroSection = styled.section`
  height: 500px;
  width: 100%;
  background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('/images/home.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

const CategorySection = styled.section`
  margin: 4rem 0;
  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin: 1rem 0;
  }

  p {
    color: #666;
  }
`;

const FeaturedSection = styled.section`
  margin: 4rem 0;
  h2 {
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }
`;

const ListingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ListingCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ListingImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ListingContent = styled.div`
  padding: 1.5rem;
`;

const ListingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Rating = styled.span`
  color: #28a745;
  font-weight: bold;
`;

const ViewDetailsButton = styled(Link)`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;

  &:hover {
    background: #0056b3;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/listings/restaurants');
        if (response.data.success) {
          // Get first 3 restaurants
          setFeaturedRestaurants(response.data.listings.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
      }
    };

    fetchFeaturedRestaurants();
  }, []);

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

  return (
    <>
      {user?.role === 'admin' && <AdminNavbar />}
      <HeroSection>
        <HeroContent>
          <h1>Find Your Perfect College Space</h1>
          <p>Student accommodations, dining options, and local services tailored for you</p>
          <SearchContainer>
            <SearchInput placeholder="Enter location or college name" />
            <SearchButton>Search</SearchButton>
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      <Container>
        <CategorySection>
          <h2>Popular Categories</h2>
          <CategoryGrid>
            <CategoryCard onClick={() => navigate('/accommodations')}>
              <CategoryIcon type="accommodation" />
              <h3>Accommodations</h3>
              <p>500+ listings</p>
            </CategoryCard>
            <CategoryCard onClick={() => navigate('/restaurants')}>
              <CategoryIcon type="restaurant" />
              <h3>Restaurants</h3>
              <p>200+ options</p>
            </CategoryCard>
            <CategoryCard onClick={() => navigate('/shops')}>
              <CategoryIcon type="shop" />
              <h3>Shops</h3>
              <p>300+ stores</p>
            </CategoryCard>
            <CategoryCard>
              <CategoryIcon type="mess" />
              <h3>Messes</h3>
              <p>100+ options</p>
            </CategoryCard>
          </CategoryGrid>
        </CategorySection>

        <FeaturedSection>
          <h2>Featured Listings</h2>
          <ListingGrid>
            {featuredRestaurants.map(restaurant => (
              <ListingCard key={restaurant._id}>
                <ListingImage 
                  src={getImageUrl(restaurant.images[0])} 
                  alt={restaurant.title}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                  }}
                  crossOrigin="anonymous"
                />
                <ListingContent>
                  <ListingHeader>
                    <h3>{restaurant.title}</h3>
                    <Rating>4.8 ★</Rating>
                  </ListingHeader>
                  <p>{restaurant.description}</p>
                  <ViewDetailsButton to={`/restaurants/${restaurant._id}`}>
                    View Details
                  </ViewDetailsButton>
                </ListingContent>
              </ListingCard>
            ))}
          </ListingGrid>
        </FeaturedSection>
      </Container>
    </>
  );
};

export default Home;
