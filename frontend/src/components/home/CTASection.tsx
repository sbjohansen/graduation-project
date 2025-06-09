import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
      const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/10 via-blue-50/50 to-indigo-100/50 dark:from-primary/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-primary/20">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Incident Response?
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the next generation of cybersecurity professionals who are mastering 
              incident response through immersive AI-powered training experiences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center p-4">
                <Clock className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold mb-2">Start Immediately</h3>
                <p className="text-sm text-muted-foreground">No setup required. Begin training in minutes.</p>
              </div>
              
              <div className="flex flex-col items-center p-4">
                <Users className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Team Training</h3>
                <p className="text-sm text-muted-foreground">Train entire teams with collaborative scenarios.</p>
              </div>
              
              <div className="flex flex-col items-center p-4">
                <Shield className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-sm text-muted-foreground">24/7 assistance from our cybersecurity experts.</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="backdrop-blur-sm" onClick={() => navigate('/contact')}>
                Contact Sales
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
