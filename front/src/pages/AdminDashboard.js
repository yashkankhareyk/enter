import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import BusinessListingsManager from './BusinessListingsManager';
import PendingApprovals from '../components/admin/PendingApprovals';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    totalReviews: 0
  });
  const [activities, setActivities] = useState({
    recentBookings: [],
    recentUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const adminToken = localStorage.getItem('adminToken');

        // Fetch stats
        const statsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        // Fetch activities
        const activitiesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/activities`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        setStats(statsResponse.data);
        setActivities(activitiesResponse.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  if (loading) {
    return <LoadingMessage>Loading dashboard data...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  const renderDashboard = () => (
    <DashboardContainer>
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Users</StatTitle>
          <StatValue>{stats.totalUsers}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Listings</StatTitle>
          <StatValue>{stats.totalListings}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Bookings</StatTitle>
          <StatValue>{stats.totalBookings}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Reviews</StatTitle>
          <StatValue>{stats.totalReviews}</StatValue>
        </StatCard>
      </StatsGrid>

      <ActivitySection>
        <h2>Recent Activities</h2>
        <ActivityGrid>
          <ActivityCard>
            <h3>Recent Bookings</h3>
            {activities.recentBookings.map((booking) => (
              <ActivityItem key={booking._id}>
                <span>{booking.user?.name}</span> booked{' '}
                <span>{booking.listing?.title}</span>
              </ActivityItem>
            ))}
          </ActivityCard>
          <ActivityCard>
            <h3>New Users</h3>
            {activities.recentUsers.map((user) => (
              <ActivityItem key={user._id}>
                <span>{user.name}</span> joined
              </ActivityItem>
            ))}
          </ActivityCard>
        </ActivityGrid>
      </ActivitySection>
    </DashboardContainer>
  );

  return (
    <Container>
      <TabContainer>
        <Tab
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </Tab>
        <Tab
          className={activeTab === 'listings' ? 'active' : ''}
          onClick={() => setActiveTab('listings')}
        >
          Manage Listings
        </Tab>
        <Tab
          className={activeTab === 'approvals' ? 'active' : ''}
          onClick={() => setActiveTab('approvals')}
        >
          Pending Approvals
        </Tab>
      </TabContainer>

      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'listings' && <BusinessListingsManager />}
      {activeTab === 'approvals' && <PendingApprovals />}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  font-size: 1.2rem;
`;

const DashboardContainer = styled.div`
  margin-top: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatTitle = styled.h3`
  margin: 0;
  color: #666;
  font-size: 1rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4B49AC;
  margin-top: 0.5rem;
`;

const ActivitySection = styled.section`
  margin-top: 2rem;
  
  h2 {
    margin-bottom: 1rem;
    color: #333;
  }
`;

const ActivityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const ActivityCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
`;

const ActivityItem = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }

  span {
    color: #4B49AC;
    font-weight: 500;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background: ${props => props.className === 'active' ? '#4B49AC' : '#fff'};
  color: ${props => props.className === 'active' ? '#fff' : '#4B49AC'};
  border: 1px solid #4B49AC;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4B49AC;
    color: white;
  }
`;

export default AdminDashboard;
