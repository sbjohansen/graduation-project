import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CompanyStorySection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Founded in 2018 by cybersecurity education pioneers, SecureShield Solutions was born 
              from the critical need for hands-on, realistic incident response training that bridges 
              the gap between theory and practice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">The Training Gap We Address</h3>
              <p className="text-muted-foreground leading-relaxed">
                Traditional cybersecurity training relies on outdated simulations and theoretical 
                scenarios that fail to prepare professionals for real-world incidents. Studies show 
                that 75% of security teams feel unprepared when facing their first major breach.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our founders, veteran incident responders from major consulting firms and government 
                agencies, recognized that the industry needed immersive, AI-powered training that 
                replicates the pressure, complexity, and unpredictability of actual cyber incidents.
              </p>
            </div>
              <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden">
                <img 
                  src="/src/assets/images/training-evolution.png" 
                  alt="Evolution of cybersecurity training platform technology"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">2018</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Foundation</h4>
                <p className="text-sm text-muted-foreground">
                  Platform launched with first 50 incident response training scenarios and beta testing.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">2021</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">AI Integration</h4>
                <p className="text-sm text-muted-foreground">
                  Introduced AI-powered roleplay engine, enabling dynamic scenario adaptation.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">2024</CardTitle>
              </CardHeader>
              <CardContent>
                <h4 className="font-semibold mb-2">Global Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Training over 10,000+ professionals with 95% skill improvement success rate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyStorySection;
