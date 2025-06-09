import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Mail } from 'lucide-react';

const teamMembers = [
  {
    name: 'Dr. Sarah Chen',
    role: 'Chief Executive Officer',
    bio: 'Former cybersecurity training director at SANS Institute with 15+ years developing incident response curricula for government and enterprise.',    education: 'Ph.D. Computer Science, MIT',
    certifications: ['CISSP', 'CISM', 'GCIH'],
    image: '/src/assets/images/avatar-dr-sarah.png',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Chief Technology Officer',
    bio: 'Ex-Google AI researcher who pioneered machine learning applications for cybersecurity education and simulation platforms.',    education: 'M.S. Artificial Intelligence, Stanford',
    certifications: ['CISA', 'CCSP', 'CEH'],
    image: '/src/assets/images/avatar-marcus.png',
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Chief Learning Officer',
    bio: 'Former DoD cybersecurity instructor and architect of advanced incident response training programs for critical infrastructure sectors.',    education: 'Ph.D. Educational Technology, Carnegie Mellon',
    certifications: ['CISSP', 'GCIH', 'CRISC'],
    image: '/src/assets/images/avatar-dr-emily.png',
  },
  {
    name: 'David Kim',
    role: 'VP of Curriculum Development',
    bio: 'Veteran incident responder and training designer with expertise in creating realistic scenarios based on real-world breaches.',    education: 'M.S. Digital Forensics, SANS',
    certifications: ['GCIH', 'GNFA', 'GCFA'],
    image: '/src/assets/images/avatar-david.png',
  },
  {
    name: 'Lisa Thompson',
    role: 'VP of Customer Education',
    bio: 'Enterprise training consultant with 12+ years helping organizations build effective cybersecurity learning programs.',    education: 'MBA, Wharton',
    certifications: ['CISA', 'CISM', 'PMP'],
    image: '/src/assets/images/avatar-lisa.png',
  },
  {
    name: 'Alex Johnson',
    role: 'Lead Training Architect',
    bio: 'Learning experience designer and former cybersecurity bootcamp instructor, expert in immersive educational technologies.',    education: 'B.S. Computer Engineering, UC Berkeley',
    certifications: ['CCSP', 'CTT+', 'CISSP'],
    image: '/src/assets/images/avatar-alex.png',
  },
];

const TeamSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our executive team brings together decades of experience from leading cybersecurity 
              training institutions, educational technology companies, and hands-on incident response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>                  <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-purple-100/50 dark:from-primary/30 dark:to-purple-900/30">
                      <img 
                        src={member.image} 
                        alt={`${member.name} - ${member.role}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-primary font-medium">{member.role}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Education</p>
                    <p className="text-xs text-muted-foreground">{member.education}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.certifications.map((cert, certIndex) => (
                        <Badge key={certIndex} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3 pt-2">
                    <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                      <Linkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                      <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">              <div className="relative">
                <div className="aspect-video rounded-xl overflow-hidden">
                  <img 
                    src="/src/assets/images/team-photo.png" 
                    alt="SecureShield Solutions expert cybersecurity team"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Our Expert Team</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Beyond our leadership team, SecureShield Solutions employs over 150 cybersecurity 
                  professionals, including certified ethical hackers, forensic analysts, threat 
                  intelligence specialists, and incident response coordinators.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">150+</div>
                    <div className="text-sm text-muted-foreground">Security Experts</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Global Coverage</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Certifications</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">15</div>
                    <div className="text-sm text-muted-foreground">Avg. Years Exp.</div>
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

export default TeamSection;
