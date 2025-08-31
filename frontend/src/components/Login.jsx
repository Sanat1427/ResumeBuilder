import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import { authStyles as styles } from '../assets/dummystyle';
import { validateEmail } from '../utils/helper';

// 👇 import your Input component (adjust the path as needed)
import Input from '../components/Input';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('🚀 Login button clicked');

    // ✅ Validation
    if (!validateEmail(email)) {
      console.log('❌ Invalid email format');
      setError('Please enter a valid email');
      return;
    }

    if (!password) {
      console.log('❌ Password is empty');
      setError('Please enter password');
      return;
    }

    setError('');
    try {
      console.log('📡 Sending login request to:', API_PATHS.AUTH.LOGIN);
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, { email, password });
      console.log('✅ Response received:', response.data);

      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
        console.log('🔑 Token stored in localStorage');

        try {
          updateUser(response.data);
          console.log('👤 User context updated');
        } catch (ctxErr) {
          console.error('⚠️ Failed to update user context:', ctxErr);
        }

        navigate('/dashboard');
        console.log('➡️ Navigated to /dashboard');
      } else {
        console.warn('⚠️ No token found in response');
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.message || 'Something went wrong, please try again');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>Welcome Back</h3>
        <p className={styles.subtitle}>
          Sign in to continue building amazing resumes
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin} className={styles.form}>
        <Input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email"
          placeholder="services@gmail.com"
          type="email"
        />
        <Input
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 characters"
          type="password"
        />

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button type="submit" className={styles.submitButton}>
          Sign In
        </button>

        <p className={styles.switchText}>
          Don't have an account{' '}
          <button
            type="button"
            onClick={() => setCurrentPage('signup')}
            className={styles.switchButton}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
