import styled from 'styled-components';

const IconWrapper = styled.div`
  font-size: 2rem; /* Adjust size as needed */
`;

const CategoryIcon = ({ children }) => {
  return <IconWrapper>{children}</IconWrapper>;
};

export default CategoryIcon; 