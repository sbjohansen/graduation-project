import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Clock, Shield, Users, Zap, Target } from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'AI-Powered Scenarios',
    description: 'Dynamic, realistic incident simulations powered by advanced AI that adapts to your responses and skill level.',
    color: 'blue',
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Roleplay Training',
    description: 'Immersive roleplay experiences where you practice real incident response as different team members.',
    color: 'green',
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: 'Real-Time Response',
    description: 'Practice decision-making under pressure with time-sensitive scenarios and immediate feedback.',
    color: 'purple',
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Enterprise-Grade Security',
    description: 'Train on actual threat patterns and attack vectors used by sophisticated adversaries.',
    color: 'red',
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Skill Assessment',
    description: 'Comprehensive performance analytics and skill gap analysis to guide your learning path.',
    color: 'orange',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Instant Deployment',
    description: 'Start training immediately with pre-configured scenarios or create custom incident simulations.',
    color: 'cyan',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Experience the future of cybersecurity training with our innovative AI-driven 
              platform designed for modern incident response teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-full mb-4 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 w-fit`}>
                    <div className={`text-${feature.color}-600 dark:text-${feature.color}-400`}>
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
