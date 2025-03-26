import { Button } from '../ui/button';
import { ModeToggle } from '../ui/mode-toggle';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Translucent background with blur */}

      <div className="container mx-auto px-2 py-4 flex justify-between items-center relative z-10">
        <nav className="flex gap-4 items-center">
          <Link to="/">
            <Button variant="ghost" className="font-medium text-foreground">
              Home
            </Button>
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard">
              <Button variant="ghost" className="text-foreground">
                Dashboard
              </Button>
            </Link>
          )}
          <Link to="/about">
            <Button variant="ghost" className="text-foreground">
              About
            </Button>
          </Link>
          {isAuthenticated && isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" className="text-blue-600 dark:text-blue-400">
                Admin
              </Button>
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="backdrop-blur-sm text-foreground border-white/20 dark:border-slate-700/50"
            >
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button className="gradient-button">Login / Register</Button>
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
