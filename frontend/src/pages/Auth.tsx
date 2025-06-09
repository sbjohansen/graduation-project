import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { PageTitle } from '../components/PageTitle';
import { useAuth } from '../contexts/AuthContext';

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
      console.error('Auth error:', error instanceof Error ? error.message : String(error));
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
      console.error('Auth error:', error instanceof Error ? error.message : String(error));
      setErrorMessage('Failed to connect to authentication service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isLogin ? 'Sign In - SecureShield' : 'Create Account - SecureShield'} />
      <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-background via-background to-background/95">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
            {isLogin ? (
              <LoginForm 
                onSubmit={handleLogin} 
                errorMessage={errorMessage}
                isLoading={isLoading} 
              />
            ) : (
              <RegisterForm 
                onSubmit={handleRegister} 
                errorMessage={errorMessage}
                isLoading={isLoading} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
