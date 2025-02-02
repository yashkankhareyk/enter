import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  gap: ${props => props.gap || props.theme.spacing.md};
  grid-template-columns: repeat(
    auto-fit,
    minmax(${props => props.minWidth || '300px'}, 1fr)
  );
`;

export const Container = styled.div`
  width: 100%;
  max-width: ${props => props.theme.containerWidths.desktop};
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};

  ${props => props.theme.devices.tablet} {
    padding: 0 ${props => props.theme.spacing.lg};
  }
`;

export const Flex = styled.div`
  display: flex;
  gap: ${props => props.gap || props.theme.spacing.md};
  align-items: ${props => props.alignItems || 'center'};
  justify-content: ${props => props.justifyContent || 'flex-start'};
  flex-wrap: ${props => props.wrap || 'wrap'};
  flex-direction: ${props => props.direction || 'row'};
`; 