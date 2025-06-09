import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Team's Skills?</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Join hundreds of organizations that trust SecureShield Solutions to train 
              their cybersecurity teams. Let's discuss how we can enhance your incident response capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Training Consultations</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Speak with our education specialists
                </p>
                <p className="font-mono text-sm">+1 (555) 123-TRAIN</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Sales & Partnerships</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Learn about our training programs
                </p>
                <p className="text-sm">training@secureshield.com</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Training Center</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Visit our immersive learning facility
                </p>
                <p className="text-sm">1337 Cyber Blvd, Palo Alto, CA 94301</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-blue-50/50 dark:from-primary/10 dark:to-blue-900/20 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Start Your Training Journey Today
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Our cybersecurity education experts are ready to assess your team's current 
                  skill level and design a comprehensive training program tailored to your 
                  organization's unique incident response needs and compliance requirements.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Free skills assessment</span>
                  </div>                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Custom training curriculum</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Skill gap analysis and recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm">Ongoing learning support and mentorship</span>
                  </div>
                </div>
              </div>
                <div className="relative">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img 
                    src="/src/assets/images/office-location.png" 
                    alt="SecureShield Solutions headquarters and training facility"
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

export default ContactSection;
