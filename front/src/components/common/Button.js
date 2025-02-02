import styled, { css } from 'styled-components';

const Button = styled.button`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.default};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  transition: all ${props => props.theme.transitions.default};
  border: none;
  cursor: pointer;

  ${props => {
    switch (props.variant) {
      case 'outlined':
        return css`
          background: transparent;
          border: 1px solid ${props => props.theme.colors[props.color || 'primary']};
          color: ${props => props.theme.colors[props.color || 'primary']};

          &:hover {
            background: ${props => props.theme.colors[props.color || 'primary']};
            color: white;
          }
        `;
      case 'text':
        return css`
          background: transparent;
          color: ${props => props.theme.colors[props.color || 'primary']};

          &:hover {
            background: ${props => props.theme.colors.light};
          }
        `;
      default:
        return css`
          background: ${props => props.theme.colors[props.color || 'primary']};
          color: white;

          &:hover {
            opacity: 0.9;
          }
        `;
    }
  }}

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => props.disabled && css`
    opacity: 0.5;
    cursor: not-allowed;
  `}

  ${props => props.size === 'small' && css`
    padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
    font-size: ${props.theme.typography.fontSize.small};
  `}

  ${props => props.size === 'large' && css`
    padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
    font-size: ${props.theme.typography.fontSize.large};
  `}
`;

export default Button;
