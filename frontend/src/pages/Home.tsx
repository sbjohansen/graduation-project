import { PageTitle } from '../components/PageTitle';
import {
  HeroSection,
  FeaturesSection,
  TrainingProcessSection,
  TestimonialsSection,
  CTASection
} from '../components/home';

const Home = () => {
  return (
    <>
      <PageTitle title="SecureShield Solutions - AI-Powered Cybersecurity Training" />
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <TrainingProcessSection />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  );
};

export default Home;
