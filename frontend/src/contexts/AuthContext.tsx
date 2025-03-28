import { jwtDecode } from 'jwt-decode';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminVerified, setIsAdminVerified] = useState<boolean>(false);

  // Function to verify admin status with the server
  const checkAdminStatus = async (): Promise<boolean> => {
    if (!token) {
      return false;
    }

    try {
      const response = await fetch('http://localhost:4000/api/admin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsAdmin(true);
        setIsAdminVerified(true);
        return true;
      } else {
        setIsAdmin(false);
        setIsAdminVerified(true);
        return false;
      }
    } catch (error) {
      setIsAdmin(false);
      setIsAdminVerified(true);
      return false;
    }
  };

  // Verify admin status on token change
  useEffect(() => {
    const verifyAdminStatus = async () => {
      if (token) {
        try {
          const decoded = jwtDecode<UserData>(token);
          setUserData(decoded);

          // Only check admin status if the token indicates admin privileges
          if (decoded.isAdmin) {
            await checkAdminStatus();
          } else {
            setIsAdmin(false);
            setIsAdminVerified(true);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          logout();
        }
      } else {
        setUserData(null);
        setIsAdmin(false);
        setIsAdminVerified(false);
      }
    };

    verifyAdminStatus();
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setIsAdminVerified(false); // Reset admin verification on login
  };

  const logout = () => {
    setToken(null);
    setUserData(null);
    setIsAdmin(false);
    setIsAdminVerified(false);
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
        isAdmin: isAdminVerified ? isAdmin : false,
        checkAdminStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
