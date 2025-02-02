import styled, { css } from 'styled-components';

const Input = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 1px solid ${props => props.error ? props.theme.colors.danger : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.default};
  font-size: ${props => props.theme.typography.fontSize.base};
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }

  ${props => props.error && css`
    background-color: ${props.theme.colors.danger}10;
  `}

  &:disabled {
    background-color: ${props => props.theme.colors.light};
    cursor: not-allowed;
  }
`;

export const TextArea = styled(Input).attrs({ as: 'textarea' })`
  min-height: 100px;
  resize: vertical;
`;

export const Select = styled(Input).attrs({ as: 'select' })`
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23333' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${props => props.theme.spacing.md} center;
  padding-right: ${props => props.theme.spacing.xl};
`;

export default Input;
