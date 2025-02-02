import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.userType === 'owner' || user?.role === 'owner') {
      navigate('/owner-dashboard');
    } else if (user?.userType === 'student' || user?.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Nav>
      <NavBrand to="/">Campus Compass</NavBrand>
      
      <NavLinks>
        <NavLink to="/find-pg">Find PG</NavLink>
        
        {!user ? (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
            <NavLink to="/admin/login">Admin Login</NavLink>
          </>
        ) : (
          <>
            {user.role === 'admin' ? (
              <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
            ) : (
              <NavButton onClick={handleDashboardClick}>
                Dashboard
              </NavButton>
            )}
            <NavLink to="/profile">Profile</NavLink>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </>
        )}
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
  background: #fff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBrand = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #007bff;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

export default Navbar;
