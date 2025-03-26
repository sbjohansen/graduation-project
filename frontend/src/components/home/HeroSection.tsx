import { InfoIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

const HeroSection = () => {
  return (
    <div className="w-full relative overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Decorative elements - subtle borders */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <HeroTitle />
          <HeroDescription />
          <HeroActions />
        </div>
      </div>
    </div>
  );
};

const HeroTitle = () => (
  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 gradient-text">Lorem ipsum</h1>
);

const HeroDescription = () => (
  <p className="text-lg md:text-xl mb-8 text-foreground font-medium">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
  </p>
);

const HeroActions = () => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
    <HeroButton />
    <HeroAlert />
  </div>
);

const HeroButton = () => (
  <Button size="lg" className="gradient-button shadow-md text-white font-medium">
    Get Started
  </Button>
);

const HeroAlert = () => (
  <Alert className="card-glass mt-4 sm:mt-0 shadow-md border-white/20 bg-white/30 dark:bg-slate-800/20">
    <InfoIcon className="h-4 w-4 text-primary dark:text-white" />
    <AlertTitle className="font-semibold text-foreground dark:text-white">New Features!</AlertTitle>
    <AlertDescription className="text-foreground/90 dark:text-white/90">
      Check out our latest updates and improvements.
    </AlertDescription>
  </Alert>
);

export default HeroSection;
