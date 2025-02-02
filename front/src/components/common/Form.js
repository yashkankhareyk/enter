import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

export const Label = styled.label`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

export const ErrorMessage = styled.span`
  color: ${props => props.theme.colors.danger};
  font-size: ${props => props.theme.typography.fontSize.small};
`;

export const HelperText = styled.span`
  color: ${props => props.theme.colors.secondary};
  font-size: ${props => props.theme.typography.fontSize.small};
`; 