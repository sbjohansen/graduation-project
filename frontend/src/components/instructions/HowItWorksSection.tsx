import { Card, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Users, Play, Clock, MessageSquare, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <UserPlus className="h-6 w-6" />,
    title: 'Create Your Account',
    description: 'Sign up for SecureShield Solutions and complete your profile setup with your cybersecurity role and experience level.',
    details: [
      'Choose your role (CISO, SOC Analyst, Incident Commander, etc.)',
      'Set your experience level for appropriate scenario difficulty',
      'Complete security clearance verification if required'
    ],
    color: 'blue'
  },
  {
    number: '02',
    icon: <Users className="h-6 w-6" />,
    title: 'Join Slack Workspace',
    description: 'Connect to your dedicated Slack workspace where all training scenarios take place in a realistic team environment.',
    details: [
      'Receive invitation to private Slack workspace',
      'Meet your AI team members and understand their roles',
      'Familiarize yourself with communication channels'
    ],
    color: 'green'
  },
  {
    number: '03',
    icon: <Play className="h-6 w-6" />,
    title: 'Choose Training Scenario',
    description: 'Select from 50+ realistic cybersecurity incident scenarios ranging from ransomware attacks to data breaches.',
    details: [
      'Browse scenarios by difficulty and incident type',
      'Review learning objectives and estimated duration',
      'Select single-player or team training mode'
    ],
    color: 'purple'
  },
  {
    number: '04',
    icon: <Clock className="h-6 w-6" />,
    title: 'Scenario Activation',
    description: 'We launch your selected scenario with AI-powered team members ready to respond to your leadership and guidance.',
    details: [
      'AI team members assume realistic personas and roles',
      'Initial incident alert is distributed to the team',
      'Communication channels are activated for coordination'
    ],
    color: 'orange'
  },
  {
    number: '05',
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'Lead Your Team',
    description: 'Navigate your AI team through the incident response process, making critical decisions under pressure.',
    details: [
      'Coordinate response efforts across multiple teams',
      'Make real-time decisions as the situation evolves',
      'Communicate with stakeholders and external parties'
    ],
    color: 'red'
  },
  {
    number: '06',
    icon: <CheckCircle className="h-6 w-6" />,
    title: 'Receive Feedback',
    description: 'Get detailed performance analysis and expert recommendations to improve your incident response skills.',
    details: [
      'Comprehensive timeline of your decisions and actions',
      'Performance metrics and response time analysis',
      'Expert recommendations for skill improvement'
    ],
    color: 'cyan'
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our proven 6-step training methodology provides immersive, realistic cybersecurity 
            incident response training through AI-powered team simulations.
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-1 p-6 bg-muted/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-muted-foreground/40 mb-2">
                      {step.number}
                    </div>
                    <div className={`inline-flex p-3 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/30`}>
                      <div className={`text-${step.color}-600 dark:text-${step.color}-400`}>
                        {step.icon}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-11 p-6">
                  <div className="flex items-center mb-3">
                    <CardTitle className="text-xl mr-3">{step.title}</CardTitle>
                    <Badge variant="outline" className={`text-${step.color}-600 border-${step.color}-200`}>
                      Step {step.number}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-start space-x-2">
                        <div className={`w-2 h-2 bg-${step.color}-500 rounded-full mt-2 flex-shrink-0`} />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
