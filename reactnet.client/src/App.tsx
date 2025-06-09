import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/login';
import { useAuthStore } from './stores/authStore';
import authService from './services/authService';
import HomePage from './pages/home';
import Layout from './layout/_layout';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated, setUser } = useAuthStore();

  // Check if user is logged in on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUser(user);
        }
      } catch (error) {
        // User is not authenticated
        console.log('User not authenticated');
      }
    };

    checkAuthStatus();
  }, [setUser]);

  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />
          } />
          
          {/* Authenticated routes with Layout */}
          <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/home" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
