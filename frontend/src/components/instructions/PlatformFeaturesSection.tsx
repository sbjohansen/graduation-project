import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Brain, Users, Target, Clock } from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'AI-Powered Team Members',
    description: 'Our advanced AI assumes realistic personas of cybersecurity team members, each with unique personalities, expertise levels, and response patterns.',
    highlights: ['Realistic personality traits', 'Domain-specific expertise', 'Dynamic response patterns'],
    color: 'blue'
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: 'Slack-Based Training',
    description: 'Train in a familiar Slack environment that mirrors real-world incident response communications and workflows.',
    highlights: ['Native Slack integration', 'Real-time messaging', 'Channel organization'],
    color: 'green'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Realistic Scenarios',
    description: 'Experience authentic cybersecurity incidents based on real-world attack patterns and threat intelligence.',
    highlights: ['50+ scenario types', 'Current threat landscape', 'Difficulty scaling'],
    color: 'purple'
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Performance Analytics',
    description: 'Get detailed insights into your decision-making process, response times, and leadership effectiveness.',
    highlights: ['Decision timeline analysis', 'Response time metrics', 'Leadership assessment'],
    color: 'orange'
  },
  {
    icon: <Clock className="h-8 w-8" />,
    title: 'Real-Time Pressure',
    description: 'Experience the stress and time pressure of actual incident response with evolving scenarios and stakeholder demands.',
    highlights: ['Time-sensitive decisions', 'Evolving threats', 'Stakeholder pressure'],
    color: 'red'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Instant Feedback',
    description: 'Receive immediate feedback on your actions and decisions to accelerate learning and skill development.',
    highlights: ['Real-time guidance', 'Expert recommendations', 'Skill gap analysis'],
    color: 'cyan'
  }
];

const PlatformFeaturesSection = () => {
  return (
    <section className="py-8 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Discover the innovative features that make our training platform the most effective 
            way to develop cybersecurity incident response skills.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className={`inline-flex p-3 rounded-full mb-4 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 w-fit`}>
                  <div className={`text-${feature.color}-600 dark:text-${feature.color}-400`}>
                    {feature.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, highlightIndex) => (
                    <div key={highlightIndex} className="flex items-center space-x-2">
                      <div className={`w-2 h-2 bg-${feature.color}-500 rounded-full`} />
                      <span className="text-sm font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeaturesSection;
