import HeroSection from '../components/home/HeroSection';
import { PageTitle } from '../components/PageTitle';

const Home = () => {
  return (
    <>
      <PageTitle title="Home" />
      <div className="flex flex-col relative z-10">
        <div className="hero-container relative">
          <HeroSection />
        </div>
      </div>
    </>
  );
};

export default Home;
