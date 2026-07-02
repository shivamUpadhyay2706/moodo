import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginMutation, registerMutation } from '../../api';
import { setCredentials, setLoading } from '../../redux/slices/authSlice';
import { showToast } from '../../util/sonner';

export const useAuth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
  };

  const handleLoginSubmit = async (values, { resetForm }) => {
    dispatch(setLoading(true));
    const toastId = showToast.loading('Signing in... 🔒');
    try {
      const response = await loginMutation(values.username, values.password);
      
      // Decoded payload structure from JWT / backend is usually token and user info.
      // The backend returns: { message: "Login successful! 🔓", token }
      // Let's decode or simply parse the token, or since we don't have a decode library, we can store username & token.
      // Wait, let's mock a payload of user. We can retrieve the userId if we inspect the decoded token,
      // but since we know the username is what they logged in with, we can store { username: values.username }.
      // Wait, the backend returns:
      // return { message: "Login successful! 🔓", token };
      // Can we fetch user information? The backend does not have a /me endpoint, but the token is signed with { userId: user._id }
      // Let's store user: { username: values.username } in redux state.
      const userData = { username: values.username };
      dispatch(setCredentials({ user: userData, token: response.token }));
      
      showToast.dismiss(toastId);
      showToast.success(`Welcome back, ${values.username}! ⚡`);
      resetForm();
      navigate('/');
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Login failed ❌');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegisterSubmit = async (values, { resetForm }) => {
    dispatch(setLoading(true));
    const toastId = showToast.loading('Creating account... 🚀');
    try {
      await registerMutation(values.username, values.password);
      showToast.dismiss(toastId);
      showToast.success('Account created successfully! Log in now. 🎉');
      resetForm();
      setIsLoginMode(true); // Switch to login screen
    } catch (error) {
      showToast.dismiss(toastId);
      showToast.error(error.message || 'Registration failed ❌');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    isLoginMode,
    toggleMode,
    loading,
    handleLoginSubmit,
    handleRegisterSubmit,
  };
};
