import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, BarChart3, Trophy, Users, Zap } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Play className="h-6 w-6" />,
    title: 'Choose Your Scenario',
    description: 'Select from 50+ realistic incident types including ransomware, data breaches, APT attacks, and more.',
    color: 'blue',
  },
  {
    number: '02',
    icon: <Users className="h-6 w-6" />,
    title: 'Assume Your Role',
    description: 'Take on the role of CISO, SOC Analyst, Incident Commander, or other key positions in the response team.',
    color: 'green',
  },
  {
    number: '03',
    icon: <Zap className="h-6 w-6" />,
    title: 'Respond to the Crisis',
    description: 'Make critical decisions under pressure as the AI simulates realistic stakeholder reactions and evolving threats.',
    color: 'purple',
  },
  {
    number: '04',
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Analyze Performance',
    description: 'Get detailed feedback on your response time, decision quality, and areas for improvement.',
    color: 'orange',
  },
];

const TrainingProcessSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our proven 4-step training methodology helps you build real-world incident response 
              skills through hands-on experience and expert feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="text-center h-full">
                  <CardContent className="pt-8">
                    <div className="relative mb-6">
                      <div className="text-6xl font-bold text-muted-foreground/20 absolute -top-4 left-1/2 transform -translate-x-1/2">
                        {step.number}
                      </div>
                      <div className={`inline-flex p-3 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/30 relative z-10`}>
                        <div className={`text-${step.color}-600 dark:text-${step.color}-400`}>
                          {step.icon}
                        </div>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-blue-50/50 dark:from-primary/10 dark:to-blue-900/20 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center mb-4">
                  <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
                  <h3 className="text-2xl md:text-3xl font-bold">Ready to Start Training?</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Join thousands of cybersecurity professionals who have improved their incident 
                  response skills through our immersive training platform. Start with a free trial 
                  and see the difference AI-powered scenarios can make.
                </p>                
              </div>
              
              <div className="relative">
                <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-8 backdrop-blur-sm">
                  <h4 className="text-lg font-semibold mb-6 text-center">Training Impact Metrics</h4>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">60%</div>
                      <div className="text-sm text-muted-foreground">Faster Response</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">95%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10K+</div>
                      <div className="text-sm text-muted-foreground">Trained Users</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                        <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
                      <div className="text-sm text-muted-foreground">AI Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingProcessSection;
