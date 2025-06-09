import { PageTitle } from '../components/PageTitle';
import AboutHeroSection from '../components/about/HeroSection';
import CompanyStorySection from '../components/about/CompanyStorySection';
import MissionVisionSection from '../components/about/MissionVisionSection';
import TeamSection from '../components/about/TeamSection';
import AchievementsSection from '../components/about/AchievementsSection';
import ContactSection from '../components/about/ContactSection';

const AboutUs = () => {
  return (
    <>
      <PageTitle title="About SecureShield Solutions" />
      <div className="min-h-screen">
        <AboutHeroSection />
        <CompanyStorySection />
        <MissionVisionSection />
        <TeamSection />
        <AchievementsSection />
        <ContactSection />
      </div>
    </>
  );
};

export default AboutUs;
