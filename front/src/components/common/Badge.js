import styled, { css } from 'styled-components';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.typography.fontSize.small};
  font-weight: ${props => props.theme.typography.fontWeight.medium};

  ${props => {
    const color = props.theme.colors[props.variant || 'primary'];
    return css`
      background: ${color}20;
      color: ${color};
    `;
  }}
`;

export default Badge; 