import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { ModeToggle } from '../ui/mode-toggle';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Menu, Shield } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="w-full sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border/40">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2" onClick={handleNavClick}>
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg hidden sm:block">SecureShield</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 items-center">
          <Link to="/">
            <Button variant="ghost" className="font-medium text-foreground">
              Home
            </Button>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-foreground">
                  Dashboard
                </Button>
              </Link>
              <Link to="/drills">
                <Button variant="ghost" className="text-foreground">
                  Drills
                </Button>
              </Link>
              <Link to="/instructions">
                <Button variant="ghost" className="text-foreground">
                  Instructions
                </Button>
              </Link>
            </>
          )}
          <Link to="/about">
            <Button variant="ghost" className="text-foreground">
              About
            </Button>
          </Link>
          <Link to="/contact">
                <Button variant="ghost" className="text-foreground">
                  Contact
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="backdrop-blur-sm text-foreground border-border/60"
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

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <SheetTitle>SecureShield Solutions</SheetTitle>
                </div>
              </SheetHeader>
              
              <div className="flex flex-col space-y-4 mt-6">
                <Link to="/" onClick={handleNavClick}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    Home
                  </Button>
                </Link>
                
                {isAuthenticated && (
                  <>
                    <Link to="/dashboard" onClick={handleNavClick}>
                      <Button variant="ghost" className="w-full justify-start text-foreground">
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/drills" onClick={handleNavClick}>
                      <Button variant="ghost" className="w-full justify-start text-foreground">
                        Drills
                      </Button>
                    </Link>
                    <Link to="/instructions" onClick={handleNavClick}>
                      <Button variant="ghost" className="w-full justify-start text-foreground">
                        Instructions
                      </Button>
                    </Link>
                    <Link to="/contact" onClick={handleNavClick}>
                      <Button variant="ghost" className="w-full justify-start text-foreground">
                        Contact
                      </Button>
                    </Link>
                  </>
                )}
                
                <Link to="/about" onClick={handleNavClick}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    About
                  </Button>
                </Link>
                
                {isAuthenticated && isAdmin && (
                  <Link to="/admin" onClick={handleNavClick}>
                    <Button variant="ghost" className="w-full justify-start text-blue-600 dark:text-blue-400">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                
                <div className="pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={handleNavClick}>
                      <Button className="w-full gradient-button">
                        Login / Register
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
