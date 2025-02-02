import { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../config/firebase';
import styled from 'styled-components';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);

  // Setup reCAPTCHA
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError('reCAPTCHA expired. Please try again.');
        }
      });
    }
  };

  // Add security check
  const checkSecurityRules = async (phoneNumber) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.message || 'Security check failed');
    }
  };

  // Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!phoneNumber.match(/^\+[1-9]\d{10,14}$/)) {
        throw new Error('Please enter a valid phone number with country code (e.g., +919876543210)');
      }

      // Add security check
      await checkSecurityRules(phoneNumber);

      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setVerificationId(confirmationResult);
      setShowOTPInput(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Error sending OTP. Please try again.');
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!verificationId) {
        throw new Error('Please request OTP first');
      }

      if (!verificationCode.match(/^\d{6}$/)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      const result = await verificationId.confirm(verificationCode);
      // Handle successful verification
      console.log('Phone number verified:', result.user);
      
      // You can redirect or update UI here
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Phone Verification</Title>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {!showOTPInput ? (
        <Form onSubmit={handleSendOTP}>
          <InputGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+919876543210"
              disabled={loading}
              required
            />
          </InputGroup>
          
          <div id="recaptcha-container"></div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </Button>
        </Form>
      ) : (
        <Form onSubmit={handleVerifyOTP}>
          <InputGroup>
            <Label>Enter OTP</Label>
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              disabled={loading}
              required
            />
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          
          <ResendButton 
            type="button" 
            onClick={() => {
              setShowOTPInput(false);
              setVerificationCode('');
            }}
            disabled={loading}
          >
            Resend OTP
          </ResendButton>
        </Form>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #666;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
  
  &:disabled {
    background-color: #f5f5f5;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ResendButton = styled(Button)`
  background-color: transparent;
  color: #4CAF50;
  border: 1px solid #4CAF50;
  
  &:hover:not(:disabled) {
    background-color: #f0f8f0;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
  text-align: center;
`;

export default PhoneAuth; 