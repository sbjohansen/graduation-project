import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, FileText, MessageCircle, Users, Clock, CheckCircle2 } from 'lucide-react';

const scenarios = [
  {
    id: 'ransomware',
    title: 'Ransomware Attack',
    difficulty: 'Advanced',
    duration: '45-60 min',
    description: 'Lead your team through a sophisticated ransomware attack affecting critical business systems.',
    objectives: [
      'Rapid threat containment and isolation',
      'Stakeholder communication and updates',
      'Recovery strategy implementation',
      'Post-incident analysis and documentation'
    ],
    teamRoles: ['SOC Analyst', 'IT Manager', 'Legal Counsel', 'Communications Lead', 'Executive Sponsor']
  },
  {
    id: 'data-breach',
    title: 'Data Breach Response',
    difficulty: 'Intermediate',
    duration: '30-45 min',
    description: 'Manage the response to a data breach involving customer personal information.',
    objectives: [
      'Breach scope assessment and containment',
      'Regulatory compliance and notification',
      'Customer communication strategy',
      'Evidence preservation and forensics'
    ],
    teamRoles: ['Security Analyst', 'Privacy Officer', 'Public Relations', 'Legal Team', 'Forensics Expert']
  },
  {
    id: 'apt-attack',
    title: 'Advanced Persistent Threat',
    difficulty: 'Expert',
    duration: '60-90 min',
    description: 'Counter a nation-state level APT that has established persistence in your network.',
    objectives: [
      'Threat hunting and attribution',
      'Covert monitoring and intelligence gathering',
      'Strategic response planning',
      'Coordination with external agencies'
    ],
    teamRoles: ['Threat Hunter', 'Intelligence Analyst', 'Network Engineer', 'Government Liaison', 'CISO']
  }
];

const TrainingExamplesSection = () => {
  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Training Scenarios</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Explore real-world cybersecurity incidents that you'll train on, each designed to 
            challenge different aspects of incident response leadership.
          </p>
        </div>

        <Tabs defaultValue="ransomware" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {scenarios.map((scenario) => (
              <TabsTrigger key={scenario.id} value={scenario.id} className="text-xs sm:text-sm">
                {scenario.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {scenarios.map((scenario) => (
            <TabsContent key={scenario.id} value={scenario.id} className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl mb-2">{scenario.title}</CardTitle>
                      <p className="text-muted-foreground">{scenario.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge 
                        variant={scenario.difficulty === 'Expert' ? 'destructive' : 
                               scenario.difficulty === 'Advanced' ? 'default' : 'secondary'}
                      >
                        {scenario.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {scenario.duration}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                        Learning Objectives
                      </h4>
                      <ul className="space-y-2">
                        {scenario.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-600" />
                        AI Team Members
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {scenario.teamRoles.map((role, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-purple-100/50 dark:from-primary/30 dark:to-purple-900/30 rounded-full flex items-center justify-center text-sm">
                              👤
                            </div>
                            <span className="text-sm font-medium">{role}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Scenario Progression</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Each scenario evolves dynamically based on your decisions. The AI team members will react 
              realistically to your leadership style, creating an authentic incident response experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium">Real-time Communication</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">Dynamic Documentation</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Team Coordination</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingExamplesSection;
