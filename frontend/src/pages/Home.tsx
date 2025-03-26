import HeroSection from '../components/home/HeroSection';

const Home = () => {
  return (
    <div className="flex flex-col relative z-10">
      <div className="hero-container relative">
        <HeroSection />
      </div>
    </div>
  );
};

export default Home;
