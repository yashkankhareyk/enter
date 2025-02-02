import React from 'react';
import styled from 'styled-components';

const Error = ({ message }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorMessage>{message || 'An error occurred'}</ErrorMessage>
    </ErrorContainer>
  );
};

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: #fff3f3;
  border-radius: 8px;
  margin: 1rem;
`;

const ErrorIcon = styled.span`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #dc3545;
  text-align: center;
`;

export default Error; 