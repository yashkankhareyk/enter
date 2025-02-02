import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AccountType = ({ isLogin = false }) => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <FormCard>
        <Title>{isLogin ? 'Login to Your Account' : 'Create Your Account'}</Title>
        <Subtitle>Choose your account type to {isLogin ? 'login' : 'get started'}</Subtitle>

        <CardsContainer>
          <AccountCard>
            <IconContainer>
              <StudentIcon>👨‍🎓</StudentIcon>
            </IconContainer>
            <CardTitle>{isLogin ? 'Login as Student' : 'Sign up as Student'}</CardTitle>
            <CardDescription>
              Find accommodations and services near your campus
            </CardDescription>
            <ContinueButton onClick={() => navigate(isLogin ? '/login/student' : '/register/student')}>
              Continue as Student
            </ContinueButton>
          </AccountCard>

          <AccountCard>
            <IconContainer>
              <OwnerIcon>🏢</OwnerIcon>
            </IconContainer>
            <CardTitle>{isLogin ? 'Login as Owner' : 'Sign up as Owner'}</CardTitle>
            <CardDescription>
              List your property or business for students
            </CardDescription>
            <ContinueButton onClick={() => navigate(isLogin ? '/login/owner' : '/register/owner')}>
              Continue as Owner
            </ContinueButton>
          </AccountCard>
        </CardsContainer>
      </FormCard>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f5f5f5;
`;

const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AccountCard = styled.div`
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const IconContainer = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const StudentIcon = styled.span``;
const OwnerIcon = styled.span``;

const CardTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

const CardDescription = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
`;

const ContinueButton = styled.button`
  background: #000;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #333;
  }
`;

export default AccountType; 