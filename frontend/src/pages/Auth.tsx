import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggle = () => {
      setIsLogin(!isLogin);
      setErrorMessage('');
    };

    document.addEventListener('toggle-auth', handleToggle);

    return () => {
      document.removeEventListener('toggle-auth', handleToggle);
    };
  }, [isLogin]);

  const handleLogin = async (email: string, password: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.token) {
        login(data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage('Failed to connect to authentication service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (data.token) {
        login(data.token);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage('Failed to connect to authentication service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md py-10">
      {isLogin ? (
        <LoginForm onSubmit={handleLogin} errorMessage={errorMessage} isLoading={isLoading} />
      ) : (
        <RegisterForm onSubmit={handleRegister} errorMessage={errorMessage} isLoading={isLoading} />
      )}
    </div>
  );
};

export default Auth;
