import { useAuthStore } from '../stores/authStore';
import { Outlet, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Layout = () => {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logoutStore();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-8 flex justify-between items-center">
        <h1 className="text-slate-800 text-xl font-bold m-0">Suris React/Net Challenge | Calendar</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-700 text-sm">Welcome, {user?.firstName || user?.email || 'User'}</span>
          <button 
            onClick={handleLogout} 
            className="bg-red-500 text-white text-sm py-2 px-4 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="flex-1 p-8 flex flex-col items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 