import { PageTitle } from '../components/PageTitle';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { 
  HowItWorksSection, 
  PlatformFeaturesSection, 
  TrainingExamplesSection 
} from '../components/instructions';

const Instructions = () => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleDrillsClick = () => {
    navigate('/drills');
  };

  return (
    <>
      <PageTitle title="Instructions" />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                How to Master Cybersecurity Training
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Learn how to navigate our AI-powered incident response training platform and 
                develop the skills needed to lead effective cybersecurity responses in real-world scenarios.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Platform Features Section */}
        <PlatformFeaturesSection />

        {/* Training Examples Section */}
        <TrainingExamplesSection />

        {/* Getting Started CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-br from-primary/10 via-blue-50/50 to-indigo-100/50 dark:from-primary/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Begin Your Training?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Start developing your cybersecurity incident response skills today with our comprehensive training platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleDashboardClick}
                    size="lg"
                    className="gradient-button"
                  >
                    Return to Dashboard
                  </Button>
                  <Button 
                    onClick={handleDrillsClick}
                    size="lg"
                    variant="outline"
                    className="backdrop-blur-sm"
                  >
                    Browse Scenarios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Instructions;
