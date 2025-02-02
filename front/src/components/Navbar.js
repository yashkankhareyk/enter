import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #666;
  &:hover {
    color: #333;
  }
`;

function Navbar() {
  const [isLoggedIn] = useState(false); // Replace with actual auth state

  return (
    <Nav>
      <Logo to="/">Campus Compass</Logo>
      <NavLinks>
        <NavLink to="/search">Find PG</NavLink>
        {isLoggedIn ? (
          <>
            <NavLink to="/student-dashboard">Dashboard</NavLink>
            <NavLink to="/profile">Profile</NavLink>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
        <NavLink to="/verify-phone">Verify Phone</NavLink>
      </NavLinks>
    </Nav>
  );
}

export default Navbar;
