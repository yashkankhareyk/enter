import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import config from '../config/config';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  input, select, textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  textarea {
    height: 100px;
  }
`;

const TypeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #4B49AC;
    background: white;
    color: #4B49AC;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      background: #4B49AC;
      color: white;
    }

    &:hover {
      background: #4B49AC;
      color: white;
    }
  }
`;

const SubmitButton = styled.button`
  background: #4B49AC;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #3f3e8f;
  }
`;

const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background: #cc0000;
  }
`;

const Card = styled.div`
  background: white;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 150px;
  margin-bottom: 1rem;
  border-radius: 4px;
  overflow: hidden;
`;

const ListingImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 1rem;
`;

const Title = styled.h3`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Detail = styled.p`
  margin-bottom: 0.5rem;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 0.5rem;
`;

const Status = styled.span`
  text-transform: capitalize;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  ${props => {
    switch (props.status) {
      case 'approved':
        return 'background: #e6f4ea; color: #1e7e34;';
      case 'pending':
        return 'background: #fff3cd; color: #856404;';
      case 'rejected':
        return 'background: #f8d7da; color: #721c24;';
      default:
        return '';
    }
  }}
`;

const CardActions = styled.div`
  padding: 1rem;
  border-top: 1px solid #ddd;
`;

const ListingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const NoListings = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  grid-column: 1 / -1;
`;

const ListingCard = ({ listing, onDelete }) => {
  return (
    <Card>
      <ImageContainer>
        <ListingImage src={`http://localhost:5001${listing.images[0]}`} alt={listing.title} />
      </ImageContainer>
      <CardContent>
        <Title>{listing.title}</Title>
        <Detail><Label>Type:</Label> {listing.constructor.modelName}</Detail>
        <Detail><Label>Location:</Label> {listing.location}</Detail>
        <Detail><Label>Status:</Label> <Status status={listing.status}>{listing.status}</Status></Detail>
        {listing.status === 'rejected' && listing.rejectionReason && (
          <Detail><Label>Rejection Reason:</Label> {listing.rejectionReason}</Detail>
        )}
      </CardContent>
      <CardActions>
        <DeleteButton onClick={() => onDelete(listing._id)}>Delete</DeleteButton>
      </CardActions>
    </Card>
  );
};

const BusinessListingsManager = () => {
  const [listingType, setListingType] = useState('restaurants');
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    cuisineType: [],
    priceRange: 'budget',
    openingHours: '',
    shopType: 'stationery',
    monthlyPrice: '',
    mealTypes: { breakfast: false, lunch: false, dinner: false },
    availableSeats: ''
  });
  const [listings, setListings] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles([...imageFiles, ...files]);

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => {
      URL.revokeObjectURL(prevUrls[index]);
      return prevUrls.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add images
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });

      // Make the API request
      const response = await fetch(`${config.API_URL}/api/listings/create/${listingType}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create listing');
      }

      const data = await response.json();
      console.log('Listing created successfully:', data);
      
      // Reset form and show success message
      setFormData({
        title: '',
        description: '',
        location: '',
        cuisineType: [],
        priceRange: 'budget',
        openingHours: '',
        shopType: 'stationery',
        monthlyPrice: '',
        mealTypes: { breakfast: false, lunch: false, dinner: false },
        availableSeats: ''
      });
      setImageFiles([]);
      setPreviewUrls([]);
      
      alert('Listing created successfully!');

    } catch (error) {
      console.error('Error creating listing:', error);
      alert(error.message || 'Failed to create listing. Please try again.');
    }
  };

  const fetchListings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/listings`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      // Combine all types of listings into a single array
      const allListings = [
        ...(data.listings.accommodations || []),
        ...(data.listings.restaurants || []),
        ...(data.listings.shops || []),
        ...(data.listings.messes || [])
      ];
      setListings(allListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const renderFormFields = () => {
    const commonFields = (
      <>
        <FormGroup>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </FormGroup>
        <FormGroup>
          <label>Images (Max 5):</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            required={imageFiles.length === 0}
          />
          <ImagePreviewContainer>
            {previewUrls.map((url, index) => (
              <ImagePreview key={index}>
                <img src={url} alt={`Preview ${index + 1}`} />
                <DeleteButton onClick={() => removeImage(index)}>×</DeleteButton>
              </ImagePreview>
            ))}
          </ImagePreviewContainer>
        </FormGroup>
      </>
    );

    let specificFields = null;

    switch(listingType) {
      case 'restaurants':
        specificFields = (
          <>
            <FormGroup>
              <label>Cuisine Types (comma-separated):</label>
              <input
                type="text"
                value={formData.cuisineType.join(',')}
                onChange={(e) => setFormData({...formData, cuisineType: e.target.value.split(',')})}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Price Range:</label>
              <select
                value={formData.priceRange}
                onChange={(e) => setFormData({...formData, priceRange: e.target.value})}
                required
              >
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="expensive">Expensive</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Opening Hours:</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
                required
              />
            </FormGroup>
          </>
        );
        break;

      case 'shops':
        specificFields = (
          <>
            <FormGroup>
              <label>Shop Type:</label>
              <select
                value={formData.shopType}
                onChange={(e) => setFormData({...formData, shopType: e.target.value})}
                required
              >
                <option value="stationery">Stationery</option>
                <option value="grocery">Grocery</option>
                <option value="electronics">Electronics</option>
                <option value="other">Other</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Opening Hours:</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
                required
              />
            </FormGroup>
          </>
        );
        break;

      case 'messes':
        specificFields = (
          <>
            <FormGroup>
              <label>Monthly Price:</label>
              <input
                type="number"
                value={formData.monthlyPrice}
                onChange={(e) => setFormData({...formData, monthlyPrice: e.target.value})}
                required
              />
            </FormGroup>
            <FormGroup>
              <label>Meal Types:</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {Object.keys(formData.mealTypes).map(meal => (
                  <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.mealTypes[meal]}
                      onChange={(e) => setFormData({
                        ...formData,
                        mealTypes: {
                          ...formData.mealTypes,
                          [meal]: e.target.checked
                        }
                      })}
                    />
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </label>
                ))}
              </div>
            </FormGroup>
            <FormGroup>
              <label>Available Seats:</label>
              <input
                type="number"
                value={formData.availableSeats}
                onChange={(e) => setFormData({...formData, availableSeats: e.target.value})}
                required
              />
            </FormGroup>
          </>
        );
        break;

      default:
        specificFields = null;
    }

    return (
      <>
        {commonFields}
        {specificFields}
      </>
    );
  };

  const handleDeleteListing = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/listings/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      fetchListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  return (
    <Container>
      <h2>Add Business Listing</h2>
      <TypeSelector>
        <button
          type="button"
          className={listingType === 'restaurants' ? 'active' : ''}
          onClick={() => setListingType('restaurants')}
        >
          Restaurant
        </button>
        <button
          type="button"
          className={listingType === 'shops' ? 'active' : ''}
          onClick={() => setListingType('shops')}
        >
          Shop
        </button>
        <button
          type="button"
          className={listingType === 'messes' ? 'active' : ''}
          onClick={() => setListingType('messes')}
        >
          Mess
        </button>
      </TypeSelector>
      <Form onSubmit={handleSubmit}>
        {renderFormFields()}
        <SubmitButton type="submit">Add Listing</SubmitButton>
      </Form>
      <h2>Your Listings</h2>
      <ListingsGrid>
        {Array.isArray(listings) && listings.length > 0 ? (
          listings.map(listing => (
            <ListingCard key={listing._id} listing={listing} onDelete={handleDeleteListing} />
          ))
        ) : (
          <NoListings>No listings found</NoListings>
        )}
      </ListingsGrid>
    </Container>
  );
};

export default BusinessListingsManager; 