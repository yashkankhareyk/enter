import React, { useState } from 'react';
import styled from 'styled-components';

const LocationInput = () => {
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleLocationInput = (e) => {
    const input = e.target.value;
    setLocation(input);

    // Check if input is a Google Maps URL
    if (input.includes('google.com/maps')) {
      try {
        // Extract coordinates from different types of Google Maps URLs
        let coords;
        if (input.includes('@')) {
          // URL format: https://www.google.com/maps/@28.7041,77.1025,15z
          coords = input.split('@')[1].split(',');
          setLatitude(coords[0]);
          setLongitude(coords[1]);
        } else if (input.includes('?q=')) {
          // URL format: https://www.google.com/maps?q=28.7041,77.1025
          coords = input.split('?q=')[1].split(',');
          setLatitude(coords[0]);
          setLongitude(coords[1]);
        }
      } catch (error) {
        console.error('Error parsing Google Maps URL:', error);
      }
    }
  };

  return (
    <FormGroup>
      <Label>Location</Label>
      <Input
        type="text"
        placeholder="Enter address or paste Google Maps link"
        value={location}
        onChange={handleLocationInput}
      />
      <CoordinatesDisplay>
        {latitude && longitude && (
          <CoordinatesText>
            📍 Coordinates: {latitude}, {longitude}
          </CoordinatesText>
        )}
      </CoordinatesDisplay>
      <HelpText>
        Tip: Share location from Google Maps and paste the link here
      </HelpText>
    </FormGroup>
  );
};

// Styled components
const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const CoordinatesDisplay = styled.div`
  margin-top: 10px;
`;

const CoordinatesText = styled.p`
  color: #4B49AC;
  font-size: 14px;
  margin: 0;
`;

const HelpText = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

export default LocationInput; 