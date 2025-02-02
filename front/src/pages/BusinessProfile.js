import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const BusinessProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shopName: '',
    shopCategory: '',
    businessLicense: '',
    location: '',
    shopPhotos: []
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        shopName: user.shopName || '',
        shopCategory: user.shopCategory || '',
        businessLicense: user.businessLicense || '',
        location: user.location || '',
        shopPhotos: user.shopPhotos || []
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.put('/users/business-profile', formData);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('shopPhotos', file);
    });

    try {
      setLoading(true);
      const response = await api.post('/users/business-profile/photos', formData);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError('Photo upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContainer>
      <Title>My Business Profile</Title>
      <Subtitle>✨ Customize your business presence and manage your shop details</Subtitle>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>Personal Information</SectionTitle>
          <ProfileImageSection>
            <ProfileImage>
              <img src={user?.profileImage || '/default-avatar.png'} alt="Profile" />
              <UploadButton>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <span>📷</span>
              </UploadButton>
            </ProfileImage>
          </ProfileImageSection>

          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <EditIcon>✏️</EditIcon>
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <EditIcon>✏️</EditIcon>
          </FormGroup>

          <FormGroup>
            <Label>Contact Number</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <EditIcon>✏️</EditIcon>
          </FormGroup>
        </Section>

        <Section>
          <SectionTitle>Shop Details</SectionTitle>
          <FormGroup>
            <Label>Shop Name</Label>
            <Input
              type="text"
              value={formData.shopName}
              onChange={(e) => setFormData({...formData, shopName: e.target.value})}
            />
            <EditIcon>✏️</EditIcon>
          </FormGroup>

          <FormGroup>
            <Label>Shop Category</Label>
            <Input
              type="text"
              value={formData.shopCategory}
              onChange={(e) => setFormData({...formData, shopCategory: e.target.value})}
            />
            <EditIcon>✏️</EditIcon>
          </FormGroup>

          <FormGroup>
            <Label>Business License Number</Label>
            <Input
              type="text"
              value={formData.businessLicense}
              onChange={(e) => setFormData({...formData, businessLicense: e.target.value})}
            />
            <EditIcon>✏️</EditIcon>
          </FormGroup>

          <FormGroup>
            <Label>Shop Location</Label>
            <Input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <LocationIcon>📍</LocationIcon>
          </FormGroup>

          <PhotosSection>
            <Label>Shop Photos</Label>
            <PhotosGrid>
              {formData.shopPhotos.map((photo, index) => (
                <PhotoCard key={index}>
                  <img src={photo} alt={`Shop ${index + 1}`} />
                  <DeletePhotoButton>✖</DeletePhotoButton>
                </PhotoCard>
              ))}
              <AddPhotoCard>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
                <span>+</span>
              </AddPhotoCard>
            </PhotosGrid>
          </PhotosSection>
        </Section>

        <SaveButton type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes & Update Profile'}
        </SaveButton>
      </Form>
    </ProfileContainer>
  );
};

// Styled components remain the same as in your image
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

// ... (rest of the styled components)

export default BusinessProfile; 