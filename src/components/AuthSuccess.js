import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Store token and redirect to dashboard
      localStorage.setItem('token', token);
      if (setAuthToken) {
        setAuthToken(token);
      }
      
      // Show success message and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } else {
      // No token found, redirect to login with error
      navigate('/login?error=auth_failed');
    }
  }, [searchParams, navigate, setAuthToken]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
        <h2>Authentication Successful!</h2>
        <p>Redirecting you to your dashboard...</p>
        <div className="spinner-border text-light mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;
