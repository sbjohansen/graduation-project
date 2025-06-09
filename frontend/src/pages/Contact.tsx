import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTitle } from '@/components/PageTitle';
import { 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Shield,
  Users,
  HeadphonesIcon,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Contact = () => {
  return (
    <>
      <PageTitle title="Contact Us" />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get in Touch with SecureShield
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Ready to strengthen your cybersecurity posture? Our team of experts is here to help you 
                navigate the complex world of incident response training and security solutions.
              </p>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Emergency Support */}
              <Card className="text-center bg-gradient-to-br from-red-50/50 to-orange-100/50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200/50 dark:border-red-800/50">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                      <Phone className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-red-700 dark:text-red-400">24/7 Emergency Hotline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Immediate incident response for active security breaches
                    </p>
                    <div className="space-y-2">
                      <p className="font-mono text-lg font-bold text-red-600 dark:text-red-400">
                        +1 (555) 123-SECURE
                      </p>
                      <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
                        Emergency Only
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      For existing enterprise clients experiencing active incidents
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Sales & General Inquiries */}
              <Card className="text-center bg-gradient-to-br from-blue-50/50 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-800/50">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-blue-700 dark:text-blue-400">Sales & Partnerships</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Learn about our training solutions and enterprise services
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold">sales@secureshield.com</p>
                      <p className="font-mono text-lg">+1 (555) 987-6543</p>
                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                        Business Hours
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Monday - Friday, 8:00 AM - 6:00 PM PST
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Support */}
              <Card className="text-center bg-gradient-to-br from-green-50/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/30">
                      <HeadphonesIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-green-700 dark:text-green-400">Technical Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Platform assistance and training guidance
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold">support@secureshield.com</p>
                      <p className="font-mono text-lg">+1 (555) 456-7890</p>
                      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                        24/7 Available
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Live chat available on our platform
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Office Locations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Headquarters */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Global Headquarters</CardTitle>
                      <p className="text-sm text-muted-foreground">Silicon Valley Campus</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-semibold mb-2">SecureShield Solutions HQ</p>
                      <p className="text-sm text-muted-foreground">
                        1337 Cyber Boulevard<br />
                        Palo Alto, CA 94301<br />
                        United States
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Visitor Hours: Mon-Fri 9:00 AM - 5:00 PM PST</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Security clearance required for facility visits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regional Office */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/30">
                      <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Regional Operations</CardTitle>
                      <p className="text-sm text-muted-foreground">East Coast Hub</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="font-semibold mb-2">SecureShield East</p>
                      <p className="text-sm text-muted-foreground">
                        789 Security Drive<br />
                        McLean, VA 22102<br />
                        United States
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Operations: Mon-Fri 6:00 AM - 8:00 PM EST</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span>24/7 Security Operations Center</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form Section */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Send Us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Have questions about our training platform or need a custom solution? 
                  We'd love to hear from you.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input 
                          type="text" 
                          className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input 
                        type="email" 
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="john.doe@company.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Company</label>
                      <input 
                        type="text" 
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        placeholder="Your Organization"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Subject</label>
                      <select className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors">
                        <option>Training Platform Inquiry</option>
                        <option>Enterprise Solutions</option>
                        <option>Technical Support</option>
                        <option>Partnership Opportunities</option>
                        <option>Media & Press</option>
                        <option>Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Message</label>
                      <textarea 
                        rows={4}
                        className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        placeholder="Tell us about your cybersecurity training needs..."
                      />
                    </div>
                    
                    <Button className="w-full gradient-button text-lg py-3">
                      Send Message
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  {/* Contact Info & Benefits */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-primary/10 via-blue-50/50 to-indigo-100/50 dark:from-primary/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Why Choose SecureShield?</h3>
                      <div className="space-y-3">
                        {[
                          'Industry-leading incident response training',
                          'AI-powered realistic scenarios',
                          'Expert-designed curricula',
                          '24/7 enterprise support',
                          'Compliance-ready documentation',
                          'Custom training programs'
                        ].map((benefit, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Response Times</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Emergency Incidents</span>
                          <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                            &lt; 15 min
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Sales Inquiries</span>
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                            &lt; 2 hours
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Technical Support</span>
                          <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                            &lt; 4 hours
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">General Inquiries</span>
                          <Badge variant="outline">
                            &lt; 24 hours
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
