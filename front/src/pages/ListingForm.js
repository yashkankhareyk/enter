import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';

const ListingForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    roomType: 'single', // default value
    availableRooms: '',
    amenities: [],
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields with proper validation
      const requiredFields = ['title', 'description', 'price', 'location', 'availableRooms'];
      requiredFields.forEach(field => {
        if (!formData[field]) {
          throw new Error(`${field} is required`);
        }
        // Convert price and availableRooms to numbers and validate
        if (field === 'price') {
          const price = Number(formData[field]);
          if (isNaN(price) || price <= 0) {
            throw new Error('Price must be a valid positive number');
          }
          formDataToSend.append(field, price);
        } else if (field === 'availableRooms') {
          const rooms = Number(formData[field]);
          if (isNaN(rooms) || rooms <= 0 || !Number.isInteger(rooms)) {
            throw new Error('Available rooms must be a valid positive integer');
          }
          formDataToSend.append(field, rooms);
        } else {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Validate and add room type separately
      const validRoomTypes = ['single', 'double', 'triple'];
      if (!validRoomTypes.includes(formData.roomType)) {
        throw new Error('Invalid room type selected');
      }
      formDataToSend.append('roomType', formData.roomType);

      // Validate images
      if (imageFiles.length === 0) {
        throw new Error('At least one image is required');
      } else if (imageFiles.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }

      // Add images
      imageFiles.forEach((file) => {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          throw new Error('Each image must be less than 5MB');
        }
        formDataToSend.append('images', file);
      });

      // Add listing type and status
      formDataToSend.append('listingType', 'accommodation');
      formDataToSend.append('status', 'pending');

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Submitting listing with data:', Object.fromEntries(formDataToSend));

      const response = await fetch(`${config.API_URL}/api/listings/create/accommodations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', errorData);
        throw new Error(errorData.message || `Failed to create listing: ${response.status}`);
      }

      const data = await response.json();
      console.log('Listing created successfully:', data);
      alert('Listing created successfully! Waiting for admin approval.');
      navigate('/owner-dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
      console.dir(error);
      alert(error.message || 'Failed to create listing. Please try again.');
    }
  };

  return (
    <FormContainer>
      <Title>Add New Listing</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title</Label>
          <Input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Price per month (₹)</Label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Room Type</Label>
          <Select
            value={formData.roomType}
            onChange={(e) => setFormData({...formData, roomType: e.target.value})}
          >
            <option value="single">Single Room</option>
            <option value="double">Double Sharing</option>
            <option value="triple">Triple Sharing</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Available Rooms</Label>
          <Input
            type="number"
            value={formData.availableRooms}
            onChange={(e) => setFormData({...formData, availableRooms: e.target.value})}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>Images (Max 5)</Label>
          <ImageUploadContainer>
            <ImageUploadButton>
              Add Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </ImageUploadButton>
            <ImagePreviewContainer>
              {previewUrls.map((url, index) => (
                <ImagePreview key={index}>
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <DeleteButton onClick={() => {
                    setImageFiles(imageFiles.filter((_, i) => i !== index));
                    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                  }}>×</DeleteButton>
                </ImagePreview>
              ))}
            </ImagePreviewContainer>
          </ImageUploadContainer>
        </FormGroup>

        <SubmitButton type="submit">Create Listing</SubmitButton>
      </Form>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImageUploadButton = styled.label`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #4B49AC;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  
  &:hover {
    background: #3f3e8f;
  }
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background: #333;
  }
`;

export default ListingForm; 