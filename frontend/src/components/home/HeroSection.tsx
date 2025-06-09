import { Play, Shield, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="w-full relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Content */}
          <div className="max-w-4xl">
            <HeroTitle />
            <HeroDescription />
            <HeroActions />
            <HeroStats />
          </div>
          
          {/* Right side - Shield Logo */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-full blur-3xl scale-110" />
              {/* Shield SVG */}
              <div className="relative w-80 h-80 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 100 100" 
                  className="w-full h-full drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(37, 99, 235, 0.3))' }}
                >
                  <defs>
                    <linearGradient id="heroShieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#2563eb', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                  
                  {/* Shield outline */}
                  <path 
                    d="M50 10 L20 25 L20 55 Q20 75 50 85 Q80 75 80 55 L80 25 Z" 
                    fill="url(#heroShieldGradient)" 
                    stroke="#1e40af" 
                    strokeWidth="2"
                  />
                  
                  {/* Inner shield detail */}
                  <path 
                    d="M50 18 L28 30 L28 52 Q28 68 50 76 Q72 68 72 52 L72 30 Z" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="1.5" 
                    opacity="0.7"
                  />
                  
                  {/* Security symbol in center */}
                  <circle 
                    cx="50" 
                    cy="45" 
                    r="8" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    opacity="0.9"
                  />
                  <path 
                    d="M50 35 L50 55 M42 45 L58 45" 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    opacity="0.9"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroTitle = () => (
  <div className="mb-6">
    <Badge variant="secondary" className="mb-4">
      🚀 AI-Powered Training Platform
    </Badge>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">
      Master Cybersecurity Incident Response
    </h1>
  </div>
);

const HeroDescription = () => (
  <p className="text-lg md:text-xl mb-8 text-muted-foreground font-medium leading-relaxed">
    Train on real-world cyber attack scenarios through immersive AI-powered roleplay simulations. 
    Build critical incident management skills in a safe, controlled environment.
  </p>
);

const HeroActions = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-12">
      <Button variant="outline" size="lg" className="backdrop-blur-sm" onClick={() => navigate('/about')}>
        Read more
      </Button>
    </div>
  )
}

const HeroStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="flex items-center space-x-3 p-4 card-glass rounded-lg">
      <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <div className="text-2xl font-bold">50+</div>
        <div className="text-sm text-muted-foreground">Scenario Types</div>
      </div>
    </div>
    
    <div className="flex items-center space-x-3 p-4 card-glass rounded-lg">
      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
        <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
      </div>
      <div>
        <div className="text-2xl font-bold">10k+</div>
        <div className="text-sm text-muted-foreground">Trained Professionals</div>
      </div>
    </div>
    
    <div className="flex items-center space-x-3 p-4 card-glass rounded-lg">
      <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
        <Play className="h-6 w-6 text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <div className="text-2xl font-bold">24/7</div>
        <div className="text-sm text-muted-foreground">AI Training</div>
      </div>
    </div>
  </div>
);

export default HeroSection;
