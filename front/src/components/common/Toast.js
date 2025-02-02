import React from 'react';
import styled, { keyframes } from 'styled-components';

const Toast = ({ message, type = 'success', onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastContainer type={type}>
      <Message>{message}</Message>
      <CloseButton onClick={onClose}>&times;</CloseButton>
    </ToastContainer>
  );
};

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  padding: 1rem;
  background: ${props => props.type === 'success' ? '#28a745' : '#dc3545'};
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${slideIn} 0.3s ease;
  z-index: 1000;
`;

const Message = styled.p`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

export default Toast; 