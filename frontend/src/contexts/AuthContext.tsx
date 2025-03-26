import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserData {
  id: number;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  token: string | null;
  userData: UserData | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Parse the token and set user data
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<UserData>(token);
        setUserData(decoded);
        setIsAdmin(!!decoded.isAdmin);
      } catch (error) {
        console.error('Error decoding token:', error);
        logout(); // If token is invalid, log the user out
      }
    } else {
      setUserData(null);
      setIsAdmin(false);
    }
  }, [token]);

  // Function to verify admin status with the server
  const checkAdminStatus = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch('http://localhost:4000/api/admin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return true;
      } else {
        // If server rejects admin status, update local state
        if (isAdmin) setIsAdmin(false);
        return false;
      }
    } catch (error) {
      console.error('Error verifying admin status:', error);
      return false;
    }
  };

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);

    try {
      const decoded = jwtDecode<UserData>(newToken);
      setUserData(decoded);
      setIsAdmin(!!decoded.isAdmin);
    } catch (error) {
      console.error('Error decoding token after login:', error);
      setUserData(null);
      setIsAdmin(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
    setIsAdmin(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userData,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
