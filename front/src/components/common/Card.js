import styled, { css } from 'styled-components';

const Card = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.borderRadius.default};
  box-shadow: ${props => props.theme.shadows.default};
  padding: ${props => props.theme.spacing.lg};
  transition: transform ${props => props.theme.transitions.default};

  ${props => props.hoverable && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${props.theme.shadows.large};
    }
  `}

  ${props => props.clickable && css`
    cursor: pointer;
  `}
`;

export const CardHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: ${props => props.theme.spacing.md};
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.text};
`;

export const CardBody = styled.div`
  color: ${props => props.theme.colors.text};
`;

export const CardFooter = styled.div`
  margin-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
  padding-top: ${props => props.theme.spacing.md};
`;

export default Card;
