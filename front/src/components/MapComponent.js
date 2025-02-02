import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import { useNavigate } from 'react-router-dom';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
});

// Component to handle map recentering
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

const MapComponent = ({ listings, latitude, longitude, title }) => {
  const navigate = useNavigate();
  const [center, setCenter] = useState([28.7041, 77.1025]); // Default to Delhi
  const [mapListings, setMapListings] = useState([]);

  useEffect(() => {
    // Handle single listing case
    if (latitude && longitude) {
      setCenter([parseFloat(latitude), parseFloat(longitude)]);
      setMapListings([{ 
        _id: 'single',
        latitude,
        longitude,
        title,
      }]);
      return;
    }

    // Handle multiple listings case
    if (listings && listings.length > 0) {
      const validListings = listings.filter(
        listing => listing.latitude && listing.longitude
      );
      setMapListings(validListings);

      if (validListings.length > 0) {
        setCenter([
          parseFloat(validListings[0].latitude),
          parseFloat(validListings[0].longitude)
        ]);
      }
    }
  }, [listings, latitude, longitude, title]);

  if (!mapListings.length) {
    return <ErrorMessage>No locations available to display</ErrorMessage>;
  }

  return (
    <MapWrapper>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '400px', width: '100%', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          crossOrigin="anonymous"
        />
        {mapListings.map((listing) => (
          <Marker 
            key={listing._id}
            position={[parseFloat(listing.latitude), parseFloat(listing.longitude)]}
          >
            <Popup>
              <PopupContent>
                <PopupTitle>{listing.title}</PopupTitle>
                {listing._id !== 'single' && listing.price && (
                  <PopupPrice>₹{listing.price}/month</PopupPrice>
                )}
                {listing._id !== 'single' && (
                  <ViewButton onClick={() => navigate(`/pg/${listing._id}`)}>
                    View Details
                  </ViewButton>
                )}
              </PopupContent>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

const MapWrapper = styled.div`
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
`;

const ErrorMessage = styled.div`
  padding: 20px;
  background-color: #fff3cd;
  color: #856404;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
`;

const PopupContent = styled.div`
  padding: 5px;
  text-align: center;
`;

const PopupTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
`;

const PopupPrice = styled.p`
  margin: 5px 0;
  color: #4B49AC;
  font-weight: bold;
`;

const ViewButton = styled.button`
  background: #4B49AC;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 5px;
  
  &:hover {
    background: #3f3e8f;
  }
`;

export default MapComponent; 