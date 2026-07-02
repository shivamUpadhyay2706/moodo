import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { showToast } from '../../util/sonner';
import { useState } from 'react';

export const useDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    showToast.success('Logged out successfully! See you soon. 🔐');
    navigate('/auth');
  };

  const currentPath = location.pathname;

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return {
    user,
    currentPath,
    handleLogout,
    isMobileOpen,
    toggleMobileSidebar,
  };
};
