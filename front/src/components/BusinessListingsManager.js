import React, { useState } from 'react';
import styled from 'styled-components';

const BusinessListingsManager = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    // ... other existing fields
  });

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.location) {
      return false;
    }
    
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return false;
      }
    }
    
    return true;
  };

  // Update your existing form fields
  const renderFormFields = () => {
    return (
      <>
        <FormGroup>
          <Label>Location</Label>
          <Input
            type="text"
            name="location"
            placeholder="Enter address or paste Google Maps link"
            value={formData.location || ''}
            onChange={handleLocationInput}
            style={{ marginBottom: '5px' }}
          />
          {formData.location?.includes('maps') && (
            <LocationLink 
              href={formData.location}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                fontSize: '12px',
                color: '#4B49AC',
                marginTop: '5px',
                textDecoration: 'none'
              }}
            >
              📍 View on Google Maps
            </LocationLink>
          )}
          {formData.latitude && formData.longitude && (
            <CoordinatesText>
              📍 Coordinates: {formData.latitude}, {formData.longitude}
            </CoordinatesText>
          )}
          <HelpText>
            Tip: Share location from Google Maps and paste the link here
          </HelpText>
        </FormGroup>
      </>
    );
  };

  return (
    <div>
      {/* ... rest of your existing component code ... */}
    </div>
  );
};

// Add these styled components if not already present
const CoordinatesText = styled.p`
  color: #4B49AC;
  font-size: 14px;
  margin: 8px 0;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const LocationLink = styled.a`
  &:hover {
    text-decoration: underline;
  }
`;

export default BusinessListingsManager; 