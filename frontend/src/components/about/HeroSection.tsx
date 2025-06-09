import { BookOpen, Brain, Users } from 'lucide-react';

const AboutHeroSection = () => {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-slate-900/50 dark:via-blue-900/30 dark:to-indigo-900/50" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
              <Brain className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
            Mastering Incident Response
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            SecureShield Solutions is an AI-powered cybersecurity training platform that prepares 
            professionals for real-world incident response through immersive roleplay scenarios.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center p-6 card-glass rounded-lg">
              <Brain className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">AI-Powered Training</h3>
              <p className="text-sm text-muted-foreground text-center">
                Realistic scenarios powered by advanced AI to simulate real incidents
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 card-glass rounded-lg">
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Hands-On Learning</h3>
              <p className="text-sm text-muted-foreground text-center">
                Interactive roleplay exercises based on actual incident case studies
              </p>
            </div>
            
            <div className="flex flex-col items-center p-6 card-glass rounded-lg">
              <Users className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold text-lg mb-2">Expert Instructors</h3>
              <p className="text-sm text-muted-foreground text-center">
                Learn from certified incident response professionals and industry veterans
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHeroSection;
