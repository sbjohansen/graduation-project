import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, BookOpen, TrendingUp, Users } from 'lucide-react';

const achievements = [
  {
    year: '2024',
    title: 'Best Cybersecurity Training Platform',
    organization: 'Cybersecurity Education Alliance',
    description: 'Recognized for most innovative incident response training methodology',
    icon: <Award className="h-8 w-8" />,
  },
  {
    year: '2023',
    title: 'Excellence in Educational Technology',
    organization: 'EdTech Breakthrough Awards',
    description: 'Winner for best AI-powered learning platform in cybersecurity',
    icon: <BookOpen className="h-8 w-8" />,
  },
  {
    year: '2023',
    title: 'Inc. 5000 Fastest Growing Companies',
    organization: 'Inc. Magazine',
    description: 'Ranked #89 with 520% growth in training platform adoption',
    icon: <TrendingUp className="h-8 w-8" />,
  },
  {
    year: '2022',
    title: 'Training Innovation Award',
    organization: 'SANS Institute',
    description: 'Recognized for revolutionary roleplay-based learning approach',
    icon: <Users className="h-8 w-8" />,
  },
];

const certifications = [
  'SOC 2 Type II',
  'ISO 27001',
  'FERPA Compliant',
  'SCORM Compatible',
  'GDPR Compliant',
  'WCAG 2.1 AA',
];

const AchievementsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Recognition & Achievements</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our commitment to educational excellence has been recognized by leading cybersecurity 
              organizations, educational institutions, and industry training authorities worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {achievements.map((achievement, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <div className="text-primary">{achievement.icon}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <Badge variant="secondary">{achievement.year}</Badge>
                      </div>
                      <p className="text-sm text-primary font-medium">{achievement.organization}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Educational Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We maintain the highest educational and security standards through rigorous 
                  certification processes and continuous content validation.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Training Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Learner Satisfaction</span>
                    <span className="text-2xl font-bold text-green-600">96.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Skill Improvement Rate</span>
                    <span className="text-2xl font-bold text-blue-600">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Course Completion Rate</span>
                    <span className="text-2xl font-bold text-purple-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Professionals Trained</span>
                    <span className="text-2xl font-bold text-red-600">12K+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-blue-50/50 to-indigo-100/50 dark:from-primary/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Trusted by Leading Organizations</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Over 350 organizations across healthcare, finance, government, and technology 
              sectors trust SecureShield Solutions to train their cybersecurity teams.
            </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { id: 1, name: "TechCorp", logo: "/src/assets/images/client-logo-1.png" },
                { id: 2, name: "SecureBank", logo: "/src/assets/images/client-logo-2.png" },
                { id: 3, name: "HealthSystem", logo: "/src/assets/images/client-logo-3.png" },
                { id: 4, name: "GovAgency", logo: "/src/assets/images/client-logo-4.png" }
              ].map((client) => (
                <div key={client.id} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white/80 dark:bg-slate-700/80 rounded-lg overflow-hidden">
                    <img 
                      src={client.logo} 
                      alt={`${client.name} - Training Partner`}
                      className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{client.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
