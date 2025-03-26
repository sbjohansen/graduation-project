import { Button } from "../ui/button";
import { ModeToggle } from "../ui/mode-toggle";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full border-b py-4 bg-background">
      <div className="container mx-auto px-2 flex justify-between items-center">
        <nav className="flex gap-4 items-center">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          {isAuthenticated && (
          <Link to="/dashboard">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          )}
          <Link to="/about">
            <Button variant="ghost">About</Button>
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
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="ghost">Login / Register</Button>
            </Link>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
