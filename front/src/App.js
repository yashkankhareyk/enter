import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { applyBrowserFixes } from './utils/browserSupport';
import styled, { ThemeProvider } from 'styled-components';
import theme from './styles/theme';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import OwnerDashboard from './pages/OwnerDashboard';
import StudentDashboard from './pages/StudentDashboard';
import PGDetails from './pages/PGDetails';
import FindPG from './pages/FindPG';
import ListingForm from './pages/ListingForm';
import Documentation from './components/Documentation';
import Profile from './pages/Profile';
import AccountType from './pages/AccountType';
import StudentProfile from './pages/StudentProfile';
import OwnerProfile from './pages/OwnerProfile';
import Accommodations from './pages/Accommodations';
import Restaurants from './pages/Restaurants';
import Shops from './pages/Shops';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDetail from './pages/RestaurantDetail';
import BusinessListingsManager from './pages/BusinessListingsManager';
import ShopDetail from './pages/ShopDetail';

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/login" element={<AccountType isLogin={true} />} />
      <Route path="/login/student" element={<Login userType="student" />} />
      <Route path="/login/owner" element={<Login userType="owner" />} />
      <Route path="/register" element={<AccountType />} />
      <Route path="/register/student" element={<Register userType="student" />} />
      <Route path="/register/owner" element={<Register userType="owner" />} />
      <Route path="/find-pg" element={<FindPG />} />
      <Route path="/pg/:id" element={<PGDetails />} />
      <Route path="/accommodations" element={<Accommodations />} />
      <Route path="/restaurants" element={<Restaurants />} />
      <Route path="/restaurants/:id" element={<RestaurantDetail />} />
      <Route path="/shops" element={<Shops />} />
      <Route path="/shops/:id" element={<ShopDetail />} />
      
      {/* Protected Routes */}
      <Route 
        path="/owner-dashboard" 
        element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-business" 
        element={
          <ProtectedRoute requiredRole="owner">
            <BusinessListingsManager />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-dashboard" 
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/add-listing" 
        element={
          <ProtectedRoute>
            <ListingForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/edit-listing/:id" 
        element={
          <ProtectedRoute requiredRole="owner">
            <ListingForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            {user?.userType === 'student' ? <StudentProfile /> : <OwnerProfile />}
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default function App() {
  useEffect(() => {
    applyBrowserFixes();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <LoadingProvider>
        <AuthProvider>
          <AppContainer>
            <Navbar />
            <MainContent>
              <AppRoutes />
            </MainContent>
            <Footer />
          </AppContainer>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  
  ${props => props.theme.devices.tablet} {
    padding: 3rem;
  }
`;
