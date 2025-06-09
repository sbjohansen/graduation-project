import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Target, Heart } from 'lucide-react';

const MissionVisionSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Purpose</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything we do is guided by our commitment to empowering cybersecurity professionals 
              with the skills and confidence to handle real-world incidents effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Target className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To transform cybersecurity education through immersive, AI-powered training 
                  experiences that prepare professionals for real-world incident response challenges, 
                  bridging the critical gap between theory and practice.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Eye className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To be the global standard for incident response training, creating a world where 
                  every cybersecurity professional is equipped with the practical skills and 
                  confidence to defend against sophisticated cyber threats.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <CardTitle className="text-xl">Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Excellence in education, authenticity in scenarios, and accessibility in learning. 
                  We believe in continuous innovation, collaborative learning, and fostering a 
                  community of skilled cybersecurity defenders.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-blue-50/50 to-indigo-100/50 dark:from-primary/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Commitment</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  We pledge to provide the most realistic and effective incident response training 
                  available, continuously updating our scenarios based on emerging threats and 
                  real-world case studies to ensure our learners stay ahead of evolving challenges.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">24/7/365 monitoring and response</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Zero-tolerance for security compromises</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Continuous innovation and improvement</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Transparent communication and reporting</span>
                  </li>
                </ul>
              </div>
                <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img 
                    src="/src/assets/images/team-values.png" 
                    alt="SecureShield Solutions team values and training approach"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;
