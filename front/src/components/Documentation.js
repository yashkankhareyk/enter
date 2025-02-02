import React from 'react';
import styled from 'styled-components';
import { devices } from '../styles/responsive';

const Documentation = () => {
  return (
    <DocContainer>
      <DocSection>
        <h1>Campus Compass Documentation</h1>
        
        <DocBlock>
          <h2>Getting Started</h2>
          <p>Campus Compass is a platform that connects students with PG accommodations near their campus.</p>
        </DocBlock>

        <DocBlock>
          <h2>Features</h2>
          <ul>
            <li>User Authentication (Student/Owner)</li>
            <li>PG Listing Management</li>
            <li>Booking System</li>
            <li>Search and Filters</li>
            <li>Review System</li>
            <li>Profile Management</li>
          </ul>
        </DocBlock>

        <DocBlock>
          <h2>User Roles</h2>
          <h3>Students</h3>
          <ul>
            <li>Search for PGs</li>
            <li>View PG details</li>
            <li>Book PGs</li>
            <li>Write reviews</li>
            <li>Manage profile</li>
          </ul>

          <h3>Owners</h3>
          <ul>
            <li>Manage PG listings</li>
            <li>Handle booking requests</li>
            <li>Update PG information</li>
            <li>Manage profile</li>
          </ul>
        </DocBlock>

        <DocBlock>
          <h2>Technical Stack</h2>
          <ul>
            <li>Frontend: React.js with Styled Components</li>
            <li>Backend: Node.js with Express</li>
            <li>Database: MongoDB</li>
            <li>Authentication: JWT</li>
            <li>Image Storage: Cloudinary</li>
          </ul>
        </DocBlock>
      </DocSection>
    </DocContainer>
  );
};

const DocContainer = styled.div`
  max-width: ${props => props.theme.containerWidths.desktop};
  margin: 0 auto;
  padding: 2rem;

  ${devices.tablet} {
    padding: 3rem;
  }
`;

const DocSection = styled.section`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
`;

const DocBlock = styled.div`
  margin-bottom: 2rem;

  h2 {
    color: #007bff;
    margin-bottom: 1rem;
  }

  h3 {
    color: #666;
    margin: 1rem 0;
  }

  ul {
    list-style-type: none;
    padding-left: 1rem;

    li {
      margin-bottom: 0.5rem;
      position: relative;

      &:before {
        content: "•";
        color: #007bff;
        position: absolute;
        left: -1rem;
      }
    }
  }
`;

export default Documentation; 