import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const OwnerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    contactNumber: user?.phone || '',
    businessName: user?.businessName || '',
    businessAddress: user?.businessAddress || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle profile update logic
  };

  return (
    <ProfileContainer>
      <LogoContainer>
        <Logo>LOGO</Logo>
      </LogoContainer>

      <Header>
        <Title>My Profile</Title>
        <Subtitle>Manage your business information</Subtitle>
      </Header>

      <FormCard>
        <ProfileImageSection>
          <ProfileImage>
            <img src={user?.profileImage || '/default-avatar.png'} alt="Profile" />
            <UploadButton>
              <input type="file" accept="image/*" style={{ display: 'none' }} />
              <span>📷</span>
            </UploadButton>
          </ProfileImage>
        </ProfileImageSection>

        <FormSection>
          <FormGroup>
            <Label>Full Name</Label>
            <InputGroup>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <InputGroup>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Contact Number</Label>
            <InputGroup>
              <Input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Business Name</Label>
            <InputGroup>
              <Input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Business Address</Label>
            <InputGroup>
              <Input
                type="text"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              />
              <EditIcon>✏️</EditIcon>
            </InputGroup>
          </FormGroup>

          <SaveButton onClick={handleSubmit}>
            Save Changes
          </SaveButton>
        </FormSection>
      </FormCard>
    </ProfileContainer>
  );
};

// Shared styled components
const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
`;

const LogoContainer = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4B49AC;
`;

const ProfileImageSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UploadButton = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: black;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FormSection = styled.div`
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
  color: #333;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4B49AC;
  }
`;

const EditIcon = styled.span`
  position: absolute;
  right: 1rem;
  color: #666;
  cursor: pointer;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: black;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;

  &:hover {
    background: #333;
  }
`;

export default OwnerProfile; 