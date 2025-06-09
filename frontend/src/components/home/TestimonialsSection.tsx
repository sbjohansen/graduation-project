import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CISO',
    company: 'TechCorp Industries',
    content: 'This platform transformed our incident response capabilities. The AI scenarios are incredibly realistic and helped our team prepare for actual threats.',
    rating: 5,
    avatar: '/src/assets/images/testimonial-sarah.png',
  },
  {
    name: 'Michael Rodriguez',
    role: 'SOC Manager',
    company: 'Financial Services Ltd',
    content: 'The roleplay training is game-changing. Our response times improved by 60% after using this platform for just 3 months.',
    rating: 5,
    avatar: '/src/assets/images/testimonial-michael.png',
  },
  {
    name: 'Dr. Emily Watson',
    role: 'Security Consultant',
    company: 'CyberGuard Solutions',
    content: 'I recommend this to all my clients. The variety of scenarios and real-time feedback make it the best training tool available.',
    rating: 5,
    avatar: '/src/assets/images/testimonial-emily.png',
  },
];

const stats = [
  { value: '98%', label: 'User Satisfaction' },
  { value: '60%', label: 'Faster Response Times' },
  { value: '85%', label: 'Skill Improvement' },
  { value: '500+', label: 'Enterprise Clients' },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Security Leaders
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See what cybersecurity professionals are saying about our training platform 
              and the impact it's had on their incident response capabilities.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-4">
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-muted-foreground text-center leading-relaxed mb-6">
                    "{testimonial.content}"
                  </p>

                  <div className="text-center">                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-purple-100/50 dark:from-primary/30 dark:to-purple-900/30 rounded-full overflow-hidden">
                      <img 
                        src={testimonial.avatar} 
                        alt={`${testimonial.name} - ${testimonial.role} at ${testimonial.company}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-primary font-medium">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust badges */}
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-6">Certified & Trusted</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="px-4 py-2">
                🛡️ SOC 2 Certified
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                🏆 ISO 27001 Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                ✅ GDPR Compliant
              </Badge>
              <Badge variant="outline" className="px-4 py-2">
                🔒 Enterprise Security
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
